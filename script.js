class TelegramApp {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.messageInput = null;
        this.sendButton = null;
        this.messagesArea = null;
        this.inputArea = null;
        this.isKeyboardOpen = false;
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-btn');
        this.messagesArea = document.getElementById('messages');
        this.inputArea = document.getElementById('input-area');
        
        this.initTelegram();
        this.setupEvents();
        this.setupViewportMonitoring();
    }
    
    initTelegram() {
        if (this.tg) {
            this.tg.ready();
            this.tg.expand();
            this.tg.setHeaderColor('#2481cc');
            this.tg.setBackgroundColor('#17212b');
        }
    }
    
    setupEvents() {
        this.messageInput.addEventListener('focus', () => {
            if (!this.isIOS()) return;
            
            this.messageInput.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
        
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }
    
    setupViewportMonitoring() {
        if (!window.visualViewport || !this.isIOS()) return;
        
        const handleViewportChange = () => {
            const keyboardHeight = window.innerHeight - window.visualViewport.height;
            const wasKeyboardOpen = this.isKeyboardOpen;
            this.isKeyboardOpen = keyboardHeight > 0;
            
            if (this.isKeyboardOpen) {
                const safeAreaBottom = window.screen.height - window.visualViewport.height - window.visualViewport.offsetTop;
                this.inputArea.style.transform = `translateY(-${keyboardHeight}px)`;
                this.messagesArea.style.paddingBottom = `${80 + keyboardHeight}px`;
            } else if (wasKeyboardOpen) {
                this.inputArea.style.transform = 'translateY(0)';
                this.messagesArea.style.paddingBottom = '80px';
            }
        };
        
        window.visualViewport.addEventListener('resize', handleViewportChange);
        window.visualViewport.addEventListener('scroll', handleViewportChange);
    }
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        this.addMessage(text, true);
        this.messageInput.value = '';
        
        setTimeout(() => {
            this.messageInput.focus();
        }, 100);
    }
    
    addMessage(text, isOutgoing = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOutgoing ? 'outgoing' : 'incoming'} new`;
        
        messageDiv.innerHTML = `
            <div class="message-bubble">${text}</div>
        `;
        
        this.messagesArea.appendChild(messageDiv);
        
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 100);
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

new TelegramApp();