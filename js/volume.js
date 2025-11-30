const volumeControl = document.getElementById('volume-control');
const volumeBar = volumeControl.querySelector('.volume-bar');
const volumeLevel = volumeControl.querySelector('.volume-level');
const volumeIcon = volumeControl.querySelector('.volume-icon');
const audio = document.getElementById('myAudio');

// Начальная громкость - звук ВКЛЮЧЕН
audio.volume = 0.5;
audio.muted = false; // ← ГЛАВНОЕ: звук не заглушен
let lastVolume = 0.5;

// Обновляем визуальное состояние
updateVolumeDisplay();

// Функция для безопасного запуска аудио
function safePlayAudio() {
    // Пытаемся воспроизвести, обрабатывая ошибки автовоспроизведения
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.log('Автовоспроизведение заблокировано. Звук готов, ждет пользователя.');
            // Создаем кнопку для ручного запуска если нужно
            createFallbackButton();
        });
    }
}

// Функция создания кнопки если автовоспроизведение заблокировано
function createFallbackButton() {
    if (document.getElementById('audio-fallback-btn')) return;
    
    const button = document.createElement('button');
    button.id = 'audio-fallback-btn';
    button.textContent = '🎵 Включить музыку';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 10px 15px;
        background: #ff5722;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
    `;
    
    button.addEventListener('click', () => {
        audio.play().then(() => {
            button.remove();
        });
    });
    
    document.body.appendChild(button);
}

// Запускаем аудио при первой возможности
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(safePlayAudio, 1000); // Даем странице немного загрузиться
});

// Также запускаем при любом взаимодействии пользователя
['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, safePlayAudio, { once: true });
});

// Клик по полоске громкости
volumeBar.addEventListener('click', (e) => {
    safePlayAudio(); // Пытаемся запустить если еще не играет
    setVolumeFromEvent(e);
});

// Перетаскивание громкости
volumeBar.addEventListener('mousedown', (e) => {
    safePlayAudio(); // Пытаемся запустить если еще не играет
    
    function moveHandler(e) {
        setVolumeFromEvent(e);
    }
    
    function upHandler() {
        document.removeEventListener('mousemove', moveHandler);
        document.removeEventListener('mouseup', upHandler);
    }
    
    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', upHandler);
});

// Клик по иконке звука - mute/unmute
volumeIcon.addEventListener('click', () => {
    safePlayAudio(); // Пытаемся запустить если еще не играет
    
    if (audio.muted) {
        // Включаем звук
        audio.muted = false;
        audio.volume = lastVolume;
        updateVolumeDisplay();
    } else {
        // Выключаем звук
        lastVolume = audio.volume;
        audio.muted = true;
        updateVolumeDisplay();
    }
});

function setVolumeFromEvent(e) {
    const rect = volumeBar.getBoundingClientRect();
    const height = rect.height;
    const clickY = e.clientY - rect.top;
    
    let volume = 1 - (clickY / height);
    volume = Math.max(0, Math.min(1, volume));
    
    audio.volume = volume;
    audio.muted = false;
    lastVolume = volume;
    updateVolumeDisplay();
}

function updateVolumeDisplay() {
    if (audio.muted || audio.volume === 0) {
        volumeLevel.style.height = '0%';
        volumeIcon.innerHTML = '🔇';
        volumeIcon.style.opacity = '0.7';
    } else {
        volumeLevel.style.height = (audio.volume * 100) + '%';
        volumeIcon.innerHTML = '🔊';
        volumeIcon.style.opacity = '1';
    }
}

// Функция скачивания трека
function downloadTrack() {
    const audioSrc = audio.querySelector('source').src;
    const link = document.createElement('a');
    link.href = audioSrc;
    link.download = 'music-track.mp3';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Обновляем иконку при изменении громкости
audio.addEventListener('volumechange', updateVolumeDisplay);