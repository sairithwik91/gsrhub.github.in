const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

let playerLeft = 125;
let score = 0;
let speed = 4;
let gameOver = false;

// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = highScore;

// Move race car
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && playerLeft > 0) {
    playerLeft -= 25;
  }
  if (e.key === "ArrowRight" && playerLeft < 250) {
    playerLeft += 25;
  }
  player.style.left = playerLeft + "px";
});

// Create traffic vehicles endlessly
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

    // Passed vehicle = score increase forever
    if (enemyTop > 500) {
      score++;
      scoreText.innerText = score;

      // Increase difficulty slowly
      if (score % 5 === 0) {
        speed += 0.5;
      }

      enemy.remove();
      clearInterval(moveEnemy);
    }
  }, 20);
}

// End game (only crash ends game)
function endGame() {
  gameOver = true;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
  }

  setTimeout(() => {
    alert("💥 GAME OVER!\nScore: " + score);
    location.reload();
  }, 100);
}

// Generate traffic forever
setInterval(createTraffic, 1200);
