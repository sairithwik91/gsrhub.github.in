 let car = document.getElementById("car");
let left = 125;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft" && left > 0) {
    left -= 20;
  }
  if (event.key === "ArrowRight" && left < 250) {
    left += 20;
  }
  car.style.left = left + "px";
});