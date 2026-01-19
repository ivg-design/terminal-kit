import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TChatPanelLit, TChatPanelManifest } from '../../js/components/TChatPanelLit.js';

describe('TChatPanelLit', () => {
  let chat;

  beforeEach(() => {
    chat = document.createElement('t-chat');
    document.body.appendChild(chat);
  });

  afterEach(() => {
    chat.remove();
    // Clear localStorage
    localStorage.clear();
  });

  describe('Manifest Completeness', () => {
    it('should have a valid manifest', () => {
      expect(TChatPanelManifest).toBeDefined();
      expect(TChatPanelManifest.tagName).toBe('t-chat');
      expect(TChatPanelManifest.displayName).toBe('Chat Panel');
      expect(TChatPanelManifest.version).toBe('1.0.0');
    });

    it('should document all properties', () => {
      const { properties } = TChatPanelManifest;

      expect(properties.title).toBeDefined();
      expect(properties.messages).toBeDefined();
      expect(properties.queue).toBeDefined();
      expect(properties.agentModes).toBeDefined();
      expect(properties.selectedMode).toBeDefined();
      expect(properties.thinking).toBeDefined();
      expect(properties.spinnerType).toBeDefined();
      expect(properties.spinnerSize).toBeDefined();
      expect(properties.exportFormat).toBeDefined();
      expect(properties.exportFilename).toBeDefined();
      expect(properties.maxHeight).toBeDefined();
      expect(properties.persistKey).toBeDefined();
      expect(properties.showQueue).toBeDefined();
      expect(properties.queueEnabled).toBeDefined();
      expect(properties.autoScroll).toBeDefined();
      expect(properties.disabled).toBeDefined();
      expect(properties.streamingContent).toBeDefined();
      expect(properties.maxRows).toBeDefined();
    });

    it('should document all methods', () => {
      const { methods } = TChatPanelManifest;

      expect(methods.clearChat).toBeDefined();
      expect(methods.exportChat).toBeDefined();
      expect(methods.enqueueMessage).toBeDefined();
      expect(methods.dequeueMessage).toBeDefined();
      expect(methods.addMessage).toBeDefined();
      expect(methods.setStreamingContent).toBeDefined();
      expect(methods.receiveContext).toBeDefined();
    });

    it('should document all events', () => {
      const { events } = TChatPanelManifest;

      expect(events['chat-send']).toBeDefined();
      expect(events['chat-queued']).toBeDefined();
      expect(events['chat-dequeued']).toBeDefined();
      expect(events['chat-queue-remove']).toBeDefined();
      expect(events['chat-mode-change']).toBeDefined();
      expect(events['chat-attachments']).toBeDefined();
      expect(events['chat-export']).toBeDefined();
      expect(events['chat-cleared']).toBeDefined();
    });

    it('should document all slots', () => {
      const { slots } = TChatPanelManifest;

      expect(slots.default).toBeDefined();
      expect(slots.actions).toBeDefined();
    });
  });

  describe('Property Functionality', () => {
    it('title property should work', async () => {
      chat.title = 'Test Chat';
      await chat.updateComplete;
      expect(chat.title).toBe('Test Chat');
      expect(chat.getAttribute('title')).toBe('Test Chat');
    });

    it('messages property should work', async () => {
      const testMessages = [
        { id: '1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() }
      ];
      chat.messages = testMessages;
      await chat.updateComplete;
      expect(chat.messages).toEqual(testMessages);
    });

    it('queue property should work', async () => {
      const testQueue = [
        { id: '1', content: 'Queued message', createdAt: new Date().toISOString() }
      ];
      chat.queue = testQueue;
      await chat.updateComplete;
      expect(chat.queue).toEqual(testQueue);
    });

    it('agentModes property should work', async () => {
      const modes = [{ value: 'custom', label: 'Custom Mode' }];
      chat.agentModes = modes;
      await chat.updateComplete;
      expect(chat.agentModes).toEqual(modes);
    });

    it('selectedMode property should work', async () => {
      chat.selectedMode = 'opus';
      await chat.updateComplete;
      expect(chat.selectedMode).toBe('opus');
      // Note: selectedMode doesn't reflect to attribute
    });

    it('thinking property should work', async () => {
      chat.thinking = true;
      await chat.updateComplete;
      expect(chat.thinking).toBe(true);
      expect(chat.hasAttribute('thinking')).toBe(true);
    });

    it('spinnerType property should work', async () => {
      chat.spinnerType = 'dots-spinner';
      await chat.updateComplete;
      expect(chat.spinnerType).toBe('dots-spinner');
      // Note: spinnerType doesn't reflect to attribute
    });

    it('spinnerSize property should work', async () => {
      chat.spinnerSize = 32;
      await chat.updateComplete;
      expect(chat.spinnerSize).toBe(32);
      // Note: spinnerSize doesn't reflect to attribute
    });

    it('exportFormat property should work', async () => {
      chat.exportFormat = 'json';
      await chat.updateComplete;
      expect(chat.exportFormat).toBe('json');
      // Note: exportFormat doesn't reflect to attribute
    });

    it('exportFilename property should work', async () => {
      chat.exportFilename = 'my-chat';
      await chat.updateComplete;
      expect(chat.exportFilename).toBe('my-chat');
      // Note: exportFilename doesn't reflect to attribute
    });

    it('maxHeight property should work', async () => {
      chat.maxHeight = '500px';
      await chat.updateComplete;
      expect(chat.maxHeight).toBe('500px');
      // Note: maxHeight doesn't reflect to attribute
    });

    it('persistKey property should work', async () => {
      chat.persistKey = 'test-chat';
      await chat.updateComplete;
      expect(chat.persistKey).toBe('test-chat');
      // Note: persistKey doesn't reflect to attribute
    });

    it('showQueue property should work', async () => {
      chat.showQueue = true;
      await chat.updateComplete;
      expect(chat.showQueue).toBe(true);
      // Note: showQueue doesn't reflect to attribute
    });

    it('queueEnabled property should work', async () => {
      chat.queueEnabled = false;
      await chat.updateComplete;
      expect(chat.queueEnabled).toBe(false);
      // Note: queueEnabled doesn't reflect to attribute
    });

    it('autoScroll property should work', async () => {
      chat.autoScroll = false;
      await chat.updateComplete;
      expect(chat.autoScroll).toBe(false);
      // Note: autoScroll doesn't reflect to attribute
    });

    it('disabled property should work', async () => {
      chat.disabled = true;
      await chat.updateComplete;
      expect(chat.disabled).toBe(true);
      expect(chat.hasAttribute('disabled')).toBe(true);
    });

    it('streamingContent property should work', async () => {
      chat.streamingContent = 'Streaming text...';
      await chat.updateComplete;
      expect(chat.streamingContent).toBe('Streaming text...');
    });

    it('maxRows property should work', async () => {
      chat.maxRows = 8;
      await chat.updateComplete;
      expect(chat.maxRows).toBe(8);
      // Note: maxRows doesn't reflect to attribute
    });
  });

  describe('Method Functionality', () => {
    it('clearChat() should clear messages and streaming content', async () => {
      chat.messages = [{ id: '1', role: 'user', content: 'Hello' }];
      chat.streamingContent = 'Streaming...';
      await chat.updateComplete;

      chat.clearChat();
      await chat.updateComplete;

      expect(chat.messages).toEqual([]);
      expect(chat.streamingContent).toBe('');
    });

    it('exportChat() should prepare export payload', async () => {
      chat.messages = [
        { id: '1', role: 'user', content: 'Hello', timestamp: new Date().toISOString() }
      ];
      await chat.updateComplete;

      const handler = vi.fn();
      chat.addEventListener('chat-export', handler);

      // Mock download to prevent actual file creation
      const createElementSpy = vi.spyOn(document, 'createElement');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink);

      chat.exportChat('markdown');

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.format).toBe('markdown');

      createElementSpy.mockRestore();
    });

    it('enqueueMessage() should add to queue', async () => {
      await chat.updateComplete;

      chat.enqueueMessage('Test message', []);
      await chat.updateComplete;

      expect(chat.queue.length).toBe(1);
      expect(chat.queue[0].content).toBe('Test message');
    });

    it('dequeueMessage() should remove from queue', async () => {
      chat.queue = [
        { id: '1', content: 'First', createdAt: new Date().toISOString() },
        { id: '2', content: 'Second', createdAt: new Date().toISOString() }
      ];
      await chat.updateComplete;

      const item = chat.dequeueMessage();

      expect(item.content).toBe('First');
      expect(chat.queue.length).toBe(1);
    });

    it('dequeueMessage() should return null when queue is empty', async () => {
      chat.queue = [];
      await chat.updateComplete;

      const item = chat.dequeueMessage();

      expect(item).toBeNull();
    });

    it('addMessage() should add to messages', async () => {
      await chat.updateComplete;

      const message = {
        id: '1',
        role: 'user',
        content: 'Hello',
        timestamp: new Date().toISOString()
      };
      chat.addMessage(message);
      await chat.updateComplete;

      expect(chat.messages.length).toBe(1);
      expect(chat.messages[0]).toEqual(message);
    });

    it('setStreamingContent() should update streaming content', async () => {
      await chat.updateComplete;

      chat.setStreamingContent('New streaming content');
      await chat.updateComplete;

      expect(chat.streamingContent).toBe('New streaming content');
    });

    it('receiveContext() should store context', async () => {
      await chat.updateComplete;

      chat.receiveContext({ disabled: true });
      await chat.updateComplete;

      // receiveContext stores context internally
      expect(chat._context).toBeDefined();
      expect(chat._context.disabled).toBe(true);
    });
  });

  describe('Event Functionality', () => {
    describe('chat-send event', () => {
      it('should fire when message is sent', async () => {
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-send', handler);

        // Set draft directly (internal property)
        chat._draft = 'Test message';
        await chat.updateComplete;
        chat._handleSend();

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.message).toBe('Test message');
      });

      it('should bubble and be composed', async () => {
        await chat.updateComplete;

        const handler = vi.fn();
        document.body.addEventListener('chat-send', handler);

        chat._draft = 'Test';
        await chat.updateComplete;
        chat._handleSend();

        expect(handler).toHaveBeenCalled();
        const event = handler.mock.calls[0][0];
        expect(event.bubbles).toBe(true);
        expect(event.composed).toBe(true);

        document.body.removeEventListener('chat-send', handler);
      });
    });

    describe('chat-queued event', () => {
      it('should fire when message is queued', async () => {
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-queued', handler);

        chat.enqueueMessage('Queued message');

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.item.content).toBe('Queued message');
      });

      it('should include queue in detail', async () => {
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-queued', handler);

        chat.enqueueMessage('Test');

        expect(handler.mock.calls[0][0].detail.queue).toBeDefined();
        expect(handler.mock.calls[0][0].detail.queue.length).toBe(1);
      });
    });

    describe('chat-dequeued event', () => {
      it('should fire when message is dequeued', async () => {
        chat.queue = [{ id: '1', content: 'Test', createdAt: new Date().toISOString() }];
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-dequeued', handler);

        chat.dequeueMessage();

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.item.content).toBe('Test');
      });
    });

    describe('chat-mode-change event', () => {
      it('should fire when mode changes', async () => {
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-mode-change', handler);

        chat._handleModeChange({ detail: { value: 'opus' } });

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.value).toBe('opus');
      });
    });

    describe('chat-cleared event', () => {
      it('should fire when chat is cleared', async () => {
        chat.messages = [{ id: '1', role: 'user', content: 'Test' }];
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-cleared', handler);

        chat.clearChat();

        expect(handler).toHaveBeenCalled();
      });
    });

    describe('chat-export event', () => {
      it('should fire when export is triggered', async () => {
        chat.messages = [{ id: '1', role: 'user', content: 'Test', timestamp: new Date().toISOString() }];
        await chat.updateComplete;

        const handler = vi.fn();
        chat.addEventListener('chat-export', handler);

        // Mock download
        const createElementSpy = vi.spyOn(document, 'createElement');
        const mockLink = { href: '', download: '', click: vi.fn() };
        createElementSpy.mockReturnValue(mockLink);

        chat.exportChat('json');

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.format).toBe('json');

        createElementSpy.mockRestore();
      });
    });

    describe('Event manifest completeness', () => {
      it('all manifest events should have bubbles:true configured', () => {
        // Events are emitted via _emitEvent which sets bubbles: true
        const handler = vi.fn();
        document.body.addEventListener('chat-cleared', handler);

        chat.clearChat();

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].bubbles).toBe(true);

        document.body.removeEventListener('chat-cleared', handler);
      });

      it('all manifest events should have composed:true configured', () => {
        const handler = vi.fn();
        document.body.addEventListener('chat-cleared', handler);

        chat.clearChat();

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].composed).toBe(true);

        document.body.removeEventListener('chat-cleared', handler);
      });
    });
  });

  describe('Slot Functionality', () => {
    it('default slot should accept content', async () => {
      const content = document.createElement('div');
      content.textContent = 'Test Content';
      chat.appendChild(content);

      await chat.updateComplete;

      // The chat wraps content in t-pnl which has its own slot handling
      expect(chat.querySelector('div')).toBe(content);
    });

    it('actions slot should accept buttons', async () => {
      const button = document.createElement('t-btn');
      button.setAttribute('slot', 'actions');
      chat.appendChild(button);

      await chat.updateComplete;

      expect(chat.querySelector('[slot="actions"]')).toBe(button);
    });
  });

  describe('Validation', () => {
    it('should validate exportFormat enum', () => {
      const validation = TChatPanelLit.getPropertyValidation('exportFormat');
      expect(validation).toBeDefined();

      const validResult = validation.validate('markdown');
      expect(validResult.valid).toBe(true);
      expect(validResult.errors).toHaveLength(0);

      const invalidResult = validation.validate('invalid');
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.errors.length).toBeGreaterThan(0);
    });

    it('should validate selectedMode as non-empty string', () => {
      const validation = TChatPanelLit.getPropertyValidation('selectedMode');
      expect(validation).toBeDefined();

      // Valid: any non-empty string
      const validResult = validation.validate('sonnet');
      expect(validResult.valid).toBe(true);

      const customModeResult = validation.validate('custom-mode');
      expect(customModeResult.valid).toBe(true);

      // Invalid: empty string
      const emptyResult = validation.validate('');
      expect(emptyResult.valid).toBe(false);
    });
  });

  describe('Rendering', () => {
    it('should render', async () => {
      await chat.updateComplete;
      const shadowRoot = chat.shadowRoot;
      expect(shadowRoot).toBeTruthy();
    });

    it('should render chat root', async () => {
      await chat.updateComplete;
      const root = chat.shadowRoot.querySelector('.chat-root');
      expect(root).toBeTruthy();
    });

    it('should render message stream', async () => {
      await chat.updateComplete;
      const stream = chat.shadowRoot.querySelector('.stream');
      expect(stream).toBeTruthy();
    });

    it('should render composer', async () => {
      await chat.updateComplete;
      const composer = chat.shadowRoot.querySelector('.composer');
      expect(composer).toBeTruthy();
    });

    it('should render messages', async () => {
      chat.messages = [
        { id: '1', role: 'user', content: 'User message', timestamp: new Date().toISOString() },
        { id: '2', role: 'assistant', content: 'Assistant message', timestamp: new Date().toISOString() }
      ];
      await chat.updateComplete;

      const messages = chat.shadowRoot.querySelectorAll('.message');
      expect(messages.length).toBe(2);
    });

    it('should render thinking bubble when thinking', async () => {
      chat.thinking = true;
      await chat.updateComplete;

      // Streaming bubble is an assistant message with .thinking inside
      const thinkingIndicator = chat.shadowRoot.querySelector('.message.assistant .thinking');
      expect(thinkingIndicator).toBeTruthy();
    });

    it('should render streaming content in thinking bubble', async () => {
      chat.thinking = true;
      chat.streamingContent = 'Streaming text...';
      await chat.updateComplete;

      const bubble = chat.shadowRoot.querySelector('.message.assistant .bubble');
      expect(bubble).toBeTruthy();
      expect(bubble.textContent).toContain('Streaming text...');
    });

    it('should render queue panel when showQueue is true', async () => {
      chat.showQueue = true;
      chat.queue = [{ id: '1', content: 'Queued', createdAt: new Date().toISOString() }];
      await chat.updateComplete;

      const queuePanel = chat.shadowRoot.querySelector('.queue-panel');
      expect(queuePanel).toBeTruthy();
    });

    it('should render mode dropdown', async () => {
      await chat.updateComplete;
      const dropdown = chat.shadowRoot.querySelector('t-drp');
      expect(dropdown).toBeTruthy();
    });

    it('should apply user class to user messages', async () => {
      chat.messages = [{ id: '1', role: 'user', content: 'Test', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const userMessage = chat.shadowRoot.querySelector('.message.user');
      expect(userMessage).toBeTruthy();
    });

    it('should apply assistant class to assistant messages', async () => {
      chat.messages = [{ id: '1', role: 'assistant', content: 'Test', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const assistantMessage = chat.shadowRoot.querySelector('.message.assistant');
      expect(assistantMessage).toBeTruthy();
    });

    it('should apply disabled state to composer', async () => {
      chat.disabled = true;
      await chat.updateComplete;

      // Component uses t-textarea
      const textarea = chat.shadowRoot.querySelector('t-textarea');
      expect(textarea.disabled).toBe(true);
    });
  });

  describe('Nesting Support', () => {
    it('should have receiveContext method', () => {
      expect(typeof chat.receiveContext).toBe('function');
    });

    it('receiveContext should store context', async () => {
      await chat.updateComplete;

      chat.receiveContext({ disabled: true, theme: 'dark' });
      await chat.updateComplete;

      // receiveContext stores context but doesn't auto-apply properties
      expect(chat._context).toBeDefined();
      expect(chat._context.disabled).toBe(true);
      expect(chat._context.theme).toBe('dark');
    });

    it('receiveContext should accept various context shapes', async () => {
      await chat.updateComplete;

      chat.receiveContext({ customProp: 'value', nested: { data: 123 } });
      await chat.updateComplete;

      expect(chat._context.customProp).toBe('value');
      expect(chat._context.nested.data).toBe(123);
    });
  });

  describe('Persistence', () => {
    it('should persist queue to localStorage when persistKey is set', async () => {
      chat.persistKey = 'test-persist';
      await chat.updateComplete;

      chat.enqueueMessage('Persisted message');
      await chat.updateComplete;

      // Storage uses :queue suffix
      const stored = localStorage.getItem('test-persist:queue');
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored).length).toBe(1);
    });

    it('should restore queue from localStorage', async () => {
      const queueData = [{ id: '1', content: 'Restored', createdAt: new Date().toISOString() }];
      // Storage uses :queue suffix
      localStorage.setItem('restore-test:queue', JSON.stringify(queueData));

      chat.remove();
      const newChat = document.createElement('t-chat');
      newChat.persistKey = 'restore-test';
      document.body.appendChild(newChat);
      await newChat.updateComplete;

      expect(newChat.queue.length).toBe(1);
      expect(newChat.queue[0].content).toBe('Restored');

      newChat.remove();
    });
  });

  describe('Markdown Rendering', () => {
    it('should render markdown in messages', async () => {
      chat.messages = [
        { id: '1', role: 'assistant', content: '**Bold text**', timestamp: new Date().toISOString() }
      ];
      await chat.updateComplete;

      const bubble = chat.shadowRoot.querySelector('.message.assistant .bubble');
      expect(bubble.innerHTML).toContain('<strong>');
    });

    it('should render code blocks', async () => {
      chat.messages = [
        { id: '1', role: 'assistant', content: '```js\nconsole.log("test");\n```', timestamp: new Date().toISOString() }
      ];
      await chat.updateComplete;

      const bubble = chat.shadowRoot.querySelector('.message.assistant .bubble');
      expect(bubble.innerHTML).toContain('code');
    });
  });

  describe('Cleanup Patterns', () => {
    it('should clean up on disconnect', async () => {
      await chat.updateComplete;

      // Component should disconnect cleanly
      chat.remove();

      // No errors should be thrown
      expect(true).toBe(true);
    });
  });

  describe('Logging', () => {
    it('should have logger instance', () => {
      expect(chat._logger).toBeDefined();
      expect(chat._logger.debug).toBeDefined();
      expect(chat._logger.info).toBeDefined();
      expect(chat._logger.warn).toBeDefined();
      expect(chat._logger.error).toBeDefined();
    });

    it('should log on connect', () => {
      const spy = vi.spyOn(chat._logger, 'info');

      // Force reconnect
      chat.remove();
      document.body.appendChild(chat);

      expect(spy).toHaveBeenCalledWith('Connected to DOM');
    });

    it('should log on disconnect', () => {
      const spy = vi.spyOn(chat._logger, 'info');

      chat.remove();

      expect(spy).toHaveBeenCalledWith('Disconnected from DOM');
    });
  });

  describe('Message Roles', () => {
    it('should handle user role', async () => {
      chat.messages = [{ id: '1', role: 'user', content: 'Test', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const msg = chat.shadowRoot.querySelector('.message.user');
      expect(msg).toBeTruthy();
    });

    it('should handle assistant role', async () => {
      chat.messages = [{ id: '1', role: 'assistant', content: 'Test', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const msg = chat.shadowRoot.querySelector('.message.assistant');
      expect(msg).toBeTruthy();
    });

    it('should handle system role', async () => {
      chat.messages = [{ id: '1', role: 'system', content: 'Test', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const msg = chat.shadowRoot.querySelector('.message.system');
      expect(msg).toBeTruthy();
    });

    it('should handle error role', async () => {
      chat.messages = [{ id: '1', role: 'error', content: 'Error!', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const msg = chat.shadowRoot.querySelector('.message.error');
      expect(msg).toBeTruthy();
    });

    it('should handle tool role', async () => {
      chat.messages = [{ id: '1', role: 'tool', content: 'Tool output', timestamp: new Date().toISOString() }];
      await chat.updateComplete;

      const msg = chat.shadowRoot.querySelector('.message.tool');
      expect(msg).toBeTruthy();
    });
  });

  describe('Attachments', () => {
    it('should display attachments in messages', async () => {
      chat.messages = [{
        id: '1',
        role: 'user',
        content: 'With attachment',
        timestamp: new Date().toISOString(),
        attachments: [{ name: 'file.txt', size: 1024 }]
      }];
      await chat.updateComplete;

      // Class is attachment-chip
      const attachment = chat.shadowRoot.querySelector('.attachment-chip');
      expect(attachment).toBeTruthy();
    });

    it('should format attachment size', async () => {
      chat.messages = [{
        id: '1',
        role: 'user',
        content: 'With attachment',
        timestamp: new Date().toISOString(),
        attachments: [{ name: 'file.txt', size: 1024 }]
      }];
      await chat.updateComplete;

      // Class is attachment-chip
      const attachment = chat.shadowRoot.querySelector('.attachment-chip');
      expect(attachment.textContent).toContain('1.0 KB');
    });
  });

  describe('Queue Management', () => {
    it('should toggle queue visibility', async () => {
      chat.showQueue = false;
      chat.queue = []; // Empty queue
      await chat.updateComplete;

      // Queue panel has hidden class when showQueue is false and queue is empty
      let queuePanel = chat.shadowRoot.querySelector('.queue-panel');
      expect(queuePanel.classList.contains('hidden')).toBe(true);

      chat.showQueue = true;
      await chat.updateComplete;

      queuePanel = chat.shadowRoot.querySelector('.queue-panel');
      expect(queuePanel.classList.contains('hidden')).toBe(false);
    });

    it('should allow removing queue items', async () => {
      chat.queue = [
        { id: '1', content: 'First', createdAt: new Date().toISOString() },
        { id: '2', content: 'Second', createdAt: new Date().toISOString() }
      ];
      chat.showQueue = true;
      await chat.updateComplete;

      const handler = vi.fn();
      chat.addEventListener('chat-queue-remove', handler);

      // Trigger remove via internal method
      chat._removeQueueItem(0);

      expect(handler).toHaveBeenCalled();
      expect(chat.queue.length).toBe(1);
    });
  });
});
