const road = document.getElementById("road");
const car = document.getElementById("car");
const scoreText = document.getElementById("score");
const engine = document.getElementById("engine");
const crash = document.getElementById("crash");

let carX = road.offsetWidth / 2 - 25;
let score = 0;
let speed = 4;
let gameOver = false;

engine.play();

// Keyboard (PC)
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") moveLeft();
  if (e.key === "ArrowRight") moveRight();
});

// Touch (Mobile)
document.getElementById("left").onclick = moveLeft;
document.getElementById("right").onclick = moveRight;

function moveLeft() {
  if (gameOver) return;
  carX -= 30;
  if (carX < 0) carX = 0;
  car.style.left = carX + "px";
}

function moveRight() {
  if (gameOver) return;
  carX += 30;
  if (carX > road.offsetWidth - 50)
    carX = road.offsetWidth - 50;
  car.style.left = carX + "px";
}

// Traffic
setInterval(() => {
  if (gameOver) return;

  let enemy = document.createElement("div");
  enemy.className = "enemy";
  enemy.style.left = Math.random() * (road.offsetWidth - 50) + "px";
  road.appendChild(enemy);

  let y = -100;
  let move = setInterval(() => {
    if (gameOver) return clearInterval(move);

    y += speed;
    enemy.style.top = y + "px";

    // Collision
    if (
      y > road.offsetHeight - 120 &&
      Math.abs(enemy.offsetLeft - carX) < 40
    ) {
      endGame();
    }

    if (y > road.offsetHeight) {
      score++;
      scoreText.innerText = score;
      enemy.remove();
      clearInterval(move);
    }
  }, 20);
}, 1200);

// End Game
function endGame() {
  gameOver = true;
  engine.pause();
  crash.play();
  alert("Game Over! Score: " + score);
  location.reload();
}
