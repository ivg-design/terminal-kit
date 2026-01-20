/**
 * Demo Utilities
 * Shared functionality for all component demo pages
 */

/**
 * Initialize the floating event log
 * @param {string} containerId - ID of the event log container
 */
export function initEventLog(containerId = 'eventLogContainer') {
    const container = document.getElementById(containerId);
    if (!container) return null;

    let eventCount = 0;
    const countEl = container.querySelector('.event-log-count');
    const logEl = container.querySelector('.event-log');
    const toggleEl = container.querySelector('.event-log-toggle');
    const clearBtn = container.querySelector('.event-log-clear');

    // Toggle collapse
    if (toggleEl) {
        toggleEl.addEventListener('click', (e) => {
            if (e.target.closest('.event-log-clear')) return;
            container.classList.toggle('collapsed');
        });
    }

    // Clear log
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (logEl) logEl.innerHTML = '';
            eventCount = 0;
            if (countEl) countEl.textContent = '0';
        });
    }

    // Return log function
    return function logEvent(component, event, detail, type = 'info') {
        if (!logEl) return;

        const entry = document.createElement('div');
        entry.className = 'event-entry';
        if (type === 'error') entry.classList.add('error');
        if (type === 'warning') entry.classList.add('warning');

        const timestamp = new Date().toLocaleTimeString();
        const detailStr = detail ? ' - ' + (typeof detail === 'object' ? JSON.stringify(detail) : detail) : '';
        entry.textContent = `[${timestamp}] ${component}: ${event}${detailStr}`;

        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;

        eventCount++;
        if (countEl) countEl.textContent = eventCount.toString();
    };
}

/**
 * Create the event log HTML structure
 * @returns {string} HTML string for the event log
 */
export function createEventLogHTML() {
    return `
    <div class="event-log-container collapsed" id="eventLogContainer">
        <div class="event-log-toggle">
            <h3>
                <span class="toggle-icon">▲</span>
                Event Log
            </h3>
            <div class="event-log-controls">
                <span class="event-log-count">0</span>
                <button class="event-log-clear">Clear</button>
            </div>
        </div>
        <div class="event-log" id="eventLog"></div>
    </div>`;
}

/**
 * Create the fixed header HTML structure
 * @param {string} title - Component title
 * @param {string} componentName - Component name for breadcrumb
 * @returns {string} HTML string for the header
 */
export function createHeaderHTML(title, componentName) {
    return `
    <header class="demo-header">
        <div class="demo-header-content">
            <div class="demo-header-left">
                <h1>${title}</h1>
                <div class="breadcrumb">
                    <a href="index.html">← Components</a> / ${componentName}
                </div>
            </div>
            <div class="demo-header-controls">
                <button class="header-btn" id="toggleLogBtn">
                    <span>▼</span> Event Log
                </button>
            </div>
        </div>
    </header>`;
}

/**
 * Initialize header controls
 */
export function initHeaderControls() {
    const toggleLogBtn = document.getElementById('toggleLogBtn');
    const eventLogContainer = document.getElementById('eventLogContainer');

    if (toggleLogBtn && eventLogContainer) {
        toggleLogBtn.addEventListener('click', () => {
            eventLogContainer.classList.toggle('collapsed');
            toggleLogBtn.classList.toggle('active');
        });
    }
}

/**
 * Full demo initialization
 * @param {string} title - Component title
 * @param {string} componentName - Component name for breadcrumb
 * @returns {Function} logEvent function
 */
export function initDemo(title, componentName) {
    // Inject header if not present
    if (!document.querySelector('.demo-header')) {
        document.body.insertAdjacentHTML('afterbegin', createHeaderHTML(title, componentName));
    }

    // Inject event log if not present
    if (!document.getElementById('eventLogContainer')) {
        document.body.insertAdjacentHTML('beforeend', createEventLogHTML());
    }

    initHeaderControls();
    const logEvent = initEventLog();

    // Log initialization
    if (logEvent) {
        logEvent('System', 'Demo initialized');
    }

    return logEvent;
}
