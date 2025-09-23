/**
 * Dev-only: capture ALL console calls with deep stacks + async ancestry
 */

// Make stacks deep (Supported in V8/Chromium; harmless elsewhere.)
Error.stackTraceLimit = 100;

const ORIG = {
	log: console.log.bind(console),
	info: console.info.bind(console),
	warn: console.warn.bind(console),
	error: console.error.bind(console),
	debug: console.debug.bind(console),
};

const SELF_RE = /console-capture(\.js|\.ts)/;

function cleanStack(raw) {
	if (!raw) return undefined;
	const lines = raw.split('\n');
	// drop banner "Error: …", and our own frames
	const cleaned = lines.slice(1).filter((l) => !SELF_RE.test(l));
	return cleaned.length ? cleaned.join('\n') : undefined;
}

function parseV8(raw) {
	if (!raw) return undefined;
	const frames = [];
	const re = /^\s*at\s+(?:(.*?)\s+\()?(.+?):(\d+):(\d+)\)?$/;
	const lines = raw.split('\n');
	for (let i = 1; i < lines.length; i++) {
		const l = lines[i];
		if (SELF_RE.test(l)) continue;
		const m = l.match(re);
		if (m) frames.push({ fn: m[1] || undefined, file: m[2], line: +m[3], col: +m[4] });
	}
	return frames.length ? frames : undefined;
}

function capNow() {
	const e = new Error('cap');
	const raw = e.stack || undefined;
	const cleaned = cleanStack(raw);
	return { raw: cleaned, frames: parseV8(raw) };
}

// Async ancestry stitching: record where callbacks were scheduled
let CURRENT_ASYNC_SCHEDULED_AT;

function stitchAsync(stackRaw) {
	if (!stackRaw && !CURRENT_ASYNC_SCHEDULED_AT) return stackRaw;
	if (CURRENT_ASYNC_SCHEDULED_AT) {
		const sep = '\n[async scheduled at]\n';
		return (stackRaw || 'Error\n').replace(/^Error\n?/, '') + sep + CURRENT_ASYNC_SCHEDULED_AT;
	}
	return stackRaw;
}

// Wrap scheduling APIs to capture ancestry
function captureScheduleSite() {
	return cleanStack(new Error('scheduled').stack);
}

function wrapTimer(key) {
	const orig = window[key];
	window[key] = function wrapped(fn, ...rest) {
		const sched = captureScheduleSite();
		return orig(
			function callbackWrapper(...args) {
				const prev = CURRENT_ASYNC_SCHEDULED_AT;
				CURRENT_ASYNC_SCHEDULED_AT = sched;
				try {
					return fn.apply(this, args);
				} finally {
					CURRENT_ASYNC_SCHEDULED_AT = prev;
				}
			},
			...rest
		);
	};
}

function wrapMicrotasks() {
	const qmt = window.queueMicrotask?.bind(window);
	if (qmt) {
		window.queueMicrotask = function (fn) {
			const sched = captureScheduleSite();
			return qmt(function () {
				const prev = CURRENT_ASYNC_SCHEDULED_AT;
				CURRENT_ASYNC_SCHEDULED_AT = sched;
				try {
					fn();
				} finally {
					CURRENT_ASYNC_SCHEDULED_AT = prev;
				}
			});
		};
	}

	const origThen = Promise.prototype.then;
	Promise.prototype.then = function (onFulfilled, onRejected) {
		const sched = captureScheduleSite();
		const wrap = (fn) =>
			typeof fn === 'function'
				? function (...a) {
						const prev = CURRENT_ASYNC_SCHEDULED_AT;
						CURRENT_ASYNC_SCHEDULED_AT = sched;
						try {
							return fn.apply(this, a);
						} finally {
							CURRENT_ASYNC_SCHEDULED_AT = prev;
						}
					}
				: fn;
		return origThen.call(this, wrap(onFulfilled), wrap(onRejected));
	};
}

wrapTimer('setTimeout');
wrapTimer('setInterval');
wrapTimer('requestAnimationFrame');
wrapMicrotasks();

function serializeArg(v) {
	if (v instanceof Error) {
		return { _type: 'Error', name: v.name, message: v.message, stack: v.stack };
	}
	const seen = [];
	try {
		return JSON.parse(
			JSON.stringify(v, function (_k, val) {
				if (typeof val === 'object' && val) {
					if (seen.indexOf(val) !== -1) return '[Circular]';
					seen.push(val);
				}
				return val;
			})
		);
	} catch {
		try {
			return String(v);
		} catch {
			return '[Unserializable]';
		}
	}
}

const endpoint = `${location.protocol}//${location.host}/__logs`;

function send(ev) {
	const body = JSON.stringify(ev);
	fetch(endpoint, {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body,
		keepalive: true,
	}).catch(() => {
		try {
			navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
		} catch {}
	});
}

// Session ID - stored once
if (!window.__LOG_SESSION__) {
	window.__LOG_SESSION__ = Math.random().toString(36).slice(2, 10);
}

// Merge the Error arg's stack with a fresh capture, then stitch async ancestry
function mergedStack(errArgStack) {
	const a = cleanStack(errArgStack);
	const now = capNow().raw;
	let merged;
	if (a && now) {
		// de-dup by lines; keep order
		const seen = new Set();
		const lines = (a + '\n' + now).split('\n').filter((l) => {
			if (seen.has(l)) return false;
			seen.add(l);
			return true;
		});
		merged = lines.join('\n');
	} else {
		merged = a || now;
	}
	return stitchAsync(merged);
}

function formatTimestamp() {
	const now = new Date();
	const year = String(now.getFullYear()).slice(-2);
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
	const seconds = String(now.getSeconds()).padStart(2, '0');
	return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function wrap(level) {
	return function (...args) {
		try {
			ORIG[level](...args);
		} catch {}
		let errArgStack;
		for (let i = 0; i < args.length; i++) {
			const a = args[i];
			if (a instanceof Error && a.stack) {
				errArgStack = a.stack;
				break;
			}
		}
		const stackRaw = mergedStack(errArgStack);

		const ev = {
			ts: formatTimestamp(),
			level,
			url: location.href,
			ua: navigator.userAgent,
			args: args.map(serializeArg),
			stack: stackRaw, // keep the full raw string
			frames: parseV8(stackRaw ? 'Error\n' + stackRaw : undefined), // parsed frames, optional
			session: window.__LOG_SESSION__,
		};
		send(ev);
	};
}

console.log = wrap('log');
console.info = wrap('info');
console.warn = wrap('warn');
console.error = wrap('error');
console.debug = wrap('debug');

addEventListener('error', (e) => {
	const err = e.error instanceof Error ? e.error : new Error(String(e.message || 'Script error'));
	const stack = mergedStack(err.stack);
	send({
		ts: formatTimestamp(),
		level: 'error',
		url: location.href,
		ua: navigator.userAgent,
		args: [serializeArg(err)],
		stack,
		frames: parseV8(stack ? 'Error\n' + stack : undefined),
		session: window.__LOG_SESSION__,
	});
});

addEventListener('unhandledrejection', (e) => {
	const r = e.reason;
	const err = r instanceof Error ? r : new Error(String(r));
	const stack = mergedStack(err.stack);
	send({
		ts: formatTimestamp(),
		level: 'error',
		url: location.href,
		ua: navigator.userAgent,
		args: [serializeArg(r)],
		stack,
		frames: parseV8(stack ? 'Error\n' + stack : undefined),
		session: window.__LOG_SESSION__,
	});
});

// Capture resource load errors (e.g., CORS image/script failures) at capture phase
// These do not surface via window.onerror/console.error automatically.
addEventListener(
  'error',
  (e) => {
    const t = /** @type {Event & { target?: any }} */ (e).target;
    if (!t || t === window) return;
    try {
      const tag = (t.tagName || '').toLowerCase();
      const src = t.src || t.href || t.currentSrc || t.baseURI || '';
      const msg = `Resource load error: <${tag}> ${src}`;
      const stack = capNow().raw; // synthetic capture site for context
      send({
        ts: formatTimestamp(),
        level: 'error',
        url: location.href,
        ua: navigator.userAgent,
        args: [msg],
        stack: stitchAsync(stack),
        frames: parseV8(stack ? 'Error\n' + stack : undefined),
        session: window.__LOG_SESSION__
      });
    } catch {}
  },
  true
);

// Log initial session info (through wrapped console to mirror in logs)
console.log('[Logger] Console capture initialized with async ancestry stitching');
