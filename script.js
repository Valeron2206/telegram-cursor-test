// Простой скрипт для тестирования бага курсора
class CursorBugTest {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.messageInput = null;
        this.sendButton = null;
        this.messagesContainer = null;
        this.debugPanel = null;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Инициализация теста курсора');
        
        // Ждем загрузки DOM
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
        this.messagesContainer = document.getElementById('messages');
        this.debugPanel = document.getElementById('debug-panel');
        
        // Инициализация Telegram WebApp
        this.initTelegram();
        
        // Настройка событий
        this.setupEvents();
        
        // Обновление статуса
        this.updateStatus();
        
        // Мониторинг viewport
        this.startViewportMonitoring();
        
        console.log('✅ Тест готов');
    }
    
    initTelegram() {
        if (this.tg) {
            console.log('📱 Telegram WebApp активен');
            this.tg.ready();
            this.tg.expand();
            
            // Отключаем темную тему, используем только светлую
            this.tg.setHeaderColor('#25D366');
            
            document.getElementById('status').textContent = 'Telegram WebApp активен';
        } else {
            console.log('🌐 Обычный браузер');
            document.getElementById('status').textContent = 'Откройте в Telegram';
        }
    }
    
    setupEvents() {
        // Фокус на поле ввода - ТУТ ПРОИСХОДИТ БАГ
        this.messageInput.addEventListener('focus', () => {
            console.log('🎯 Поле получило фокус');
            
            if (this.isIOS() && this.tg) {
                console.log('🐛 iOS + Telegram = баг курсора должен проявиться!');
                document.getElementById('status').textContent = 'Баг курсора активен!';
                
                // Показываем debug панель на iOS
                this.debugPanel.classList.add('show');
            }
            
            this.updateDebugInfo();
        });
        
        // Потеря фокуса
        this.messageInput.addEventListener('blur', () => {
            console.log('👋 Поле потеряло фокус');
            document.getElementById('status').textContent = 'Готов к тестированию';
        });
        
        // Ввод текста
        this.messageInput.addEventListener('input', () => {
            this.updateDebugInfo();
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
    }
    
    sendMessage() {
        const text = this.messageInput.value.trim();
        if (!text) return;
        
        console.log('📤 Отправка:', text);
        
        // Добавляем сообщение
        this.addMessage(text, true);
        
        // Очищаем поле
        this.messageInput.value = '';
        
        // Имитируем ответ
        setTimeout(() => {
            this.addMessage('Сообщение получено! 👍', false);
        }, 1000);
    }
    
    addMessage(text, isOutgoing = false) {
        const messageGroup = this.messagesContainer.querySelector('.message-group');
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isOutgoing ? 'outgoing' : 'incoming'} new`;
        
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0');
        
        messageDiv.innerHTML = `
            <div class="message-bubble">${text}</div>
            <div class="message-time">${time}</div>
        `;
        
        messageGroup.appendChild(messageDiv);
        
        // Прокрутка к новому сообщению
        setTimeout(() => {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 100);
    }
    
    updateStatus() {
        const platform = this.isIOS() ? '🍎 iOS' : '🤖 Другая платформа';
        const telegram = this.tg ? '✅ Telegram' : '❌ Браузер';
        
        document.getElementById('platform').textContent = platform;
        document.getElementById('status').textContent = `${platform} | ${telegram}`;
    }
    
    startViewportMonitoring() {
        const updateViewport = () => {
            const viewport = `${window.innerWidth}x${window.innerHeight}`;
            document.getElementById('viewport').textContent = viewport;
            
            // Проверка клавиатуры через Visual Viewport API
            if (window.visualViewport) {
                const keyboardVisible = window.visualViewport.height < window.innerHeight;
                document.getElementById('keyboard').textContent = keyboardVisible ? 'Да' : 'Нет';
            }
            
            this.updateDebugInfo();
        };
        
        window.addEventListener('resize', updateViewport);
        
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewport);
        }
        
        updateViewport();
    }
    
    updateDebugInfo() {
        if (!this.messageInput) return;
        
        const rect = this.messageInput.getBoundingClientRect();
        console.log('📍 Позиция поля:', {
            top: rect.top,
            bottom: rect.bottom,
            height: rect.height
        });
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

// Запуск теста
new CursorBugTest();

// Глобальная обработка ошибок
window.addEventListener('error', (e) => {
    console.error('❌ Ошибка:', e.error);
});

console.log('📱 Тест бага курсора в Telegram Mini App');
console.log('🎯 Нажмите на поле ввода на iPhone для воспроизведения');