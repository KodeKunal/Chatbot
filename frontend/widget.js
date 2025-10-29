class AIChatWidget {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || 'http://localhost:3000/chat';
        this.position = config.position || 'right';
        this.theme = config.theme || '#2196f3';
        this.init();
    }

    init() {
        this.createWidget();
        this.attachEventListeners();
    }

    createWidget() {
        const widget = document.createElement('div');
        widget.className = 'ai-chat-widget';
        widget.innerHTML = `
            <button class="ai-chat-button">
                <i class="fas fa-comments"></i>
            </button>
            <div class="ai-chat-container">
                <div class="ai-chat-header">
                    <div class="header-content">
                        <i class="fas fa-brain ai-logo"></i>
                        <span>AI Assistant</span>
                    </div>
                    <button class="ai-chat-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="ai-chat-messages" id="aiChatMessages"></div>
                <div class="ai-chat-input">
                    <input type="text" placeholder="Type your message..." id="aiMessageInput">
                    <button class="ai-chat-send" id="aiSendBtn"><i class="fas fa-paper-plane"></i></button>
                </div>
                <div class="ai-chat-footer">
                    <i class="fab fa-github"></i>
                    Made by Kunal
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.elements = {
            widget: widget,
            container: widget.querySelector('.ai-chat-container'),
            button: widget.querySelector('.ai-chat-button'),
            closeBtn: widget.querySelector('.ai-chat-close'),
            input: widget.querySelector('.ai-chat-input input'),
            sendBtn: widget.querySelector('.ai-chat-send'),
            messages: widget.querySelector('.ai-chat-messages')
        };
    }

    attachEventListeners() {
        // Toggle chat window
        this.elements.button.addEventListener('click', () => {
            this.elements.container.classList.add('active');
            this.elements.button.style.display = 'none';
            this.elements.input.focus();
        });

        // Close chat window
        this.elements.closeBtn.addEventListener('click', () => {
            this.elements.container.classList.remove('active');
            this.elements.button.style.display = 'flex';
        });

        // Send message
        const sendMessage = async () => {
            const message = this.elements.input.value.trim();
            if (!message) return;

            // Add user message
            this.addMessage(message, 'user');
            this.elements.input.value = '';

            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.addMessage(data.reply, 'bot');
            } catch (error) {
                console.error('Error:', error);
                this.addMessage('Sorry, something went wrong.', 'bot');
            }
        };

        // Send button click
        this.elements.sendBtn.addEventListener('click', sendMessage);

        // Enter key press
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    addMessage(text, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ${role}`;
        messageDiv.innerHTML = text;
        this.elements.messages.appendChild(messageDiv);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
}

// Embed script
window.initAIChatWidget = function(config) {
    return new AIChatWidget(config);
};

(() => {
  const openBtn = document.querySelector('.ai-chat-button');
  const container = document.querySelector('.ai-chat-container');
  const closeBtn = document.querySelector('.ai-chat-close');
  const input = document.getElementById('aiMessageInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const messagesEl = document.getElementById('aiChatMessages');

  const toggle = (show) => {
    container.classList.toggle('active', show ?? !container.classList.contains('active'));
    container.setAttribute('aria-hidden', !container.classList.contains('active'));
    if (container.classList.contains('active')) input?.focus();
  };

  const scrollToBottom = () => {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  };

  const renderMessage = (text, role = 'user') => {
    const div = document.createElement('div');
    div.className = `ai-chat-message ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  };

  const mockBotReply = async (userText) => {
    // Replace this with your backend call when ready:
    // const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ message: userText })});
    // const data = await res.json(); return data.reply;
    await new Promise(r => setTimeout(r, 400));
    return `You said: "${userText}". How else can I assist?`;
  };

  const send = async () => {
    const text = (input.value || '').trim();
    if (!text) return;
    renderMessage(text, 'user');
    input.value = '';
    try {
      const reply = await mockBotReply(text);
      renderMessage(reply, 'bot');
    } catch (e) {
      renderMessage('Sorry, something went wrong. Please try again.', 'bot');
    }
  };

  // Events
  openBtn?.addEventListener('click', () => toggle(true));
  closeBtn?.addEventListener('click', () => toggle(false));
  sendBtn?.addEventListener('click', send);
  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
})();
