// Глобальные переменные
let tg = window.Telegram?.WebApp;
let activeField = null;
let cursorProblemTimer = null;

// Функции определения платформы
const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
};

const isTelegramWebApp = () => {
    return window.Telegram && window.Telegram.WebApp;
};

const isIOSInTelegram = () => {
    return isIOS() && isTelegramWebApp();
};

// Логирование платформы
console.log('🔍 Определение платформы:');
console.log('🤖 Telegram WebApp:', isTelegramWebApp() ? 'Да ✅' : 'Нет ❌');
console.log('🍎 iOS:', isIOS() ? 'Да ✅' : 'Нет ❌');
console.log('📱 iOS + Telegram:', isIOSInTelegram() ? 'Да ✅ - ОЖИДАЕТСЯ БАГ!' : 'Нет ❌');

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM загружен, инициализация...');
    
    initializeTelegramWebApp();
    initializeElements();
    initializePlatformInfo();
    initializeEventListeners();
    initializeViewportMonitoring();
    
    console.log('✅ Инициализация завершена');
});

// Инициализация Telegram WebApp
function initializeTelegramWebApp() {
    if (tg) {
        console.log('🤖 Инициализация Telegram WebApp...');
        
        try {
            tg.ready();
            tg.expand();
            
            // Настройка темы
            if (tg.themeParams.bg_color) {
                document.body.style.backgroundColor = tg.themeParams.bg_color;
            }
            
            // Информация о пользователе
            const userName = document.getElementById('user-name');
            if (tg.initDataUnsafe?.user) {
                const user = tg.initDataUnsafe.user;
                userName.textContent = `${user.first_name} ${user.last_name || ''}`.trim();
            } else {
                userName.textContent = 'Valeron2206 (демо режим)';
            }
            
            // WebApp информация
            document.getElementById('webapp-version').textContent = tg.version || 'N/A';
            document.getElementById('platform').textContent = tg.platform || 'unknown';
            
            console.log('✅ Telegram WebApp инициализирован');
            console.log('📊 Версия:', tg.version);
            console.log('📱 Платформа:', tg.platform);
            
        } catch (error) {
            console.error('❌ Ошибка инициализации Telegram WebApp:', error);
        }
    } else {
        console.log('⚠️ Telegram WebApp недоступен');
        document.getElementById('user-name').textContent = 'Валерон (вне Telegram)';
        document.getElementById('webapp-version').textContent = 'Не доступно';
        document.getElementById('platform').textContent = 'Web браузер';
    }
}

// Инициализация элементов
function initializeElements() {
    // Получаем все необходимые элементы
    window.elements = {
        mainInput: document.getElementById('main-input'),
        sendButton: document.getElementById('send-button'),
        mainButton: document.getElementById('main-button'),
        testButton: document.getElementById('test-focus-button'),
        tgFields: document.querySelectorAll('.tg-field'),
        chatContainer: document.querySelector('.chat-simulation'),
        cursorIndicator: document.getElementById('cursor-problem-indicator'),
        bugStatus: document.getElementById('bug-status'),
        viewportInfo: document.getElementById('viewport-info')
    };
    
    console.log('📦 Элементы инициализированы:', Object.keys(window.elements).length);
}

// Инициализация информации о платформе
function initializePlatformInfo() {
    const platformBadge = document.getElementById('platform-badge');
    const bugStatus = window.elements.bugStatus;
    
    if (isIOSInTelegram()) {
        platformBadge.textContent = '🐛 iOS + Telegram';
        platformBadge.className = 'ios-telegram';
        bugStatus.textContent = 'Готов к демонстрации бага!';
        bugStatus.style.color = '#FF3B30';
    } else if (isIOS()) {
        platformBadge.textContent = '🍎 iOS Safari';
        platformBadge.className = 'ios';
        bugStatus.textContent = 'Нужен Telegram для демонстрации';
        bugStatus.style.color = '#FF9500';
    } else {
        platformBadge.textContent = '💻 Другая платформа';
        platformBadge.className = 'other';
        bugStatus.textContent = 'Баг не проявится на этой платформе';
        bugStatus.style.color = '#8E8E93';
    }
}

// Инициализация обработчиков событий
function initializeEventListeners() {
    const { mainInput, sendButton, mainButton, testButton, tgFields } = window.elements;
    
    // Основное поле ввода
    mainInput.addEventListener('focus', function() {
        handleTelegramFocus(this, 'Основное поле чата');
    });
    
    mainInput.addEventListener('blur', function() {
        handleTelegramBlur(this, 'Основное поле чата');
    });
    
    mainInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Дополнительные поля
    tgFields.forEach((field, index) => {
        field.addEventListener('focus', function() {
            handleTelegramFocus(this, `Поле формы ${index + 1}`);
        });
        
        field.addEventListener('blur', function() {
            handleTelegramBlur(this, `Поле формы ${index + 1}`);
        });
    });
    
    // Кнопки
    sendButton.addEventListener('click', sendMessage);
    mainButton.addEventListener('click', handleMainButtonClick);
    testButton.addEventListener('click', handleTestFocus);
    
    console.log('🎯 Обработчики событий установлены');
}

// Инициализация мониторинга viewport
function initializeViewportMonitoring() {
    updateViewportInfo();
    
    // Мониторинг изменений viewport
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handleViewportChange);
        console.log('📱 Мониторинг Visual Viewport включен');
    }
    
    // Мониторинг изменений ориентации
    window.addEventListener('orientationchange', () => {
        setTimeout(updateViewportInfo, 500);
    });
    
    // Мониторинг изменений размера окна
    window.addEventListener('resize', updateViewportInfo);
}

// Обновление информации о viewport
function updateViewportInfo() {
    const info = `${window.innerWidth}x${window.innerHeight}`;
    const viewportEl = window.elements.viewportInfo;
    if (viewportEl) {
        viewportEl.textContent = info;
    }
    console.log('📐 Viewport:', info);
}

// Обработка изменений viewport
function handleViewportChange() {
    updateViewportInfo();
    
    if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const heightDiff = window.innerHeight - currentHeight;
        
        console.log(`📱 Viewport изменен: ${currentHeight}px (разница: ${heightDiff}px)`);
        
        if (heightDiff > 150 && activeField && isIOSInTelegram()) {
            // Клавиатура появилась на iOS в Telegram
            console.log('⚠️ Клавиатура появилась - демонстрируем проблему с курсором');
            showCursorProblemWithDelay();
        } else if (heightDiff < 50) {
            // Клавиатура скрыта
            console.log('📱 Клавиатура скрыта');
            hideCursorProblem();
        }
    }
}

// ОСНОВНАЯ ФУНКЦИЯ - обработка фокуса в Telegram Mini App
function handleTelegramFocus(input, fieldName) {
    activeField = input;
    console.log(`🎯 Фокус: ${fieldName} (${input.placeholder})`);
    
    // Обновляем статус
    window.elements.bugStatus.textContent = `Фокус на: ${fieldName}`;
    window.elements.bugStatus.style.color = '#007AFF';
    
    // ПРОБЛЕМНЫЙ КОД - НЕ исправляем позицию курсора!
    // В Telegram Mini App на iOS это приводит к багу:
    // 1. Клавиатура появляется
    // 2. Telegram WebApp изменяет viewport
    // 3. iOS Safari тоже изменяет viewport
    // 4. Конфликт! Курсор оказывается НАД полем ввода
    
    if (isIOSInTelegram()) {
        console.log('🐛 iOS + Telegram: Ожидается баг с курсором!');
        console.log('📍 Курсор должен подняться ВЫШЕ поля при появлении клавиатуры');
        
        // НЕ используем scrollIntoView - это не работает в Telegram WebApp!
        // НЕ используем другие стандартные методы фикса
        
        // Показываем индикатор проблемы с задержкой
        showCursorProblemWithDelay();
        
    } else {
        console.log('ℹ️ Не iOS+Telegram: баг не проявится');
    }
}

// Обработка потери фокуса
function handleTelegramBlur(input, fieldName) {
    console.log(`👋 Потеря фокуса: ${fieldName}`);
    activeField = null;
    
    window.elements.bugStatus.textContent = 'Ожидание фокуса...';
    window.elements.bugStatus.style.color = '#8E8E93';
    
    hideCursorProblem();
}

// Показ индикатора проблемы с задержкой
function showCursorProblemWithDelay() {
    // Очищаем предыдущий таймер
    if (cursorProblemTimer) {
        clearTimeout(cursorProblemTimer);
    }
    
    // Показываем индикатор с задержкой (ждем появления клавиатуры)
    cursorProblemTimer = setTimeout(() => {
        if (activeField && isIOSInTelegram()) {
            showCursorProblem();
        }
    }, 400);
}

// Показ индикатора проблемы
function showCursorProblem() {
    const indicator = window.elements.cursorIndicator;
    indicator.style.display = 'block';
    
    console.log('🚨 Показываем индикатор проблемы с курсором');
    
    // Вибрация (если доступна в Telegram)
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    // Обновляем статус
    window.elements.bugStatus.textContent = '🐛 Демонстрация бага активна!';
    window.elements.bugStatus.style.color = '#FF3B30';
}

// Скрытие индикатора проблемы
function hideCursorProblem() {
    const indicator = window.elements.cursorIndicator;
    indicator.style.display = 'none';
    
    if (cursorProblemTimer) {
        clearTimeout(cursorProblemTimer);
        cursorProblemTimer = null;
    }
    
    console.log('✅ Индикатор проблемы скрыт');
}

// Отправка сообщения
function sendMessage() {
    const input = window.elements.mainInput;
    const message = input.value.trim();
    
    if (message) {
        console.log(`📤 Отправка: ${message}`);
        
        // Добавляем сообщение в чат
        addMessageToChat(`Вы: ${message}`);
        
        // Очищаем поле
        input.value = '';
        
        // Вибрация в Telegram
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.impactOccurred('light');
        }
        
        // Имитируем ответ
        setTimeout(() => {
            addMessageToChat('🤖 Сообщение получено! Проблема с курсором воспроизведена?');
        }, 1500);
        
    } else {
        console.log('⚠️ Пустое сообщение');
        
        if (tg && tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('error');
        }
    }
}

// Добавление сообщения в чат
function addMessageToChat(text) {
    const chatContainer = window.elements.chatContainer;
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message tg-message';
    messageDiv.textContent = text;
    
    // Добавляем временную метку
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + 
                now.getMinutes().toString().padStart(2, '0');
    messageDiv.textContent += ` (${time})`;
    
    chatContainer.appendChild(messageDiv);
    
    // Плавный скролл к новому сообщению
    setTimeout(() => {
        messageDiv.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
    }, 100);
    
    console.log('💬 Сообщение добавлено в чат');
}

// Обработка главной кнопки Telegram
function handleMainButtonClick() {
    console.log('🚀 Главная кнопка нажата');
    
    if (tg) {
        // Показываем MainButton Telegram
        tg.MainButton.setText('🎉 Отлично работает!');
        tg.MainButton.color = '#00C896';
        tg.MainButton.show();
        
        // Вибрация
        tg.HapticFeedback.impactOccurred('heavy');
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            tg.MainButton.hide();
        }, 3000);
        
        addMessageToChat('🚀 Главная кнопка Telegram активирована!');
    } else {
        alert('🤖 Главная кнопка работает только в Telegram!');
        addMessageToChat('⚠️ Главная кнопка доступна только в Telegram');
    }
}

// Тестирование фокуса
function handleTestFocus() {
    console.log('🧪 Принудительный тест фокуса');
    
    const input = window.elements.mainInput;
    input.focus();
    
    if (isIOSInTelegram()) {
        alert('🐛 На iOS в Telegram курсор должен подняться ВЫШЕ поля ввода!');
        addMessageToChat('🧪 Тест фокуса запущен - проверьте позицию курсора!');
    } else if (isIOS()) {
        alert('📱 Откройте в Telegram на iPhone для демонстрации бага!');
    } else {
        alert('💻 На этой платформе баг не проявляется. Нужен iPhone + Telegram.');
    }
    
    // Вибрация
    if (tg && tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

// Автоматический скролл при загрузке
setTimeout(() => {
    if (window.innerWidth <= 768) {
        console.log('📱 Автоскролл к полю ввода на мобильном');
        window.elements.mainInput.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    }
}, 2000);

// Показ предупреждений
setTimeout(() => {
    if (!isTelegramWebApp()) {
        console.log('⚠️ Не Telegram WebApp');
        addMessageToChat('⚠️ Откройте как Telegram Mini App для полной демонстрации!');
    } else if (!isIOS()) {
        console.log('💡 Не iOS');
        addMessageToChat('💡 Для демонстрации бага нужен iPhone + Telegram');
    } else {
        console.log('✅ Идеальные условия для демонстрации');
        addMessageToChat('✅ Готово к демонстрации бага на iOS!');
    }
}, 3000);

// Экспорт функций для отладки
window.debugTelegramApp = {
    isIOS,
    isTelegramWebApp,
    isIOSInTelegram,
    showCursorProblem,
    hideCursorProblem,
    activeField: () => activeField,
    elements: () => window.elements
};

console.log('🔧 Функции отладки доступны в window.debugTelegramApp');