const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const nitroText = document.getElementById("nitro");
const engineSound = document.getElementById("engine");
const crashSound = document.getElementById("crash");
const bgMusic = document.getElementById("background");

let roadWidth = road.offsetWidth;
let playerX = roadWidth / 2 - 25;
let score = 0;
let speed = 4;
let nitro = 100;
let gameOver = false;

let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = highScore;

// Resize support
window.onresize = () => {
  roadWidth = road.offsetWidth;
};

// KEYBOARD CONTROLS
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
  if (e.key === "n") useNitro();
});

// SWIPE CONTROLS
let startX = 0;
road.addEventListener("touchstart", e => {
  startX = e.touches[0].clientX;
});

road.addEventListener("touchend", e => {
  let endX = e.changedTouches[0].clientX;
  let diff = endX - startX;

  if (diff > 40) moveRight();
  if (diff < -40) moveLeft();
});

// TAP FOR NITRO
road.addEventListener("click", useNitro);

// MOVEMENT FUNCTIONS
function moveLeft() {
  if (gameOver) return;
  playerX -= 40;
  if (playerX < 0) playerX = 0;
  player.style.left = playerX + "px";
}

function moveRight() {
  if (gameOver) return;
  playerX += 40;
  if (playerX > roadWidth - 50) playerX = roadWidth - 50;
  player.style.left = playerX + "px";
}

function useNitro() {
  if (nitro <= 0 || gameOver) return;
  speed += 5;
  nitro -= 20;
  nitroText.innerText = nitro + "%";
  setTimeout(() => speed -= 5, 500);
}

// LANE LINES
for (let i = 0; i < 10; i++) {
  let lane = document.createElement("div");
  lane.className = "lane";
  lane.style.top = i * 60 + "px";
  road.appendChild(lane);
}

setInterval(() => {
  document.querySelectorAll(".lane").forEach(l => {
    let t = parseInt(l.style.top);
    t += speed;
    if (t > road.offsetHeight) t = -50;
    l.style.top = t + "px";
  });
}, 30);

// TRAFFIC
setInterval(() => {
  if (gameOver) return;

  let enemy = document.createElement("div");
  enemy.className = "enemy";
  let types = ["traffic-car.png","truck.png","bus.png"];
  enemy.style.backgroundImage =
    `url(images/${types[Math.floor(Math.random()*types.length)]})`;

  enemy.style.left = Math.floor(Math.random() * (roadWidth - 50)) + "px";
  road.appendChild(enemy);

  let y = -100;
  let move = setInterval(() => {
    if (gameOver) return clearInterval(move);

    y += speed;
    enemy.style.top = y + "px";

    if (
      y > road.offsetHeight - 120 &&
      Math.abs(parseInt(enemy.style.left) - playerX) < 40
    ) {
      endGame();
    }

    if (y > road.offsetHeight) {
      score++;
      scoreText.innerText = score;
      if (score % 5 === 0) speed += 0.5;
      enemy.remove();
      clearInterval(move);
    }
  }, 20);
}, 1200);

// GAME OVER
function endGame() {
  gameOver = true;
  engineSound.pause();
  bgMusic.pause();
  crashSound.play();

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }

  setTimeout(() => {
    alert("💥 GAME OVER\nScore: " + score);
    location.reload();
  }, 500);
}
