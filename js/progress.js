// Функция для обновления прогресс-бара
function updateProgressBar(completed, total) {
    const progress = (completed / total) * 100;
    const fill = document.getElementById('puzzleProgressFill');
    const percent = document.getElementById('progressPercent');
    const counter = document.getElementById('progressCounter');
    
    if (fill) {
        fill.style.width = `${progress}%`;
        
        // Меняем неоновый цвет
        if (progress < 25) {
            fill.style.background = 'linear-gradient(90deg, #ff0040, #ff6b6b)';
            fill.style.boxShadow = '0 0 10px #ff0040, 0 0 20px rgba(255, 0, 64, 0.6)';
        } else if (progress < 50) {
            fill.style.background = 'linear-gradient(90deg, #ff6b6b, #ffaa00)';
            fill.style.boxShadow = '0 0 10px #ffaa00, 0 0 20px rgba(255, 170, 0, 0.6)';
        } else if (progress < 75) {
            fill.style.background = 'linear-gradient(90deg, #ffaa00, #aaff00)';
            fill.style.boxShadow = '0 0 10px #aaff00, 0 0 20px rgba(170, 255, 0, 0.6)';
        } else if (progress < 100) {
            fill.style.background = 'linear-gradient(90deg, #aaff00, #00ff88)';
            fill.style.boxShadow = '0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.6)';
        } else {
            fill.style.background = 'linear-gradient(90deg, #00ff88, #00ffcc)';
            fill.style.boxShadow = '0 0 15px #00ff88, 0 0 30px rgba(0, 255, 136, 0.8)';
        }
    }
    
    if (percent) percent.textContent = `${Math.round(progress)}%`;
    if (counter) counter.textContent = `${completed} из ${total} собрано`;
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateProgressBar(0, 12);
    }, 1000);
});