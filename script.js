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
        // Получаем элементы
        this.messageInput = document.getElementById('message-input');
        this.sendButton = document.getElementById('send-btn');
        this.messagesArea = document.getElementById('messages');
        
        // Инициализация Telegram WebApp
        this.initTelegram();
        
        // Настройка событий
        this.setupEvents();
        
        console.log('✅ Готов к тестированию бага курсора');
        
        // Автоматически фокусируемся на поле через секунду
        setTimeout(() => {
            this.messageInput.focus();
        }, 1000);
    }
    
    initTelegram() {
        if (this.tg) {
            console.log('📱 Telegram WebApp активен');
            this.tg.ready();
            this.tg.expand();
            
            // Настройка цветов
            this.tg.setHeaderColor('#2481cc');
            this.tg.setBackgroundColor('#17212b');
        } else {
            console.log('🌐 Обычный браузер (не Telegram)');
        }
    }
    
    setupEvents() {
        // ФОКУС НА ПОЛЕ ВВОДА - ТУТ ПРОИСХОДИТ БАГ НА iOS
        this.messageInput.addEventListener('focus', () => {
            console.log('🎯 Поле получило фокус');
            
            if (this.isIOS() && this.tg) {
                console.log('🐛 iOS + Telegram WebApp = БАГ КУРСОРА!');
                console.log('Курсор должен подняться выше поля ввода');
                
                // НЕ ИСПОЛЬЗУЕМ scrollIntoView - это воспроизводит баг
                // this.messageInput.scrollIntoView(); // <- ЭТО ИСПРАВИЛО БЫ ПРОБЛЕМУ
            }
        });
        
        // Потеря фокуса
        this.messageInput.addEventListener('blur', () => {
            console.log('👋 Поле потеряло фокус');
        });
        
        // Отправка сообщения
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter для отправки
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Мониторинг изменений viewport для отладки
        this.monitorViewport();
    }
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        console.log('📤 Отправка сообщения:', text);
        
        // Добавляем сообщение
        this.addMessage(text, true);
        
        // Очищаем поле
        this.messageInput.value = '';
        
        // Возвращаем фокус (тут снова может проявиться баг)
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
        
        // Прокрутка к новому сообщению
        setTimeout(() => {
            this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
        }, 100);
    }
    
    monitorViewport() {
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                const keyboardHeight = window.innerHeight - window.visualViewport.height;
                console.log('⌨️ Клавиатура:', keyboardHeight > 0 ? `высота ${keyboardHeight}px` : 'скрыта');
                
                if (keyboardHeight > 0 && this.isIOS()) {
                    console.log('🐛 ВНИМАНИЕ: На iOS курсор может быть выше поля ввода!');
                }
            });
        }
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

// Запуск приложения
new TelegramCursorTest();

// Глобальные обработчики
window.addEventListener('error', (e) => {
    console.error('❌ Ошибка:', e.error);
});

console.log('📱 Тест бага курсора в Telegram Mini App');
console.log('🎯 На iPhone: нажмите на поле ввода и курсор уедет выше!');
console.log('🔧 Чтобы исправить - проскроллите немного или добавьте scrollIntoView()');