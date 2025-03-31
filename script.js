document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const winnerMessage = document.getElementById('winner-message');
    const winnerText = document.getElementById('winner-text');
    const scoreX = document.getElementById('score-x');
    const scoreO = document.getElementById('score-o');
    const scoreContainerX = document.getElementById('score-container-x');
    const scoreContainerO = document.getElementById('score-container-o');

    let currentPlayer = 'x';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scores = { x: 0, o: 0 };

    // Winning combinations
    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // Initialize game
    function startGame() {
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
            cell.addEventListener('click', handleCellClick, { once: true });
        });
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'x';
        updateStatusDisplay();
        winnerMessage.classList.remove('show');
        
        // Remove any remaining confetti
        document.querySelectorAll('.confetti').forEach(el => el.remove());
        
        // Add 3D effect on start
        board.style.transform = 'rotateX(15deg)';
        setTimeout(() => {
            board.style.transform = 'rotateX(0)';
        }, 500);
    }

    // Handle cell click
    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (gameBoard[index] !== '' || !gameActive) return;

        // Update UI and internal board state
        updateCell(cell, index);
        
        // Check for win or draw
        if (checkWin()) {
            endGame(false);
        } else if (isDraw()) {
            endGame(true);
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
            updateStatusDisplay();
        }
    }

    // Update status display with current player and styling
    function updateStatusDisplay() {
        status.textContent = `Player ${currentPlayer.toUpperCase()}'s turn`;
        status.className = 'status';
        status.classList.add(`${currentPlayer}-turn`);
        
        // Highlight current player's score
        scoreContainerX.classList.remove('highlight');
        scoreContainerO.classList.remove('highlight');
        
        if (currentPlayer === 'x') {
            scoreContainerX.classList.add('highlight');
        } else {
            scoreContainerO.classList.add('highlight');
        }
    }

    // Update cell state
    function updateCell(cell, index) {
        gameBoard[index] = currentPlayer;
        cell.classList.add(currentPlayer);
        
        // Add small animation effect
        cell.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cell.style.transform = 'scale(1)';
        }, 150);
    }

    // Check for win
    function checkWin() {
        return winningCombos.some(combo => {
            return combo.every(index => {
                return gameBoard[index] === currentPlayer;
            });
        });
    }

    // Check for draw
    function isDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    // Create confetti effect for winner
    function createConfetti() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd166', '#6c5ce7', '#f0f'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -10 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 5 + 's';
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
            }, 8000);
        }
    }

    // End the game
    function endGame(isDraw) {
        gameActive = false;
        
        if (isDraw) {
            winnerText.textContent = "It's a draw!";
        } else {
            winnerText.textContent = `Player ${currentPlayer.toUpperCase()} wins!`;
            // Update score
            scores[currentPlayer]++;
            updateScores();
            
            // Create celebratory confetti for winner
            createConfetti();
        }
        
        winnerMessage.classList.add('show');
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }

    // Update score display
    function updateScores() {
        scoreX.textContent = scores.x;
        scoreO.textContent = scores.o;
        
        // Add animation to updated score
        if (currentPlayer === 'x') {
            scoreX.style.transform = 'scale(1.2)';
            setTimeout(() => { scoreX.style.transform = 'scale(1)'; }, 300);
        } else {
            scoreO.style.transform = 'scale(1.2)';
            setTimeout(() => { scoreO.style.transform = 'scale(1)'; }, 300);
        }
    }

    // Event listeners
    resetBtn.addEventListener('click', () => {
        scores = { x: 0, o: 0 };
        updateScores();
        startGame();
    });

    playAgainBtn.addEventListener('click', startGame);

    // Initialize game when page loads
    startGame();
});