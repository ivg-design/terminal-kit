const DEFAULT_COLOR = '#00ff41';
const STORAGE_KEY = 'terminal-kit-demo-accent';

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex) => {
  const cleaned = hex.replace('#', '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = parseInt(full, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
};

const rgbToHex = ({ r, g, b }) => {
  const toHex = (v) => v.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const rgbToHsl = ({ r, g, b }) => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s, l };
};

const hslToRgb = ({ h, s, l }) => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

const setAccent = (hex) => {
  const root = document.documentElement;
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb);

  const dim = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 0.7) });
  const bright = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 1.2) });
  const dark = hslToRgb({ h: hsl.h, s: hsl.s, l: clamp(hsl.l * 0.5) });

  root.style.setProperty('--tk-green', hex);
  root.style.setProperty('--tk-green-dim', rgbToHex(dim));
  root.style.setProperty('--tk-green-bright', rgbToHex(bright));
  root.style.setProperty('--tk-green-dark', rgbToHex(dark));
  root.style.setProperty('--tk-green-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
  root.style.setProperty('--terminal-green', hex);
  root.style.setProperty('--terminal-green-dim', rgbToHex(dim));
  root.style.setProperty('--terminal-green-bright', rgbToHex(bright));
  root.style.setProperty('--terminal-green-dark', rgbToHex(dark));
  root.style.setProperty('--terminal-green-glow', `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
};

const injectStyles = () => {
  if (document.getElementById('demo-color-picker-styles')) return;
  const style = document.createElement('style');
  style.id = 'demo-color-picker-styles';
  style.textContent = `
    .demo-color-picker {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border: 1px solid var(--terminal-gray-light, #333);
      background: var(--terminal-black, #0a0a0a);
      color: var(--terminal-green, #00ff41);
      font-family: var(--font-mono, monospace);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .demo-color-picker.floating {
      position: fixed;
      top: 12px;
      right: 12px;
      z-index: 2000;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.4);
    }

    .demo-color-picker input[type="color"] {
      width: 26px;
      height: 20px;
      border: 1px solid var(--terminal-gray-light, #333);
      background: transparent;
      padding: 0;
      cursor: pointer;
    }

    .demo-color-picker button {
      background: transparent;
      border: 1px solid var(--terminal-green-dim, #00cc33);
      color: var(--terminal-green-dim, #00cc33);
      font-size: 9px;
      padding: 2px 6px;
      text-transform: uppercase;
      cursor: pointer;
    }

    .demo-color-picker button:hover {
      border-color: var(--terminal-green, #00ff41);
      color: var(--terminal-green, #00ff41);
    }
  `;
  document.head.appendChild(style);
};

const mountPicker = () => {
  injectStyles();

  const container = document.createElement('div');
  container.className = 'demo-color-picker';
  container.innerHTML = `
    <span>Accent</span>
    <input type="color" aria-label="Accent color">
    <button type="button">Reset</button>
  `;

  const input = container.querySelector('input');
  const reset = container.querySelector('button');

  const stored = localStorage.getItem(STORAGE_KEY) || DEFAULT_COLOR;
  input.value = stored;
  setAccent(stored);

  input.addEventListener('input', (e) => {
    const value = e.target.value;
    setAccent(value);
    localStorage.setItem(STORAGE_KEY, value);
  });

  reset.addEventListener('click', () => {
    input.value = DEFAULT_COLOR;
    setAccent(DEFAULT_COLOR);
    localStorage.removeItem(STORAGE_KEY);
  });

  const headerControls = document.querySelector('.demo-header-controls');
  if (headerControls) {
    headerControls.appendChild(container);
  } else {
    container.classList.add('floating');
    document.body.appendChild(container);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountPicker);
} else {
  mountPicker();
}
