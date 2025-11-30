// particles.js - Яркие летающие частицы для темного фона
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 100; // Увеличил количество
        this.mouse = { x: 0, y: 0, radius: 120 };

        this.init();
    }

    init() {
        // Стилизация canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        
        // Добавляем canvas в body
        document.body.appendChild(this.canvas);

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Создаем частицы
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas));
        }

        // Слушатель движения мыши
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        // Слушатель ухода мыши с окна
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -100;
            this.mouse.y = -100;
        });

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Обновляем и рисуем частицы
        this.particles.forEach(particle => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
        });

        // Рисуем соединения между частицами
        this.drawConnections();

        requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        const maxDistance = 120;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = 1 - (distance / maxDistance);
                    // Более яркие линии
                    this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.4})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 3 + 1.5; // Увеличил размер
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = this.getRandomColor();
        this.alpha = Math.random() * 0.8 + 0.4; // Увеличил прозрачность
        this.originalAlpha = this.alpha;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, ALPHA)',      // Яркий белый
            'rgba(255, 255, 255, ALPHA)',      // Еще белый
            'rgba(173, 216, 230, ALPHA)',      // Яркий голубой
            'rgba(135, 206, 250, ALPHA)',      // Light Sky Blue
            'rgba(100, 149, 237, ALPHA)',      // Cornflower Blue
            'rgba(176, 224, 230, ALPHA)',      // Powder Blue
            'rgba(240, 255, 255, ALPHA)',      // Azure
            'rgba(224, 255, 255, ALPHA)',      // Light Cyan
            'rgba(175, 238, 238, ALPHA)',      // Pale Turquoise
            'rgba(255, 250, 205, ALPHA)'       // Lemon Chiffon (легкий желтый для контраста)
        ];
        return colors[Math.floor(Math.random() * colors.length)].replace('ALPHA', this.alpha);
    }

    update(mouse) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Отскок от границ
        if (this.x > this.canvas.width + 10 || this.x < -10) {
            this.speedX = -this.speedX;
        }
        if (this.y > this.canvas.height + 10 || this.y < -10) {
            this.speedY = -this.speedY;
        }

        // Взаимодействие с мышью
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius && mouse.x > 0 && mouse.y > 0) {
            // Отталкивание от мыши
            const force = (mouse.radius - distance) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
        }

        // Пульсация прозрачности
        this.alpha = this.originalAlpha + Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset) * 0.3;
        this.alpha = Math.max(0.3, Math.min(1, this.alpha)); // Минимальная прозрачность увеличена
    }

    draw(ctx) {
        ctx.save();
        
        // Добавляем свечение для ярких частиц
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.shadowBlur = 10;
        ctx.globalAlpha = this.alpha;
        
        ctx.fillStyle = this.color.replace(/[\d.]+\)$/, this.alpha + ')');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// Инициализация системы частиц после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    // Ждем завершения прелоадера
    setTimeout(() => {
        new ParticleSystem();
    }, 1500);
});