const speechSynth = window.speechSynthesis;

function speakText(text, rate = 1.0, pitch = 1.0) {
    // Проверяем Firefox
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    if (isFirefox) {
        console.log("Firefox detected - speech disabled");
        return;
    }
    
    if ('speechSynthesis' in window) {
        speechSynth.cancel();
        
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'ru-RU';
        speech.rate = rate;
        speech.pitch = pitch;
        speech.volume = 1.0;
        
        // Ищем русский голос
        const voices = speechSynth.getVoices();
        const ruVoice = voices.find(voice => voice.lang.startsWith('ru'));
        if (ruVoice) {
            speech.voice = ruVoice;
        }
        
        speechSynth.speak(speech);
    }
}

// Функция для озвучки прогресса
function speakProgress(completed, total) {
    const progress = (completed / total) * 100;
    
    const progressPhrases = {
        50: [
            "Половина! Ты нереальный!",
            "50%! Жги еще, полубог пазлов!",
            "О да! Пол пути пройдено!"
        ],
        75: [
            "75%! Осталось чуть-чуть!",
            "Почти у цели! 75% готово!",
            "Финальная прямая! 75% собрано!"
        ],
        100: [
            "БОСС! Пазл собран! Ты легенда!",
            "100%! Ты просто бог пазлов!",
            "Великолепно! Миссия выполнена!"
        ]
    };
    
    if (progressPhrases[progress] && completed === (progress / 100) * total) {
        const randomPhrase = progressPhrases[progress][Math.floor(Math.random() * progressPhrases[progress].length)];
        speakText(randomPhrase, 0.9, 1.1);
    }
}

// Функция для проверки завершения пазла и автоматического озвучивания
function checkAndSpeakCompletion() {
    let allCorrect = true;
    let allFilled = true;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellId = `${row}-${col}`;
            const pieceId = cellOccupants[cellId];
            
            if (!pieceId) {
                allFilled = false;
                allCorrect = false;
                break;
            }
            
            const piece = document.getElementById(pieceId);
            const pieceRow = parseInt(piece.dataset.row);
            const pieceCol = parseInt(piece.dataset.col);
            
            if (pieceRow !== row || pieceCol !== col) {
                allCorrect = false;
            }
        }
        if (!allFilled) break;
    }
    
    // Если все ячейки заполнены
    if (allFilled) {
        if (allCorrect) {
            // Все пазлы на своих местах
            speakText("Пазл собран верно! Запускаю видео...");
            setTimeout(() => {
                showMagicEffect();
                setTimeout(() => {
                    hidePuzzle();
                    setTimeout(() => {
                        showVideo();
                    }, 1000);
                }, 2000);
            }, 500);
        } else {
            // Все ячейки заполнены, но неверно
            speakText("Пазл собран неверно! Проверьте расположение пазлов.");
        }
    }
}