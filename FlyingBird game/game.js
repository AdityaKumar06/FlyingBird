const gameContainer = document.getElementById('game-container');
const bird = document.getElementById('bird');
const crash = document.getElementById('crash');
const gameOverEl = document.getElementById('game-over');
const restartBtn = document.getElementById('restart-btn');
const scoreboard = document.getElementById('scoreboard');
const finalScoreEl = document.getElementById('final-score');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const startDialog = document.getElementById('start-dialog');
const startBtn = document.getElementById('start-btn');

let birdY = window.innerHeight / 2;
const gravity = 0.6;
const jump = -10;
let isGameOver = false;
let isPaused = false;
let score = 0;
let fallingSpeed = 0;      // Initial falling speed
let gameLoopInterval;
let scoreInterval;

function startGame() {
    startDialog.style.display = 'none';                      // Hide the start dialog
    document.addEventListener('keydown', controlBird);
    gameLoopInterval = setInterval(gameLoop, 20);
    scoreInterval = setInterval(updateScore, 100);
    createObstacle(true);
}

function controlBird(event) {
    if (event.code === 'Space' || event.code === 'ArrowUp') {
        birdY += jump;
        fallingSpeed = 0;                          // Reset falling speed when jumping
    } else if (event.code === 'ArrowDown') {
        birdY += gravity * 10;
        fallingSpeed = 0;                             // Reset falling speed when descending
    }
}

function gameLoop() {
    if (isGameOver || isPaused) return;

    if (birdY < window.innerHeight) {
        // Apply gravity if bird is above the ground
        birdY += gravity + fallingSpeed;
    } else {
        // Bird hits the ground, stop falling
        fallingSpeed = 0;
    }

    bird.style.top = `${birdY}px`;

    // Increase falling speed gradually
    fallingSpeed += 0.1;

    const birdRect = bird.getBoundingClientRect();
    const obstacles = document.querySelectorAll('.obstacle');

    obstacles.forEach(obstacle => {
        const obstacleRect = obstacle.getBoundingClientRect();

        if (
            birdRect.left < obstacleRect.right &&
            birdRect.right > obstacleRect.left &&
            birdRect.top < obstacleRect.bottom &&
            birdRect.bottom > obstacleRect.top
        ) {
            bird.style.display = 'none';
            crash.style.display = 'block';
            crash.style.top = `${birdY - 50}px`;    // Adjust position as needed
            crash.style.left = `${(obstacleRect.left + obstacleRect.right) / 2}px`;      // Center boom image
            gameOver();
        }

        // Check if the obstacle has passed the bird and increment the score
        if (obstacleRect.right < birdRect.left && !obstacle.passed) {
            obstacle.passed = true;
            score++;
            updateScore();
        }

        // Remove obstacle if it goes off screen
        if (obstacleRect.right <= 0) {
            obstacle.remove();
        }
    });

    if (birdY > window.innerHeight || birdY < 0) {
        bird.style.display = 'none';
        crash.style.display = 'block';
        crash.style.top = `${birdY - 50}px`;           // Adjust position as needed
        crash.style.left = `${(birdRect.left + birdRect.right) / 2}px`;            // Center boom image
        gameOver();
    }
}

function createObstacle(isTopSmall) {
    if (isGameOver || isPaused) return;

    // Create bottom obstacle
    const bottomObstacle = document.createElement('div');
    bottomObstacle.classList.add('obstacle');
    bottomObstacle.style.height = `${isTopSmall ? 200 + Math.random() * 150 : 100 + Math.random() * 50}px`;       // Increased height
    bottomObstacle.style.bottom = '0px';
    bottomObstacle.style.right = '0px';
    gameContainer.appendChild(bottomObstacle);

    // Create top obstacle
    const topObstacle = document.createElement('div');
    topObstacle.classList.add('obstacle');
    topObstacle.style.height = `${isTopSmall ? 50 + Math.random() * 50 : 200 + Math.random() * 150}px`;    // Decreased height
    topObstacle.style.top = '0px';
    topObstacle.style.right = '0px';
    gameContainer.appendChild(topObstacle);

    setTimeout(() => createObstacle(!isTopSmall), 1000);          // Decreased interval
}

function updateScore() {
    scoreboard.textContent = `Score: ${score}`;
}

function gameOver() {
    isGameOver = true;
    clearInterval(gameLoopInterval);
    clearInterval(scoreInterval);
    gameOverEl.style.display = 'block';
    finalScoreEl.textContent = `Final Score: ${score}`;
    document.removeEventListener('keydown', controlBird);

    // Stop all obstacle animations
    const obstacles = document.querySelectorAll('.obstacle');
    obstacles.forEach(obstacle => {
        obstacle.style.animationPlayState = 'paused';
    });
}

function restartGame() {
    window.location.reload();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        playBtn.style.display = 'block';
        pauseBtn.style.display = 'none';
        clearInterval(gameLoopInterval);
        clearInterval(scoreInterval);
        document.removeEventListener('keydown', controlBird);

        // Pause all obstacle animations
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            obstacle.style.animationPlayState = 'paused';
        });
    } else {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        gameLoopInterval = setInterval(gameLoop, 20);
        scoreInterval = setInterval(updateScore, 100);
        document.addEventListener('keydown', controlBird);

        // Resume all obstacle animations
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach(obstacle => {
            obstacle.style.animationPlayState = 'running';
        });
    }
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
playBtn.addEventListener('click', togglePause);
pauseBtn.addEventListener('click', togglePause);
