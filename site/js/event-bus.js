/**
 * Terminal Kit Event Bus
 * Cross-widget communication via custom events on window
 */

const EVENT_NAMES = {
  DEMO_START: 'tk-demo-start',
  DEMO_PAUSE: 'tk-demo-pause',
  DEMO_RESET: 'tk-demo-reset',
  CONTROLS_CHANGED: 'tk-controls-changed',
  LOG_SELECTED: 'tk-log-selected',
  LOG_PINNED: 'tk-log-pinned',
  NODE_SELECTED: 'tk-node-selected',
  KANBAN_MOVE: 'tk-kanban-move',
  CHAT_SEND: 'tk-chat-send',
  CHAT_RECEIVE: 'tk-chat-receive',
  THEME_CHANGED: 'tk-theme-changed'
};

class EventBus {
  constructor() {
    this.eventCount = 0;
    this.eventsPerSecond = 0;
    this.lastSecondEvents = 0;
    this.listeners = new Map();

    // Track events per second
    setInterval(() => {
      this.eventsPerSecond = this.eventCount - this.lastSecondEvents;
      this.lastSecondEvents = this.eventCount;
    }, 1000);
  }

  emit(eventName, detail = {}) {
    this.eventCount++;
    const event = new CustomEvent(eventName, {
      detail: { ...detail, _ts: Date.now() },
      bubbles: true
    });
    window.dispatchEvent(event);
  }

  on(eventName, callback) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(eventName, handler);

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push({ callback, handler });

    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    const listeners = this.listeners.get(eventName);
    if (!listeners) return;

    const index = listeners.findIndex(l => l.callback === callback);
    if (index !== -1) {
      window.removeEventListener(eventName, listeners[index].handler);
      listeners.splice(index, 1);
    }
  }

  getStats() {
    return {
      totalEvents: this.eventCount,
      eventsPerSecond: this.eventsPerSecond
    };
  }
}

// Singleton instance
const eventBus = new EventBus();

export { eventBus, EVENT_NAMES };
export default eventBus;
