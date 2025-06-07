class TelegramCursorTest {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.messageInput = null;
        this.sendButton = null;
        this.messagesArea = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Telegram Mini App - Тест курсора');
        
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
        
        this.initTelegram();
        this.setupEvents();
        
        console.log('✅ Готов к тестированию бага курсора');
    }
    
    initTelegram() {
        if (this.tg) {
            console.log('📱 Telegram WebApp активен');
            this.tg.ready();
            this.tg.expand();
            this.tg.setHeaderColor('#2481cc');
            this.tg.setBackgroundColor('#17212b');
        } else {
            console.log('🌐 Обычный браузер (не Telegram)');
        }
    }
    
    setupEvents() {
        this.messageInput.addEventListener('focus', () => {
            console.log('🎯 Поле получило фокус');
        });
        
        this.messageInput.addEventListener('blur', () => {
            console.log('👋 Поле потеряло фокус');
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
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        console.log('📤 Отправка сообщения:', text);
        
        this.addMessage(text, true);
        this.messageInput.value = '';
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

new TelegramCursorTest();