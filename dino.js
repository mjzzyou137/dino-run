import {
  incrementCustomProperty,
  setCustomProperty,
  getCustomProperty,
} from "./updateCustomProperty.js";

const dinoElem = document.querySelector("[data-dino]");
const JUMP_SPEED = 0.45;
const GRAVITY = 0.0015;
const DINO_FRAME_COUNT = 4;
const FRAME_TIME = 200;
const JUMP_FORWARD_SPEED = 0.025;
const RETURN_SPEED = 0.02;

let isJumping;
let dinoFrame;
let currentFrameTime;
let yVelocity;
let xPosition;
let isReturning;
export function setupDino() {
  isJumping = false;
  isReturning = false;
  dinoFrame = 0;
  currentFrameTime = 0;
  yVelocity = 0;
  xPosition = 10;
  setCustomProperty(dinoElem, "--bottom", 0);
  setCustomProperty(dinoElem, "--left", xPosition);

  document.removeEventListener("keydown", onJump);
  document.removeEventListener("click", onJump);
  document.removeEventListener("touchstart", onJump);
  
  document.addEventListener("keydown", onJump);
  document.addEventListener("click", onJump);
  document.addEventListener("touchstart", onJump, { passive: true });
}

export function updateDino(delta, speedScale) {
  handleRun(delta, speedScale);
  handleJump(delta);
}

export function getDinoRect() {
  return dinoElem.getBoundingClientRect();
}

export function setDinoLose() {
  dinoElem.src = "imgs3/dino-lose.png";
}

function handleRun(delta, speedScale) {
  if (isJumping) {
    dinoElem.src = `imgs3/dino-stationary.png`;
    xPosition += JUMP_FORWARD_SPEED * delta * speedScale;
    setCustomProperty(dinoElem, "--left", xPosition);
    return;
  }

  if (xPosition > 10) {
    isReturning = true;
    xPosition = Math.max(10, xPosition - RETURN_SPEED * delta * speedScale);
    setCustomProperty(dinoElem, "--left", xPosition);
  } else {
    isReturning = false;
  }

  if (currentFrameTime >= FRAME_TIME) {
    dinoFrame = (dinoFrame + 1) % DINO_FRAME_COUNT;
    dinoElem.src = `imgs3/dino-run-${dinoFrame}.png`;
    currentFrameTime -= FRAME_TIME;
  }
  currentFrameTime += delta * speedScale;
}

function handleJump(delta) {
  if (!isJumping) return;

  incrementCustomProperty(dinoElem, "--bottom", yVelocity * delta);

  if (getCustomProperty(dinoElem, "--bottom") <= 0) {
    setCustomProperty(dinoElem, "--bottom", 0);
    isJumping = false;
  }

  yVelocity -= GRAVITY * delta;
}

function onJump(e) {
  e.preventDefault();
  
  if (isJumping) return;
  if (e.type === "keydown" && e.code !== "Space") return;
  
  yVelocity = JUMP_SPEED;
  isJumping = true;
}
