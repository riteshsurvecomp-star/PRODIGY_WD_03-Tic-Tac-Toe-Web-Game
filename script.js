document.addEventListener('DOMContentLoaded', () => {

    // State
    const boardState = Array(9).fill(null);
    let currentPlayer = 'x'; // 'x' starts
    let gameActive = true;
    let gameMode = 'pvp'; // 'pvp' or 'ai'

    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const statusText = document.getElementById('game-status');
    const restartBtn = document.getElementById('restartBtn');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const p1Indicator = document.getElementById('p1-indicator');
    const p2Indicator = document.getElementById('p2-indicator');
    const modal = document.getElementById('winnerModal');
    const winnerText = document.getElementById('winnerText');
    const newGameBtn = document.getElementById('newGameBtn');

    // Winning Combinations
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Initialize
    function init() {
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        restartBtn.addEventListener('click', restartGame);
        newGameBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            restartGame();
        });

        // Mode Switching
        modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                modeBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                gameMode = e.target.getAttribute('data-mode');
                restartGame();
            });
        });
    }

    // Handle Click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (boardState[clickedCellIndex] !== null || !gameActive) {
            return;
        }

        makeMove(clickedCellIndex, currentPlayer);

        if (gameActive && gameMode === 'ai' && currentPlayer === 'o') {
            // AI Turn (delayed slightly for realism)
            setTimeout(makeAIMove, 500);
        }
    }

    // Make Move
    function makeMove(index, player) {
        boardState[index] = player;
        const cell = document.querySelector(`.cell[data-index='${index}']`);
        cell.classList.add(player);

        if (checkWin()) {
            endGame(false);
        } else if (checkDraw()) {
            endGame(true);
        } else {
            swapPlayer();
        }
    }

    // AI Logic (Minimax for Unbeatable AI)
    function makeAIMove() {
        if (!gameActive) return;

        // Simple Random AI for Easy Mode (or Minimax if we want hard)
        // Let's implement a smart Move finder (Win if can, Block if must, else Random)

        let moveIndex = -1;

        // 1. Check if AI can win
        moveIndex = findBestMove('o');

        // 2. Check if AI needs to block player
        if (moveIndex === -1) {
            moveIndex = findBestMove('x');
        }

        // 3. Pick center if available
        if (moveIndex === -1 && boardState[4] === null) {
            moveIndex = 4;
        }

        // 4. Random available
        if (moveIndex === -1) {
            const available = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            if (available.length > 0) {
                moveIndex = available[Math.floor(Math.random() * available.length)];
            }
        }

        if (moveIndex !== -1) {
            makeMove(moveIndex, 'o');
        }
    }

    // Helper to find winning move for a specific mark
    function findBestMove(mark) {
        for (let condition of winningConditions) {
            const [a, b, c] = condition;
            const vals = [boardState[a], boardState[b], boardState[c]];
            const countMark = vals.filter(v => v === mark).length;
            const countEmpty = vals.filter(v => v === null).length;

            if (countMark === 2 && countEmpty === 1) {
                if (boardState[a] === null) return a;
                if (boardState[b] === null) return b;
                if (boardState[c] === null) return c;
            }
        }
        return -1;
    }

    // Swap Player
    function swapPlayer() {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        statusText.textContent = currentPlayer === 'x' ? "Player 1's Turn" : (gameMode === 'ai' ? "AI's Turn" : "Player 2's Turn");

        if (currentPlayer === 'x') {
            p1Indicator.classList.add('active');
            p2Indicator.classList.remove('active');
        } else {
            p1Indicator.classList.remove('active');
            p2Indicator.classList.add('active');
        }
    }

    // Check Win
    function checkWin() {
        let roundWon = false;
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const valA = boardState[a];
            const valB = boardState[b];
            const valC = boardState[c];

            if (valA === null || valB === null || valC === null) {
                continue;
            }
            if (valA === valB && valB === valC) {
                roundWon = true;
                break;
            }
        }
        return roundWon;
    }

    // Check Draw
    function checkDraw() {
        return !boardState.includes(null);
    }

    // End Game
    function endGame(draw) {
        gameActive = false;
        modal.style.display = 'flex';

        if (draw) {
            winnerText.textContent = "It's a Draw!";
            // Reset gradient text
            winnerText.style.background = 'linear-gradient(to right, #94a3b8, #cbd5e1)';
            winnerText.style.webkitBackgroundClip = 'text';
            winnerText.style.webkitTextFillColor = 'transparent';
        } else {
            // Winner
            const winnerName = currentPlayer === 'x' ? "Player 1" : (gameMode === 'ai' ? "AI" : "Player 2");
            winnerText.textContent = `${winnerName} Wins!`;

            if (currentPlayer === 'x') {
                winnerText.style.background = 'var(--primary-gradient)';
            } else {
                winnerText.style.background = 'var(--secondary-gradient)';
            }
            winnerText.style.webkitBackgroundClip = 'text';
            winnerText.style.webkitTextFillColor = 'transparent';
        }
    }

    // Restart
    function restartGame() {
        currentPlayer = 'x';
        gameActive = true;
        boardState.fill(null);
        statusText.textContent = "Player 1's Turn";

        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
            cell.textContent = ''; // Clear any potential text if we used it (we use CSS classes now)
        });

        p1Indicator.classList.add('active');
        p2Indicator.classList.remove('active');

        modal.style.display = 'none';
    }

    // Run
    init();

});
