const rows = 3;
const cols = 4;
const cellOccupants = {};
let placedPiecesCount = 0;

// Функция для получения адаптивных размеров
function getAdaptiveDimensions() {
    const isMobile = window.innerWidth <= 700;
    
    if (isMobile) {
        // Динамический расчет на основе текущей ширины
        const maxWidth = 500;
        const areaWidth = Math.min(maxWidth, window.innerWidth - 40);
        const areaHeight = Math.round(areaWidth * 0.61); // 305/500 = 0.61
        const pieceWidth = areaWidth / cols;
        const pieceHeight = areaHeight / rows;
        
        return {
            areaWidth: areaWidth,
            areaHeight: areaHeight,
            pieceWidth: pieceWidth,
            pieceHeight: pieceHeight
        };
    } else {
        return {
            areaWidth: 600,
            areaHeight: 365,
            pieceWidth: 150,
            pieceHeight: 122
        };
    }
}

function initGame() {
    createGrid();
    createPieces();
}

function createGrid() {
    puzzleGrid.innerHTML = '';
    const dimensions = getAdaptiveDimensions();
    
    // Обновляем размеры области пазлов
    puzzleArea.style.width = `${dimensions.areaWidth}px`;
    puzzleArea.style.height = `${dimensions.areaHeight}px`;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            const hintOverlay = document.createElement('div');
            hintOverlay.className = 'hint-overlay';
            hintOverlay.id = `hint-cell-${row}-${col}`;
            cell.appendChild(hintOverlay);
            
            puzzleGrid.appendChild(cell);
            cellOccupants[`${row}-${col}`] = null;
        }
    }
}

function createPieces() {
    piecesContainer.innerHTML = '';
    
    const imageUrl = 'https://olezhka87.github.io/puzzle/img/puzzle.jpg';
    const pieces = [];
    const dimensions = getAdaptiveDimensions();
    
    // Обновляем размеры области пазлов
    puzzleArea.style.width = `${dimensions.areaWidth}px`;
    puzzleArea.style.height = `${dimensions.areaHeight}px`;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const piece = document.createElement('div');
            piece.className = 'puzzle-piece';
            piece.dataset.row = row;
            piece.dataset.col = col;
            piece.id = `piece-${row}-${col}`;
            
            piece.style.backgroundImage = `url('${imageUrl}')`;
            
            // ПРИНУДИТЕЛЬНО УСТАНАВЛИВАЕМ РАЗМЕРЫ ФОНА
            piece.style.backgroundSize = `${dimensions.areaWidth}px ${dimensions.areaHeight}px`;
            
            // АДАПТИВНЫЙ РАСЧЕТ ПОЗИЦИЙ
            const bgPosX = -col * dimensions.pieceWidth;
            const bgPosY = -row * dimensions.pieceHeight;
            piece.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
            
            // УСТАНАВЛИВАЕМ РАЗМЕРЫ ПАЗЛОВ В КОНТЕЙНЕРЕ
            piece.style.width = `${dimensions.pieceWidth}px`;
            piece.style.height = `${dimensions.pieceHeight}px`;
            
            const pieceHint = document.createElement('div');
            pieceHint.className = 'piece-hint';
            pieceHint.id = `hint-piece-${row}-${col}`;
            piece.appendChild(pieceHint);
            
            piece.draggable = true;
            piece.addEventListener('dragstart', handleDragStart);
            
            pieces.push(piece);
        }
    }
    
    shuffleArray(pieces);
    
    pieces.forEach(piece => {
        piecesContainer.appendChild(piece);
    });

    puzzleGrid.addEventListener('dragover', handleDragOver);
    puzzleGrid.addEventListener('drop', handleDrop);
    
    piecesContainer.addEventListener('dragover', handleDragOver);
    piecesContainer.addEventListener('drop', handleDropToContainer);
    
    updatePiecesCount();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Функция для подсчета ПРАВИЛЬНО поставленных пазлов
function countCorrectPieces() {
    let correctCount = 0;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellId = `${row}-${col}`;
            const pieceId = cellOccupants[cellId];
            
            if (pieceId) {
                const piece = document.getElementById(pieceId);
                const pieceRow = parseInt(piece.dataset.row);
                const pieceCol = parseInt(piece.dataset.col);
                
                if (pieceRow === row && pieceCol === col) {
                    correctCount++;
                }
            }
        }
    }
    
    return correctCount;
}

// Функция для обновления счетчика пазлов
function updatePiecesCount() {
    const correctPiecesCount = countCorrectPieces();
    const totalPieces = rows * cols;
    
    // Вызываем новую функцию прогресс-бара
    if (typeof updateProgressBar === 'function') {
        updateProgressBar(correctPiecesCount, totalPieces);
    }
    
    // Озвучиваем прогресс
    if (typeof speakProgress === 'function') {
        speakProgress(correctPiecesCount, totalPieces);
    }
    
    if (typeof checkAndSpeakCompletion === 'function') {
        checkAndSpeakCompletion();
    }
    
    checkCompletion();
}

function checkCompletion() {
    let allCorrect = true;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cellId = `${row}-${col}`;
            const pieceId = cellOccupants[cellId];
            
            if (!pieceId) {
                allCorrect = false;
                break;
            }
            
            const piece = document.getElementById(pieceId);
            const pieceRow = parseInt(piece.dataset.row);
            const pieceCol = parseInt(piece.dataset.col);
            
            if (pieceRow !== row || pieceCol !== col) {
                allCorrect = false;
                break;
            }
        }
        if (!allCorrect) break;
    }
    
    if (allCorrect) {
        // Обновляем до 100% при завершении
        if (typeof updateProgressBar === 'function') {
            updateProgressBar(rows * cols, rows * cols);
        }
        
        // Озвучиваем завершение
        if (typeof speakText === 'function') {
            speakText("БОСС! Пазл собран! Ты легенда!");
        }
        
        setTimeout(() => {
            showMagicEffect();
            setTimeout(() => {
                hidePuzzle();
                setTimeout(() => {
                    showVideo();
                }, 1000);
            }, 2000);
        }, 500);
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', this.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    
    const cell = e.target.closest('.grid-cell');
    if (!cell) return;
    
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    placePiece(piece, row, col);
}

function handleDropToContainer(e) {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain');
    const piece = document.getElementById(pieceId);
    
    returnPieceToContainer(piece);
}

function placePiece(piece, row, col) {
    const cellId = `${row}-${col}`;
    const dimensions = getAdaptiveDimensions();
    
    for (const key in cellOccupants) {
        if (cellOccupants[key] === piece.id) {
            cellOccupants[key] = null;
        }
    }
    
    const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
    const cellRect = cell.getBoundingClientRect();
    const areaRect = puzzleArea.getBoundingClientRect();
    
    const relativeLeft = cellRect.left - areaRect.left;
    const relativeTop = cellRect.top - areaRect.top;
    
    piece.style.position = 'absolute';
    piece.style.left = `${relativeLeft}px`;
    piece.style.top = `${relativeTop}px`;
    piece.style.width = `${dimensions.pieceWidth}px`;
    piece.style.height = `${dimensions.pieceHeight}px`;
    piece.classList.add('placed');
    
    puzzleArea.appendChild(piece);
    cellOccupants[cellId] = piece.id;
    
    // Проверяем корректность установки пазла с озвучкой
    if (typeof checkPiecePlacement === 'function') {
        checkPiecePlacement(piece, row, col);
    }
    
    updatePiecesCount();
}

function returnPieceToContainer(piece) {
    const dimensions = getAdaptiveDimensions();
    
    piecesContainer.appendChild(piece);
    piece.classList.remove('placed');
    piece.style.position = '';
    piece.style.left = '';
    piece.style.top = '';
    piece.style.width = `${dimensions.pieceWidth}px`;
    piece.style.height = `${dimensions.pieceHeight}px`;
    
    for (const key in cellOccupants) {
        if (cellOccupants[key] === piece.id) {
            cellOccupants[key] = null;
        }
    }
    
    updatePiecesCount();
}

function showMagicEffect() {
    for (let i = 0; i <= rows; i++) {
        const line = document.createElement('div');
        line.className = 'magic-line';
        line.style.top = `${(i * 100) / rows}%`;
        line.style.width = '100%';
        line.style.animationDelay = `${i * 0.2}s`;
        puzzleArea.appendChild(line);
    }
    
    for (let i = 0; i <= cols; i++) {
        const line = document.createElement('div');
        line.className = 'magic-line';
        line.style.left = `${(i * 100) / cols}%`;
        line.style.width = '3px';
        line.style.height = '100%';
        line.style.animation = 'magicMove 1.5s linear infinite reverse';
        line.style.animationDelay = `${i * 0.2}s`;
        puzzleArea.appendChild(line);
    }
}

function hidePuzzle() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    pieces.forEach(piece => {
        piece.style.opacity = '0';
        piece.style.transition = 'opacity 1s';
    });
    
    const lines = document.querySelectorAll('.magic-line');
    lines.forEach(line => line.remove());
}

function showVideo() {
    videoContainer.style.display = 'block';
    
    setTimeout(() => {
        completionVideo.play().catch(e => {
            console.log('Autoplay blocked:', e);
            completionVideo.controls = true;
        });
    }, 500);
    
    videoContainer.addEventListener('click', function(e) {
        if (e.target === this || e.target === this.querySelector('video')) {
            this.style.display = 'none';
            completionVideo.pause();
            completionVideo.currentTime = 0;
        }
    });
}

// ОБРАБОТЧИК ИЗМЕНЕНИЯ РАЗМЕРА С ОПТИМИЗАЦИЕЙ
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleResize, 250);
});

function handleResize() {
    const pieces = document.querySelectorAll('.puzzle-piece');
    const dimensions = getAdaptiveDimensions();
    
    // Обновляем область пазлов
    puzzleArea.style.width = `${dimensions.areaWidth}px`;
    puzzleArea.style.height = `${dimensions.areaHeight}px`;
    
    // Обновляем ВСЕ пазлы
    pieces.forEach(piece => {
        const row = parseInt(piece.dataset.row);
        const col = parseInt(piece.dataset.col);
        
        // Принудительно обновляем background-size
        piece.style.backgroundSize = `${dimensions.areaWidth}px ${dimensions.areaHeight}px`;
        
        // Пересчитываем позиции
        const bgPosX = -col * dimensions.pieceWidth;
        const bgPosY = -row * dimensions.pieceHeight;
        piece.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`;
        
        // Если пазл в контейнере - обновляем его размеры
        if (!piece.classList.contains('placed')) {
            piece.style.width = `${dimensions.pieceWidth}px`;
            piece.style.height = `${dimensions.pieceHeight}px`;
        }
        
        // Если пазл размещен - обновляем его позицию и размер
        if (piece.classList.contains('placed')) {
            const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                const cellRect = cell.getBoundingClientRect();
                const areaRect = puzzleArea.getBoundingClientRect();
                
                const relativeLeft = cellRect.left - areaRect.left;
                const relativeTop = cellRect.top - areaRect.top;
                
                piece.style.left = `${relativeLeft}px`;
                piece.style.top = `${relativeTop}px`;
                piece.style.width = `${dimensions.pieceWidth}px`;
                piece.style.height = `${dimensions.pieceHeight}px`;
            }
        }
    });
}

// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
document.addEventListener('DOMContentLoaded', function() {
    initGame();

});
