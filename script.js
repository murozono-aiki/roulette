const maxNumber = 10;

const minInitialSpeed = 20;
const acceleration = -0.0001;  // rad/s/s


const pi = Math.PI;
const initialSpeedRange = Math.sqrt(-2 * acceleration * 2 * pi);

const rouletteElement = document.getElementById("roulette");
const arrowElement = document.getElementById("arrow");
const startButton = document.getElementById("start");

let initialRotate = 0;
let lastRotate = 0;
let initialRotateSpeed = 0;
let currentValue = 1;
let start = undefined;
let previousTimeStamp = 0;

{
    let conicGradient = "";
    for (let i = 1; i <= maxNumber; i++) {
        const rate = (i - 1) / maxNumber;
        const nextRate = i / maxNumber;
        conicGradient += `hsl(${2 * pi * rate}rad, 80%, 50%) ${2 * pi * rate}rad ${2 * pi * nextRate}rad`;
        if (i != maxNumber) conicGradient += ", ";
    }
    rouletteElement.style.background = "conic-gradient(" + conicGradient + ")";
}
arrowElement.style.transform = "translateY(50%)";

function rotateStep(timestamp) {
    if (start === undefined) {
        start = timestamp;
    }
    const elapsed = timestamp - start;
    let done = false;

    let currentRotate = initialRotate + Math.min(initialRotateSpeed * elapsed + (1 / 2) * acceleration * (elapsed ^ 2), -1 * (initialRotateSpeed ^ 2) / (2 * acceleration));
    if (currentRotate >= lastRotate) {
        currentRotate = lastRotate;
        done = true;
    }
    while (currentRotate >= 2 * pi) {
        currentRotate -= 2 * pi;
    }
    rouletteElement.style.transform = "rotate(${currentRotate}rad)";

    for (let i = 1; i <= maxNumber; i++) {
        if (2 * pi - currentRotate < 2 * pi * (i / maxNumber)) {
            currentValue = i;
            break;
        }
    }
    document.getElementById("value").textContent = currentValue;

    previousTimeStamp = timestamp;
    if (!done) {
        window.requestAnimationFrame(rotateStep);
    } else {
        start = undefined;
        initialRotate = currentRotate;
        startButton.disabled = false;
    }
}

startButton.addEventListener("click", event => {
    startButton.disabled = true;
    initialRotateSpeed = minInitialSpeed + (initialSpeedRange * Math.random());
    lastRotate = initialRotate + (-1 * (initialRotateSpeed ^ 2) / (2 * acceleration));
    window.requestAnimationFrame(rotateStep);
});
