// Простой онлайн счетчик без Firebase
class SimpleOnlineCounter {
    constructor() {
        this.onlineCount = document.getElementById('onlineCount');
        this.count = 3; // Начальное значение
        this.init();
    }
    
    init() {
        // Обновляем счетчик каждые 5-15 секунд
        setInterval(() => {
            this.updateCounter();
        }, Math.random() * 10000 + 5000);
        
        // При фокусе окна - увеличиваем (как будто кто-то зашел)
        window.addEventListener('focus', () => {
            setTimeout(() => {
                this.count += 1;
                this.updateDisplay();
                this.showNotification("Новый игрок присоединился 👋");
            }, 2000);
        });
        
        // При потере фокуса - уменьшаем (как будто кто-то ушел)
        window.addEventListener('blur', () => {
            setTimeout(() => {
                if (this.count > 1) {
                    this.count -= 1;
                    this.updateDisplay();
                }
            }, 5000);
        });
    }
    
    updateCounter() {
        // Случайное изменение +-1
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = Math.max(1, this.count + change);
        
        if (newCount !== this.count) {
            this.count = newCount;
            this.updateDisplay();
            
            // Показываем уведомление иногда
            if (Math.random() > 0.6) {
                const messages = [
                    "Кто-то присоединился 👋",
                    "Кто-то ушел... 👋", 
                    "Новый игрок в игре! 🎮",
                    "Кто-то собирает пазл 🧩"
                ];
                this.showNotification(messages[Math.floor(Math.random() * messages.length)]);
            }
        }
    }
    
    updateDisplay() {
        this.onlineCount.textContent = this.count;
        
        // Анимация
        this.onlineCount.style.transform = 'scale(1.3)';
        this.onlineCount.style.color = '#4CAF50';
        
        setTimeout(() => {
            this.onlineCount.style.transform = 'scale(1)';
            this.onlineCount.style.color = 'white';
        }, 300);
    }
    
    showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'activity-notification';
        notification.textContent = text;
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            z-index: 1001;
            font-size: 12px;
            animation: slideInRight 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Запускаем когда страница загрузится
document.addEventListener('DOMContentLoaded', function() {
    new SimpleOnlineCounter();
});