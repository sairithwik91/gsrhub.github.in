const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const nitroText = document.getElementById("nitro");
const engineSound = document.getElementById("engine");
const crashSound = document.getElementById("crash");

let playerLeft = 125;
let score = 0;
let speed = 4;
let gameOver = false;
let nitro = 100;

// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = highScore;

// Move player
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft" && playerLeft > 0) playerLeft -= 25;
  if (e.key === "ArrowRight" && playerLeft < 250) playerLeft += 25;

  if (e.key.toLowerCase() === "n" && nitro > 0) {
    speed += 5;           // Nitro speed boost
    nitro -= 20;          // Reduce nitro
    if (nitro < 0) nitro = 0;
    setTimeout(() => speed -= 5, 500); // Nitro lasts 0.5s
  }

  player.style.left = playerLeft + "px";
  nitroText.innerText = nitro + "%";
});

// Lane lines animation
for (let i = 0; i < 10; i++) {
  let lane = document.createElement("div");
  lane.classList.add("lane");
  lane.style.top = i * 60 + "px";
  road.appendChild(lane);
}

setInterval(() => {
  document.querySelectorAll(".lane").forEach(lane => {
    let top = parseInt(lane.style.top);
    top += speed;
    if (top > 500) top = -50;
    lane.style.top = top + "px";
  });
}, 30);

// Traffic vehicles
function createTraffic() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  enemy.style.left = Math.floor(Math.random() * 6) * 50 + "px";
  road.appendChild(enemy);

  let enemyTop = -100;

  const moveEnemy = setInterval(() => {
    if (gameOver) {
      clearInterval(moveEnemy);
      return;
    }

    enemyTop += speed;
    enemy.style.top = enemyTop + "px";

    // Collision detection
    if (
      enemyTop > 330 &&
      enemyTop < 420 &&
      parseInt(enemy.style.left) === playerLeft
    ) {
      endGame();
    }

    // Passed enemy
    if (enemyTop > 500) {
      score++;
      scoreText.innerText = score;
      if (score % 5 === 0) speed += 0.5; // Increase difficulty
      enemy.remove();
      clearInterval(moveEnemy);
    }
  }, 20);
}

// End game
function endGame() {
  gameOver = true;
  engineSound.pause();
  crashSound.play();
  if (score > highScore) localStorage.setItem("highScore", score);

  setTimeout(() => {
    alert("💥 CRASH! Score: " + score);
    location.reload();
  }, 500);
}

// Generate traffic
setInterval(createTraffic, 1200);
