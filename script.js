const gameArea = document.getElementById('gameArea');
const playerCar = document.getElementById('playerCar');
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const highScoreDisplay = document.getElementById('highScoreDisplay');

const crashSound = document.getElementById('crashSound');
const pointSound = document.getElementById('pointSound');

let keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false };
let score = 0;
let speed = 5;
let gameActive = false;
let enemies = [];
let roadLines = [];

const highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.innerText = `High Score: ${highScore}`;

startBtn.addEventListener('click', startGame);

// Mobile Controls
document.getElementById('leftBtn').addEventListener('touchstart', () => keys.ArrowLeft = true);
document.getElementById('leftBtn').addEventListener('touchend', () => keys.ArrowLeft = false);

document.getElementById('rightBtn').addEventListener('touchstart', () => keys.ArrowRight = true);
document.getElementById('rightBtn').addEventListener('touchend', () => keys.ArrowRight = false);

document.getElementById('upBtn').addEventListener('touchstart', () => keys.ArrowUp = true);
document.getElementById('upBtn').addEventListener('touchend', () => keys.ArrowUp = false);

document.getElementById('downBtn').addEventListener('touchstart', () => keys.ArrowDown = true);
document.getElementById('downBtn').addEventListener('touchend', () => keys.ArrowDown = false);

function startGame() {
    gameArea.innerHTML = '<div id="playerCar" class="car"></div>';
    playerCar.style.left = '175px';
    playerCar.style.top = '500px';
    score = 0;
    speed = 5;
    enemies = [];
    roadLines = [];
    gameActive = true;

    for (let i = 0; i < 8; i++) {
        const line = document.createElement('div');
        line.classList.add('roadLine');
        line.style.top = `${i * 100}px`;
        gameArea.appendChild(line);
        roadLines.push(line);
    }

    setInterval(() => {
        if (gameActive) createEnemy();
    }, 1500);

    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
    if (keys[e.key] !== undefined) keys[e.key] = true;
});

document.addEventListener('keyup', e => {
    if (keys[e.key] !== undefined) keys[e.key] = false;
});

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = `${Math.floor(Math.random() * 350)}px`;
    enemy.style.top = '-120px';
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

function moveRoadLines() {
    roadLines.forEach(line => {
        let y = parseInt(line.style.top);
        y += speed;
        if (y > 600) y = -80;
        line.style.top = `${y}px`;
    });
}

function moveEnemies() {
    enemies.forEach((enemy, idx) => {
        let y = parseInt(enemy.style.top);
        y += speed;
        enemy.style.top = `${y}px`;

        if (y > 650) {
            enemy.remove();
            enemies.splice(idx, 1);
            score += 10;
            pointSound.play();
        }

        if (detectCollision(playerCar, enemy)) {
            endGame();
        }
    });
}

function detectCollision(a, b) {
    const rectA = a.getBoundingClientRect();
    const rectB = b.getBoundingClientRect();
    return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
    );
}

function endGame() {
    crashSound.play();
    gameActive = false;
    alert(`Game Over!\nYour Score: ${score}`);
    if (score > highScore) {
        localStorage.setItem('highScore', score);
        highScoreDisplay.innerText = `High Score: ${score}`;
    }
    startBtn.innerText = 'Restart Game';
}

function gameLoop() {
    if (!gameActive) return;

    // Move road
    moveRoadLines();
    moveEnemies();

    // Player movement
    let left = parseInt(playerCar.style.left);
    let topPos = parseInt(playerCar.style.top);

    if (keys.ArrowLeft && left > 0) playerCar.style.left = `${left - speed}px`;
    if (keys.ArrowRight && left < 350) playerCar.style.left = `${left + speed}px`;
    if (keys.ArrowUp && topPos > 0) playerCar.style.top = `${topPos - speed}px`;
    if (keys.ArrowDown && topPos < 500) playerCar.style.top = `${topPos + speed}px`;

    scoreDisplay.innerText = `Score: ${score}`;

    // Increase speed every 500 points
    if (score > 0 && score % 500 === 0) speed = Math.min(speed + 1, 12);

    requestAnimationFrame(gameLoop);
}
