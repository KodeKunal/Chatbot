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
                <div class="ai-chat-messages"></div>
                <div class="ai-chat-input">
                    <input type="text" placeholder="Type your message...">
                    <button class="ai-chat-send"><i class="fas fa-paper-plane"></i></button>
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
            this.addMessage(message, false);
            this.elements.input.value = '';

            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message })
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                this.addMessage(data.reply, true);
            } catch (error) {
                console.error('Error:', error);
                this.addMessage('Sorry, something went wrong.', true);
            }
        };

        // Send button click
        this.elements.sendBtn.addEventListener('click', sendMessage);

        // Enter key press
        this.elements.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    addMessage(text, isBot) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-chat-message ${isBot ? 'bot' : 'user'}`;
        messageDiv.innerHTML = text;
        this.elements.messages.appendChild(messageDiv);
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }
}

// Embed script
window.initAIChatWidget = function(config) {
    return new AIChatWidget(config);
};
