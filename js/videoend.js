// video-end.js - Обработка завершения видео
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('completionVideo');
    const videoContainer = document.getElementById('videoContainer');
    const mainContent = document.getElementById('main-content');
    
    if (video) {
        video.addEventListener('ended', function() {
            showLogoAfterVideo();
        });
        
        // Также обрабатываем случай, если видео было пропущено
        video.addEventListener('pause', function() {
            if (video.currentTime >= video.duration - 1) {
                showLogoAfterVideo();
            }
        });
    }
});

function showLogoAfterVideo() {
    const mainContent = document.getElementById('main-content');
    const videoContainer = document.getElementById('videoContainer');
    
    // Создаем экран с логотипом
    const logoScreen = document.createElement('div');
    logoScreen.id = 'logo-screen';
    logoScreen.innerHTML = `
        <div class="logo-container">
            <img src="img/logo.png" alt="Логотип" class="final-logo">
            <div class="completion-text">Миссия выполнена успешно!</div>
        </div>
    `;
    
    // Скрываем видео контейнер
    if (videoContainer) {
        videoContainer.style.display = 'none';
    }
    
    // Добавляем экран с логотипом
    document.body.appendChild(logoScreen);
    
    // Прячем основной контент игры
    if (mainContent) {
        mainContent.style.display = 'none';
    }
    
    // Добавляем стили для экрана с логотипом
    addLogoScreenStyles();
}

function addLogoScreenStyles() {
    const styles = `
        <style>
            #logo-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #000;
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 1s ease-in;
            }
            
            .logo-container {
                text-align: center;
                animation: scaleIn 1.5s ease-out;
            }
            
            .final-logo {
                max-width: 300px;
                max-height: 300px;
                width: auto;
                height: auto;
                filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
                animation: pulse 2s infinite;
            }
            
            .completion-text {
                color: white;
                font-family: 'Programme Pan', sans-serif;
                font-size: 24px;
                margin-top: 30px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
                animation: textGlow 2s infinite alternate;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes scaleIn {
                from { 
                    opacity: 0;
                    transform: scale(0.5);
                }
                to { 
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes textGlow {
                from { text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); }
                to { text-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.6); }
            }
            
            /* Адаптивность */
            @media (max-width: 768px) {
                .final-logo {
                    max-width: 200px;
                    max-height: 200px;
                }
                
                .completion-text {
                    font-size: 18px;
                    margin-top: 20px;
                }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', styles);
}