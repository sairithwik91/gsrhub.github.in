const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");
const nitroText = document.getElementById("nitro");
const engineSound = document.getElementById("engine");
const crashSound = document.getElementById("crash");
const bgMusic = document.getElementById("background");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");

let playerLeft = 125;
let score = 0;
let speed = 4;
let gameOver = false;
let nitro = 100;
let trafficInterval;
let laneInterval;

// Load high score
let highScore = localStorage.getItem("highScore") || 0;
highScoreText.innerText = highScore;

// Pause/Resume
pauseBtn.onclick = () => {
  gameOver = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
};
resumeBtn.onclick = () => {
  gameOver = false;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  moveTraffic();
  animateLane();
};

// Move player
document.addEventListener("keydown", (e) => {
  if (gameOver) return;

  if (e.key === "ArrowLeft" && playerLeft > 0) playerLeft -= 25;
  if (e.key === "ArrowRight" && playerLeft < 250) playerLeft += 25;

  if (e.key.toLowerCase() === "n" && nitro > 0) {
    speed += 5;
    nitro -= 20;
    if (nitro < 0) nitro = 0;
    setTimeout(() => speed -= 5, 500);
  }

  player.style.left = playerLeft + "px";
  nitroText.innerText = nitro + "%";
});

// Lane animation
function createLane() {
  for (let i = 0; i < 10; i++) {
    let lane = document.createElement("div");
    lane.classList.add("lane");
    lane.style.top = i * 60 + "px";
    road.appendChild(lane);
  }
}

function animateLane() {
  laneInterval = setInterval(() => {
    if (gameOver) return;
    document.querySelectorAll(".lane").forEach(lane => {
      let top = parseInt(lane.style.top);
      top += speed;
      if (top > 500) top = -50;
      lane.style.top = top + "px";
    });
  }, 30);
}

// Traffic vehicles
function createTrafficVehicle() {
  if (gameOver) return;

  const vehicle = document.createElement("div");
  vehicle.classList.add("enemy");

  // Random type: car, truck, bus
  let types = ["images/traffic-car.png", "images/truck.png", "images/bus.png"];
  let type = types[Math.floor(Math.random() * types.length)];
  vehicle.style.backgroundImage = `url(${type})`;

  vehicle.style.left = Math.floor(Math.random() * 6) * 50 + "px";
  road.appendChild(vehicle);

  let enemyTop = -100;

  const moveEnemy = setInterval(() => {
    if (gameOver) {
      clearInterval(moveEnemy);
      return;
    }

    enemyTop += speed;
    vehicle.style.top = enemyTop + "px";

    // Collision detection
    if (
      enemyTop > 330 &&
      enemyTop < 420 &&
      parseInt(vehicle.style.left) === playerLeft
    ) {
      endGame();
    }

    // Passed enemy
    if (enemyTop > 500) {
      score++;
      scoreText.innerText = score;
      if (score % 5 === 0) speed += 0.5;
      vehicle.remove();
      clearInterval(moveEnemy);
    }
  }, 20);
}

function moveTraffic() {
  trafficInterval = setInterval(createTrafficVehicle, 1200);
}

// End game
function endGame() {
  gameOver = true;
  engineSound.pause();
  bgMusic.pause();
  crashSound.play();

  if (score > highScore) localStorage.setItem("highScore", score);

  setTimeout(() => {
    alert("💥 CRASH! Score: " + score);
    location.reload();
  }, 500);
}

// Initialize game
createLane();
animateLane();
moveTraffic();
