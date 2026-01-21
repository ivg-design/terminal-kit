/**
 * Terminal Kit Data Generators
 * Log and telemetry data generation for demos
 */

import { eventBus, EVENT_NAMES } from './event-bus.js';

// UUID generator
const uuid = () => crypto.randomUUID?.() ||
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

// Random int in range
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Weighted random choice
const weightedChoice = (items, weights) => {
  const total = weights.reduce((a, b) => a + b, 0);
  let random = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) return items[i];
  }
  return items[items.length - 1];
};

// Sample messages by type
const MESSAGES = {
  system: [
    'Component registry initialized',
    'Loaded {count} web components',
    'Theme variables applied',
    'Grid layout computed',
    'Widget state restored from localStorage',
    'Event bus ready',
    'Demo generators started'
  ],
  ui: [
    'Button clicked: {target}',
    'Tab changed to {target}',
    'Panel collapsed: {target}',
    'Dropdown selection: {value}',
    'Slider value changed to {value}',
    'Toggle switched: {target}'
  ],
  network: [
    'GET /api/components completed',
    'POST /api/theme updated',
    'WebSocket connection established',
    'Fetched {count} items from cache',
    'API rate limit: {remaining} remaining'
  ],
  ai: [
    'Assistant response generated',
    'Tokens processed: {inputTokens} in, {outputTokens} out',
    'Context window: {context} chars',
    'Streaming response started',
    'Model: {model}'
  ]
};

const TAGS = {
  system: ['boot', 'init', 'config', 'lit', 'grid'],
  ui: ['click', 'change', 'focus', 'drag', 'scroll'],
  network: ['api', 'fetch', 'cache', 'ws', 'http'],
  ai: ['llm', 'chat', 'stream', 'tokens', 'context']
};

const STACK_TEMPLATE = `Error: {message}
    at {function} (site/js/data-generators.js:{line}:{col})
    at processLog (site/js/log-widget.js:142:8)
    at Array.forEach (<anonymous>)
    at HTMLElement.connectedCallback (site/index.html:1:1)`;

/**
 * Generate a single log entry
 */
function generateLog(overrides = {}) {
  // Weighted distribution: 50% info system, 20% ui, 15% network, 10% warn, 5% error
  const levelSource = weightedChoice(
    [
      { level: 'info', source: 'system' },
      { level: 'info', source: 'ui' },
      { level: 'info', source: 'network' },
      { level: 'warn', source: 'system' },
      { level: 'error', source: 'system' }
    ],
    [50, 20, 15, 10, 5]
  );

  const { level, source } = { ...levelSource, ...overrides };
  const messages = MESSAGES[source] || MESSAGES.system;
  let message = messages[randomInt(0, messages.length - 1)];

  // Replace placeholders
  message = message
    .replace('{count}', randomInt(1, 50))
    .replace('{target}', ['t-btn', 't-pnl', 't-drp', 't-tabs'][randomInt(0, 3)])
    .replace('{value}', randomInt(0, 100))
    .replace('{remaining}', randomInt(50, 1000))
    .replace('{inputTokens}', randomInt(10, 500))
    .replace('{outputTokens}', randomInt(50, 2000))
    .replace('{context}', randomInt(1000, 8000))
    .replace('{model}', ['gemma3', 'llama3', 'mistral'][randomInt(0, 2)]);

  const tags = TAGS[source] || [];
  const selectedTags = tags.slice(0, randomInt(1, 3));

  const log = {
    id: uuid(),
    ts: Date.now(),
    level,
    source,
    message,
    tags: selectedTags,
    kv: {
      requestId: `req_${randomInt(1000, 9999)}`,
      durationMs: randomInt(5, 500),
      success: level !== 'error',
      retries: level === 'error' ? randomInt(1, 3) : 0
    },
    payload: source === 'network' ? {
      method: 'GET',
      url: '/api/data',
      status: level === 'error' ? 500 : 200,
      headers: { 'content-type': 'application/json' }
    } : null,
    stack: level === 'error' ? STACK_TEMPLATE
      .replace('{message}', message)
      .replace('{function}', 'generateLog')
      .replace('{line}', randomInt(50, 150))
      .replace('{col}', randomInt(1, 40)) : null
  };

  return { ...log, ...overrides };
}

/**
 * Log Generator class
 */
class LogGenerator {
  constructor() {
    this.logs = [];
    this.maxLogs = 500;
    this.intervalId = null;
    this.refreshRate = 1000;
    this.running = false;
    this.onLog = null;
  }

  start(refreshRate = 1000) {
    if (this.running) return;
    this.running = true;
    this.refreshRate = refreshRate;

    this.intervalId = setInterval(() => {
      const count = randomInt(1, 4);
      for (let i = 0; i < count; i++) {
        const log = generateLog();
        this.addLog(log);
      }
    }, this.refreshRate);

    eventBus.emit(EVENT_NAMES.DEMO_START, { generator: 'log' });
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    eventBus.emit(EVENT_NAMES.DEMO_PAUSE, { generator: 'log' });
  }

  reset() {
    this.stop();
    this.logs = [];
    eventBus.emit(EVENT_NAMES.DEMO_RESET, { generator: 'log' });
  }

  addLog(log) {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    if (this.onLog) {
      this.onLog(log);
    }
  }

  getLogs() {
    return [...this.logs];
  }

  getStats() {
    const counts = { info: 0, warn: 0, error: 0, debug: 0 };
    this.logs.forEach(log => {
      counts[log.level] = (counts[log.level] || 0) + 1;
    });
    return counts;
  }
}

/**
 * Chart data generator
 */
class ChartGenerator {
  constructor() {
    this.dataPoints = [];
    this.maxPoints = 60;
    this.intervalId = null;
    this.running = false;
    this.refreshRate = 1000;
    this.onUpdate = null;
  }

  start(refreshRate = 1000) {
    if (this.running) return;
    this.running = true;
    this.refreshRate = refreshRate;

    this.intervalId = setInterval(() => {
      this.addDataPoint();
    }, this.refreshRate);
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  reset() {
    this.stop();
    this.dataPoints = [];
  }

  addDataPoint() {
    const point = {
      ts: Date.now(),
      events: eventBus.getStats().eventsPerSecond || randomInt(5, 25),
      errors: randomInt(0, 2) < 1 ? randomInt(0, 2) : 0
    };

    this.dataPoints.push(point);
    if (this.dataPoints.length > this.maxPoints) {
      this.dataPoints.shift();
    }

    if (this.onUpdate) {
      this.onUpdate(this.getChartData());
    }
  }

  getChartData() {
    return {
      labels: this.dataPoints.map((_, i) => `${i}s`),
      events: this.dataPoints.map(p => p.events),
      errors: this.dataPoints.map(p => p.errors)
    };
  }
}

// Singleton instances
const logGenerator = new LogGenerator();
const chartGenerator = new ChartGenerator();

export {
  logGenerator,
  chartGenerator,
  generateLog,
  uuid,
  randomInt
};
