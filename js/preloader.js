const particlesContainer = document.getElementById('particles');
const particleCount = 50;
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('main-content');
const loadingText = document.querySelector('.loading-text');

// Секретные сообщения миссии
const missionMessages = [
    "Доступ к секретным материалам...",
    "Инициализация протокола...", 
    "Подключение к спутниковой сети...",
    "Миссия активирована! 🕵️"
];

// создаём частицы
for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    const x = Math.random() * 100;
    const duration = 3 + Math.random() * 3;

    particle.style.setProperty('--x', `${x}vw`);
    particle.style.animationDuration = `${duration}s`;

    particlesContainer.appendChild(particle);
}

// Функция для смены сообщений
function updateLoadingText() {
    let currentIndex = 0;
    
    // Меняем сообщение каждые 1.5 секунды
    const interval = setInterval(() => {
        if (currentIndex < missionMessages.length) {
            loadingText.textContent = missionMessages[currentIndex];
            currentIndex++;
        } else {
            clearInterval(interval);
        }
    }, 1500); // 1.5 секунды между сообщениями
}

// функция для загрузки Lottie после показа контента
function loadLottieAnimation() {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@lottiefiles/dotlottie-wc@0.8.5/dist/dotlottie-wc.js';
    script.type = 'module';
    script.onload = function() {
        // Создаем Lottie элемент после загрузки скрипта
        const lottieLeft = document.getElementById('lottie-left');
        const lottieElement = document.createElement('dotlottie-wc');
        lottieElement.setAttribute('src', './template/robot.lottie');
        lottieElement.setAttribute('autoplay', '');
        lottieElement.setAttribute('loop', '');
        lottieLeft.appendChild(lottieElement);
    };
    document.head.appendChild(script);
}

// Запускаем смену сообщений СРАЗУ при загрузке
updateLoadingText();

// переход на основное содержимое после окончания анимации прогресс-бара
const progress = document.querySelector('.progress');
progress.addEventListener('animationend', () => {
    // Скрываем прелоадер
    preloader.style.display = 'none';
    // Показываем основное содержимое
    mainContent.style.display = 'block';
    
    // Загружаем Lottie анимацию после показа контента
    loadLottieAnimation();
    
    // Инициализируем основные скрипты после загрузки контента
    setTimeout(() => {
    initGame();
    speakText("Добро пожаловать на секретную миссию! Соберите пазл из 12 частей.");
}, 500);
});