class iOSCursorBugDemo {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.messageInput = null;
        this.bugIndicator = null;
        this.fixEnabled = false;
        this.isKeyboardOpen = false;
        
        this.init();
    }
    
    init() {
        console.log('🚀 iOS Cursor Bug Demo - Запуск');
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.messageInput = document.getElementById('message-input');
        this.bugIndicator = document.getElementById('bug-indicator');
        const fixToggle = document.getElementById('fix-enabled');
        
        this.initTelegram();
        
        // Настройка событий
        this.setupInputEvents();
        this.setupViewportMonitoring();
        
        // Переключатель фикса
        fixToggle.addEventListener('change', (e) => {
            this.fixEnabled = e.target.checked;
            console.log('🔧 Фикс', this.fixEnabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН');
        });
        
        // Автоматически прокручиваем вниз
        setTimeout(() => {
            this.scrollToBottom();
            console.log('✅ Готов к тесту! Нажмите на поле ввода на iPhone');
        }, 1000);
    }
    
    initTelegram() {
        if (this.tg) {
            console.log('📱 Telegram WebApp активен');
            this.tg.ready();
            this.tg.expand();
            this.tg.setHeaderColor('#2481cc');
        } else {
            console.log('🌐 Тестирование в обычном браузере');
        }
    }
    
    setupInputEvents() {
        // ФОКУС НА ПОЛЕ - МОМЕНТ ИСТИНЫ!
        this.messageInput.addEventListener('focus', (e) => {
            console.log('🎯 FOCUS EVENT - поле получило фокус');
            
            if (this.isIOS()) {
                console.log('🍎 iOS ОБНАРУЖЕН!');
                
                if (this.fixEnabled) {
                    console.log('✅ Фикс включен - применяем scrollIntoView');
                    this.applyFix();
                } else {
                    console.log('🐛 Фикс выключен - БАГ ДОЛЖЕН ПРОЯВИТЬСЯ!');
                    this.showBugIndicator();
                }
            }
            
            // Мониторинг позиции
            setTimeout(() => this.debugPosition(), 100);
            setTimeout(() => this.debugPosition(), 300);
            setTimeout(() => this.debugPosition(), 600);
        });
        
        // Потеря фокуса
        this.messageInput.addEventListener('blur', () => {
            console.log('👋 Поле потеряло фокус');
            this.hideBugIndicator();
        });
        
        // Отправка сообщения
        document.getElementById('send-btn').addEventListener('click', () => {
            const text = this.messageInput.value.trim();
            if (text) {
                console.log('📤 Отправлено:', text);
                this.messageInput.value = '';
                
                // Возвращаем фокус - может снова вызвать баг
                setTimeout(() => {
                    this.messageInput.focus();
                }, 100);
            }
        });
    }
    
    setupViewportMonitoring() {
        // Visual Viewport API для отслеживания клавиатуры
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', () => {
                const keyboardHeight = window.innerHeight - window.visualViewport.height;
                const wasKeyboardOpen = this.isKeyboardOpen;
                this.isKeyboardOpen = keyboardHeight > 0;
                
                if (this.isKeyboardOpen && !wasKeyboardOpen) {
                    console.log('⌨️ Клавиатура ОТКРЫЛАСЬ! Высота:', keyboardHeight);
                    
                    if (this.isIOS() && !this.fixEnabled) {
                        console.log('🐛 ВНИМАНИЕ: БАГ КУРСОРА АКТИВЕН!');
                        setTimeout(() => {
                            this.debugPosition();
                        }, 200);
                    }
                } else if (!this.isKeyboardOpen && wasKeyboardOpen) {
                    console.log('⌨️ Клавиатура закрылась');
                    this.hideBugIndicator();
                }
            });
        }
        
        // Обычные события resize
        window.addEventListener('resize', () => {
            console.log('📐 Window resize:', window.innerWidth, 'x', window.innerHeight);
        });
    }
    
    // ФИКС БАГА - scrollIntoView при фокусе
    applyFix() {
        console.log('🔧 Применяем фикс: scrollIntoView');
        
        // Метод 1: scrollIntoView
        this.messageInput.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Метод 2: ручная прокрутка (альтернатива)
        // const inputRect = this.messageInput.getBoundingClientRect();
        // const viewportHeight = window.visualViewport?.height || window.innerHeight;
        // if (inputRect.bottom > viewportHeight * 0.8) {
        //     window.scrollBy(0, inputRect.bottom - viewportHeight * 0.7);
        // }
    }
    
    showBugIndicator() {
        this.bugIndicator.classList.add('show');
        console.log('🚨 Индикатор бага показан');
    }
    
    hideBugIndicator() {
        this.bugIndicator.classList.remove('show');
    }
    
    debugPosition() {
        const inputRect = this.messageInput.getBoundingClientRect();
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const windowHeight = window.innerHeight;
        
        console.log('📍 DEBUG ПОЗИЦИИ:');
        console.log('  Input top:', Math.round(inputRect.top));
        console.log('  Input bottom:', Math.round(inputRect.bottom));
        console.log('  Viewport height:', viewportHeight);
        console.log('  Window height:', windowHeight);
        console.log('  Input visible:', inputRect.top >= 0 && inputRect.bottom <= viewportHeight);
        
        if (inputRect.bottom > viewportHeight || inputRect.top < 0) {
            console.log('🐛 БАГ ПОДТВЕРЖДЕН! Поле ввода не полностью видно');
            console.log('💡 Курсор находится вне видимой области');
        } else {
            console.log('✅ Поле ввода видно полностью');
        }
    }
    
    scrollToBottom() {
        const messagesArea = document.getElementById('messages');
        messagesArea.scrollTop = messagesArea.scrollHeight;
        console.log('📜 Прокрутили вниз');
    }
    
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
}

// Запуск демонстрации
new iOSCursorBugDemo();

// Инструкции в консоли
console.log('📱 === iOS CURSOR BUG DEMO ===');
console.log('');
console.log('🎯 ИНСТРУКЦИЯ:');
console.log('1. Откройте на iPhone в Telegram WebApp');
console.log('2. Прокрутите до поля ввода внизу');
console.log('3. Нажмите на поле ввода');
console.log('4. 🐛 Курсор "уедет" выше поля!');
console.log('5. ✅ Включите чекбокс "Включить фикс"');
console.log('6. Нажмите на поле снова - баг исправлен!');
console.log('');
console.log('🔧 ТЕХНИЧЕСКОЕ РЕШЕНИЕ:');
console.log('- При фокусе вызывать input.scrollIntoView()');
console.log('- Или ручную прокрутку к полю ввода');
console.log('- Мониторить изменения visualViewport');