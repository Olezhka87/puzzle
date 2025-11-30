// main.js

const gameScreen = document.getElementById('gameScreen');
const puzzleArea = document.getElementById('puzzleArea');
const puzzleGrid = document.getElementById('puzzleGrid');
const piecesContainer = document.getElementById('piecesContainer');
const hintBtn = document.getElementById('hintBtn');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const videoContainer = document.getElementById('videoContainer');
const completionVideo = document.getElementById('completionVideo');
const voiceIndicator = document.getElementById('voiceIndicator');





// Кнопка подсказки
hintBtn.addEventListener('click', () => {
    const unplacedPieces = Array.from(piecesContainer.children);
    if (unplacedPieces.length > 0) {
        const randomPiece = unplacedPieces[Math.floor(Math.random() * unplacedPieces.length)];
        const correctRow = parseInt(randomPiece.dataset.row);
        const correctCol = parseInt(randomPiece.dataset.col);

        const pieceHint = document.getElementById(`hint-piece-${correctRow}-${correctCol}`);
        pieceHint.style.display = 'block';

        const cellHint = document.getElementById(`hint-cell-${correctRow}-${correctCol}`);
        cellHint.style.display = 'block';

        speakText("Посмотрите на этот пазл и его правильное место");

        setTimeout(() => {
            pieceHint.style.display = 'none';
            cellHint.style.display = 'none';
        }, 2000);

    } else {
        speakText("Все пазлы уже на своих местах!");
    }
});