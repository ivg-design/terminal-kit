// ============================================================
// SECTION 1: IMPORTS (REQUIRED)
// ============================================================
import { LitElement, html, css } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { repeat } from 'lit/directives/repeat.js';
import { marked } from 'marked';
import Prism from 'prismjs';
import componentLogger from '../utils/ComponentLogger.js';
import { generateManifest } from '../utils/manifest-generator.js';
import {
  downloadIcon,
  fileIcon,
  backspaceIcon,
  fadersIcon,
  noteBlankIcon,
  minusCircleIcon,
  userCircleIcon,
  binaryIcon,
  uploadIcon,
  caretUpIcon
} from '../utils/phosphor-icons.js';

// Ensure dependent Terminal-Kit components are registered
import './TPanelLit.js';
import './TButtonLit.js';
import './TTextareaLit.js';
import './TLoaderLit.js';
import './TDropdownLit.js';

// ============================================================
// SECTION 2: COMPONENT CLASS DECLARATION (REQUIRED)
// ============================================================

/**
 * @component TChatPanelLit
 * @tagname t-chat
 * @description Compact, terminal-styled chat panel with markdown rendering, attachments, queueing, and streaming support.
 * @category Composite
 * @since 1.0.0
 * @example
 * <t-chat></t-chat>
 */
export class TChatPanelLit extends LitElement {

  // ----------------------------------------------------------
  // BLOCK 1: STATIC METADATA (REQUIRED)
  // ----------------------------------------------------------
  static tagName = 't-chat';
  static version = '1.0.0';
  static category = 'Composite';

  // ----------------------------------------------------------
  // BLOCK 2: STATIC STYLES (REQUIRED)
  // ----------------------------------------------------------
  static styles = css`
    :host {
      --terminal-black: var(--tk-black, #0a0a0a);
      --terminal-black-light: var(--tk-black-light, #1a1a1a);
      --terminal-gray-dark: var(--tk-gray-dark, #242424);
      --terminal-gray-light: var(--tk-gray-light, #333333);
      --terminal-gray: var(--tk-gray, #808080);
      --terminal-green: var(--tk-green, #00ff41);
      --terminal-green-dim: var(--tk-green-dim, #00cc33);
      --terminal-green-dark: var(--tk-green-dark, #008820);
      --terminal-blue: var(--tk-blue, #00ccff);
      --terminal-yellow: var(--tk-yellow, #ffcc00);
      --terminal-red: var(--tk-red, #ff0041);
      --font-mono: var(--tk-font-mono, 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Courier New', monospace);
      --font-size-sm: var(--tk-font-size-sm, 11px);
      --spacing-xs: var(--tk-spacing-xs, 4px);
      --spacing-sm: var(--tk-spacing-sm, 8px);
      --spacing-md: var(--tk-spacing-md, 12px);
      --spacing-lg: var(--tk-spacing-lg, 16px);

      display: block;
      width: 100%;
      height: 100%;
    }

    t-pnl {
      height: 100%;
      display: block;
    }

    .chat-root {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      min-height: 280px;
    }

    .chat-body {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .stream {
      flex: 1;
      overflow-y: auto;
      background: var(--terminal-black);
      border: 1px solid var(--terminal-gray-light);
      padding: var(--spacing-sm);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      height: 100%;
      gap: var(--spacing-sm);
      max-height: var(--chat-max-height, 100%);
    }

    .stream::-webkit-scrollbar {
      width: 8px;
    }

    .stream::-webkit-scrollbar-track {
      background: var(--terminal-black);
    }

    .stream::-webkit-scrollbar-thumb {
      background: var(--terminal-gray-light);
      border: 1px solid var(--terminal-green-dark);
    }

    .stream::-webkit-scrollbar-thumb:hover {
      background: var(--terminal-green);
    }

    .message {
      display: flex;
      gap: var(--spacing-xs);
      max-width: 70%;
    }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message.system,
    .message.error {
      align-self: center;
      max-width: 80%;
    }

    .avatar {
      width: 24px;
      height: 24px;
      border: 1px solid var(--terminal-green-dark);
      background: var(--terminal-gray-dark);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }

    .bubble {
      border: 1px solid var(--terminal-green-dark);
      background: var(--terminal-black-light);
      padding: 6px 8px;
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      line-height: 1.4;
      color: var(--terminal-green);
      word-break: break-word;
      white-space: normal;
      position: relative;
    }

    .message.user .bubble {
      border-color: var(--terminal-green);
      background: var(--terminal-gray-dark);
    }

    .message.tool .bubble {
      border-color: var(--terminal-blue);
      color: var(--terminal-blue);
    }

    .message.error .bubble {
      border-color: var(--terminal-red);
      color: var(--terminal-red);
    }

    .message.system .bubble {
      border-color: var(--terminal-yellow);
      color: var(--terminal-yellow);
    }

    .meta {
      margin-top: 4px;
      font-size: 10px;
      color: var(--terminal-green-dim);
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .attachments {
      margin-top: 6px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .attachment-chip {
      display: inline-flex;
      gap: 4px;
      align-items: center;
      border: 1px solid var(--terminal-gray-light);
      background: var(--terminal-gray-dark);
      padding: 2px 6px;
      font-size: 10px;
      color: var(--terminal-green);
    }

    .attachment-chip svg {
      width: 12px;
      height: 12px;
    }

    pre {
      margin: 6px 0;
      padding: 6px;
      background: var(--terminal-black);
      border: 1px solid var(--terminal-gray-light);
      overflow-x: auto;
    }

    code {
      font-family: var(--font-mono);
      font-size: 11px;
    }

    .thinking {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-top: 6px;
      color: var(--terminal-green-dim);
      font-size: 10px;
    }

    .composer {
      display: flex;
      flex-direction: column;
      gap: 6px;
      border: 1px solid var(--terminal-gray-light);
      border-top: none;
      background: var(--terminal-gray-dark);
      padding: 8px;
    }

    .composer-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .input-wrapper {
      position: relative;
      flex: 1;
      display: flex;
    }

    .composer-row t-textarea {
      flex: 1;
      --textarea-max-width: calc(100% - 32px);
      --spacing-sm: 6px 8px 6px 30px;
    }

    .attach-btn {
      position: absolute;
      left: 6px;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2;
    }

    .composer-actions {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .header-actions {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      flex-wrap: nowrap;
    }

    .header-actions t-drp {
      margin-right: 8px;
    }

    .queue-indicator {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: var(--terminal-green-dim);
      margin-left: auto;
    }

    .queue-panel {
      border: 1px solid var(--terminal-gray-light);
      border-top: none;
      background: var(--terminal-black-light);
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .queue-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      border: 1px solid var(--terminal-gray-light);
      padding: 4px 6px;
      font-size: 10px;
      background: var(--terminal-gray-dark);
      color: var(--terminal-green);
    }

    .queue-preview {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }

    .hidden {
      display: none !important;
    }

    @media (max-width: 900px) {
      .message {
        max-width: 85%;
      }
    }
  `;

  // ----------------------------------------------------------
  // BLOCK 3: REACTIVE PROPERTIES (REQUIRED)
  // ----------------------------------------------------------
  static properties = {
    title: { type: String, reflect: true },
    icon: { type: String },
    messages: { type: Array },
    queue: { type: Array },
    agentModes: { type: Array, attribute: 'agent-modes' },
    selectedMode: { type: String, attribute: 'selected-mode' },
    thinking: { type: Boolean, reflect: true },
    spinnerType: { type: String, attribute: 'spinner-type' },
    spinnerSize: { type: Number, attribute: 'spinner-size' },
    exportFormat: { type: String, attribute: 'export-format' },
    exportFilename: { type: String, attribute: 'export-filename' },
    maxHeight: { type: String, attribute: 'max-height' },
    persistKey: { type: String, attribute: 'persist-key' },
    showQueue: { type: Boolean, attribute: 'show-queue' },
    queueEnabled: { type: Boolean, attribute: 'queue-enabled' },
    autoScroll: { type: Boolean, attribute: 'auto-scroll' },
    disabled: { type: Boolean, reflect: true },
    streamingContent: { type: String, attribute: 'streaming-content' },
    maxRows: { type: Number, attribute: 'max-rows' },
    _rows: { type: Number, state: true }
  };

  // ----------------------------------------------------------
  // BLOCK 4: INTERNAL STATE (PRIVATE)
  // ----------------------------------------------------------
  _logger = componentLogger.for('TChatPanelLit');
  _draft = '';
  _pendingFiles = [];

  // ----------------------------------------------------------
  // BLOCK 5: CONSTRUCTOR (REQUIRED)
  // ----------------------------------------------------------
  constructor() {
    super();

    this.title = 'Chat';
    this.icon = noteBlankIcon;
    this.messages = [];
    this.queue = [];
    this.agentModes = [
      { value: 'haiku', label: 'Haiku' },
      { value: 'sonnet', label: 'Sonnet' },
      { value: 'opus', label: 'Opus' }
    ];
    this.selectedMode = 'sonnet';
    this.thinking = false;
    this.spinnerType = 'ellipsis-spinner';
    this.spinnerSize = 24;
    this.exportFormat = 'markdown';
    this.exportFilename = 'chat-export';
    this.maxHeight = '100%';
    this.persistKey = '';
    this.showQueue = false;
    this.queueEnabled = true;
    this.autoScroll = true;
    this.disabled = false;
    this.streamingContent = '';
    this.maxRows = 4;
    this._rows = 1;

    this._setupMarkdown();
  }

  // ----------------------------------------------------------
  // BLOCK 6: LIFECYCLE METHODS (REQUIRED)
  // ----------------------------------------------------------
  connectedCallback() {
    super.connectedCallback();
    this._restoreState();
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('messages') || changedProperties.has('streamingContent')) {
      this._highlightCodeBlocks();
      if (this.autoScroll) {
        this._scrollToBottom();
      }
    }

    if (changedProperties.has('queue') || changedProperties.has('persistKey')) {
      this._persistState();
    }
  }

  // ----------------------------------------------------------
  // BLOCK 7: PUBLIC API METHODS
  // ----------------------------------------------------------
  clearChat() {
    this.messages = [];
    this.streamingContent = '';
    this._emitEvent('chat-cleared', {});
  }

  exportChat(format = this.exportFormat) {
    const payload = this._buildExportPayload(format);
    this._emitEvent('chat-export', { format, payload });
    this._downloadExport(format, payload);
  }

  enqueueMessage(content, attachments = []) {
    const item = {
      id: this._uuid(),
      content,
      attachments,
      createdAt: new Date().toISOString(),
      mode: this.selectedMode
    };
    this.queue = [...this.queue, item];
    this._emitEvent('chat-queued', { item, queue: this.queue });
  }

  dequeueMessage() {
    const [item, ...rest] = this.queue;
    this.queue = rest;
    if (item) {
      this._emitEvent('chat-dequeued', { item, queue: this.queue });
    }
    return item || null;
  }

  // ----------------------------------------------------------
  // BLOCK 8: RENDER METHOD
  // ----------------------------------------------------------
  render() {
    const modeOptions = Array.isArray(this.agentModes) && this.agentModes.length
      ? this.agentModes
      : [{ value: 'default', label: 'Default' }];

    return html`
      <t-pnl title=${this.title} .icon=${this.icon}>
        <div slot="actions" class="header-actions">
          <t-drp
            .options=${modeOptions}
            placeholder="Agent"
            .value=${this.selectedMode}
            compact
            width="150px"
            @dropdown-change=${this._handleModeChange}
          ></t-drp>
          <t-btn type="icon" size="sm" .icon=${downloadIcon} @click=${this._handleExport} title="Export"></t-btn>
          <t-btn type="icon" size="sm" .icon=${backspaceIcon} @click=${this.clearChat} title="Clear"></t-btn>
        </div>

        <div class="chat-root">
          <div class="chat-body" style="--chat-max-height: ${this.maxHeight};">
            <div class="stream" role="log" aria-live="polite">
              ${repeat(this.messages, (msg, index) => msg.id || msg.timestamp || index, (msg) => this._renderMessage(msg))}
              ${this._renderStreaming()}
            </div>

            <div class="composer">
              ${this.queue.length
                ? html`
                    <span class="queue-indicator">
                      <span class="icon">${unsafeHTML(fadersIcon)}</span>
                      ${this.queue.length} queued
                    </span>
                  `
                : ''}

              ${this._renderPendingAttachments()}

              <div class="composer-row">
                <div class="input-wrapper">
                  <t-textarea
                    .value=${this._draft}
                    placeholder="Type a message..."
                    .rows=${this._rows}
                    resize="none"
                    ?disabled=${this.disabled}
                    @textarea-input=${this._handleDraftInput}
                    @keydown=${this._handleKeyDown}
                  ></t-textarea>
                  <t-btn
                    class="attach-btn"
                    type="icon"
                    size="sm"
                    .icon=${uploadIcon}
                    @click=${this._triggerFileSelect}
                    title="Attach files"
                    ?disabled=${this.disabled}
                  ></t-btn>
                </div>

                <div class="composer-actions">
                  <t-btn
                    variant="primary"
                    .icon=${caretUpIcon}
                    type="icon"
                    @click=${this._handleSend}
                    ?disabled=${this.disabled}
                  ></t-btn>
                </div>
              </div>
            </div>

            <div class="queue-panel ${this.showQueue || this.queue.length ? '' : 'hidden'}">
              ${this.queue.length === 0
                ? html`<div class="queue-item">Queue is empty</div>`
                : repeat(this.queue, (item) => item.id, (item, index) => this._renderQueueItem(item, index))}
            </div>
          </div>
        </div>

        <input class="hidden" type="file" multiple @change=${this._handleFilesSelected} />
      </t-pnl>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 9: INTERNAL RENDER HELPERS
  // ----------------------------------------------------------
  _renderMessage(message) {
    const role = message.role || 'assistant';
    const content = message.content || '';
    const attachments = message.attachments || [];
    const meta = this._formatMeta(message);
    const avatar = role === 'user'
      ? userCircleIcon
      : role === 'assistant'
        ? binaryIcon
        : noteBlankIcon;

    return html`
      <div class="message ${role}">
        <div class="avatar">${unsafeHTML(avatar)}</div>
        <div class="bubble">
          <div class="content">${unsafeHTML(this._renderMarkdown(content))}</div>
          ${attachments.length ? this._renderAttachments(attachments) : ''}
          ${meta ? html`<div class="meta">${meta}</div>` : ''}
        </div>
      </div>
    `;
  }

  _renderStreaming() {
    if (!this.thinking && !this.streamingContent) return '';

    return html`
      <div class="message assistant">
        <div class="avatar">${unsafeHTML(binaryIcon)}</div>
        <div class="bubble">
          ${this.streamingContent
            ? html`<div class="content">${unsafeHTML(this._renderMarkdown(this.streamingContent))}</div>`
            : ''}
          <div class="thinking">
            <t-ldr type=${this.spinnerType} size=${this.spinnerSize}></t-ldr>
            <span>Thinking...</span>
          </div>
        </div>
      </div>
    `;
  }

  _renderAttachments(attachments) {
    return html`
      <div class="attachments">
        ${attachments.map((att) => html`
          <div class="attachment-chip">
            <span class="icon">${unsafeHTML(fileIcon)}</span>
            <span>${att.name || 'file'}</span>
            ${att.size ? html`<span>(${this._formatBytes(att.size)})</span>` : ''}
          </div>
        `)}
      </div>
    `;
  }


  _renderPendingAttachments() {
    if (!this._pendingFiles.length) return '';

    const attachments = this._pendingFiles.map((file) => ({
      name: file.name,
      size: file.size
    }));

    return this._renderAttachments(attachments);
  }

  _renderQueueItem(item, index) {
    return html`
      <div class="queue-item">
        <span class="queue-preview">${index + 1}. ${item.content}</span>
        <t-btn
          type="icon"
          size="xs"
          .icon=${minusCircleIcon}
          @click=${() => this._removeQueueItem(index)}
        ></t-btn>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BLOCK 10: EVENT HANDLERS
  // ----------------------------------------------------------
  _handleDraftInput(e) {
    this._draft = e.detail?.value || '';
    this._updateRows();
    this._persistState();
    this.requestUpdate();
  }

  _handleKeyDown(e) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      this._draft = `${this._draft}\n`;
      this._updateRows();
      this._persistState();
      this.requestUpdate();
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      this._handleSend();
    }
  }

  _handleSend() {
    const trimmed = (this._draft || '').trim();
    if (!trimmed) return;

    if (this.thinking && this.queueEnabled) {
      this.enqueueMessage(trimmed, this._pendingFiles);
      this._clearDraft();
      return;
    }

    const detail = {
      message: trimmed,
      attachments: this._pendingFiles,
      mode: this.selectedMode
    };

    this._emitEvent('chat-send', detail);
    this._clearDraft();
  }

  _handleModeChange(e) {
    const value = e.detail?.value;
    if (!value) return;
    this.selectedMode = value;
    this._emitEvent('chat-mode-change', { value });
  }

  _handleExport() {
    this.exportChat(this.exportFormat);
  }

  _triggerFileSelect() {
    const input = this.renderRoot?.querySelector('input[type="file"]');
    if (input) input.click();
  }

  _handleFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    this._pendingFiles = files;
    this._emitEvent('chat-attachments', { files });
    this.requestUpdate();
  }

  _removeQueueItem(index) {
    const item = this.queue[index];
    const next = this.queue.filter((_, i) => i !== index);
    this.queue = next;
    this._emitEvent('chat-queue-remove', { item, queue: this.queue });
  }

  // ----------------------------------------------------------
  // BLOCK 11: UTILITIES
  // ----------------------------------------------------------
  _emitEvent(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true
    }));
  }

  _clearDraft() {
    this._draft = '';
    this._pendingFiles = [];
    const input = this.renderRoot?.querySelector('input[type="file"]');
    if (input) input.value = '';
    this._updateRows();
    this._persistState();
    this.requestUpdate();
  }

  _uuid() {
    return `chat-${Math.random().toString(36).slice(2, 10)}`;
  }

  _formatBytes(bytes) {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  }

  _formatMeta(message) {
    const parts = [];
    if (message.timestamp) parts.push(message.timestamp);
    if (message.model) parts.push(message.model);
    if (message.traceId) parts.push(`trace:${message.traceId}`);
    return parts.join(' - ');
  }

  _buildExportPayload(format) {
    if (format === 'json') {
      return JSON.stringify(this.messages, null, 2);
    }

    return this.messages.map((msg) => {
      const header = `### ${msg.role || 'assistant'}${msg.timestamp ? ` (${msg.timestamp})` : ''}`;
      return `${header}\n\n${msg.content || ''}`;
    }).join('\n\n');
  }

  _downloadExport(format, payload) {
    const ext = format === 'json' ? 'json' : 'md';
    const blob = new Blob([payload], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.exportFilename}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  _scrollToBottom() {
    const stream = this.renderRoot?.querySelector('.stream');
    if (!stream) return;
    requestAnimationFrame(() => {
      stream.scrollTop = stream.scrollHeight;
    });
  }

  _highlightCodeBlocks() {
    const nodes = this.renderRoot?.querySelectorAll('pre code');
    if (!nodes) return;
    nodes.forEach((node) => {
      Prism.highlightElement(node);
    });
  }

  _updateRows() {
    const lines = (this._draft || '').split('\n').length;
    const next = Math.min(this.maxRows || 4, Math.max(1, lines));
    this._rows = next;
  }

  _setupMarkdown() {
    const renderer = new marked.Renderer();
    renderer.html = () => '';
    marked.setOptions({
      gfm: true,
      breaks: true,
      renderer
    });
  }

  _renderMarkdown(content) {
    if (!content) return '';
    return marked.parse(content);
  }

  _persistState() {
    if (!this.persistKey) return;
    try {
      localStorage.setItem(`${this.persistKey}:draft`, this._draft || '');
      localStorage.setItem(`${this.persistKey}:queue`, JSON.stringify(this.queue || []));
    } catch (error) {
      this._logger.debug('Failed to persist chat state', { error });
    }
  }

  _restoreState() {
    if (!this.persistKey) return;
    try {
      const draft = localStorage.getItem(`${this.persistKey}:draft`);
      const queue = localStorage.getItem(`${this.persistKey}:queue`);
      if (draft) this._draft = draft;
      if (queue) this.queue = JSON.parse(queue);
    } catch (error) {
      this._logger.debug('Failed to restore chat state', { error });
    }
  }
}

customElements.define('t-chat', TChatPanelLit);

export const TChatPanelManifest = generateManifest(TChatPanelLit, {
  tagName: 't-chat',
  displayName: 'Chat Panel',
  description: 'Compact terminal-styled chat panel with markdown rendering, attachments, queueing, and streaming support.',
  version: '1.0.0',
  category: 'Composite'
});
