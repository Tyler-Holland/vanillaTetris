import './style.css'

import * as logic from './js/logic.js';
import * as render from './js/graphics.js';
import * as helper from './js/helpers.js';
import * as boardState from './gameData/boardState.js';
import * as gameState from './gameData/gameState.js';
import * as defaults from './gameData/defaults.js';
import * as sfx from './audio/audioManager.js';

const rAF = window.requestAnimationFrame;
let gameIsRunning = false;
let appHasFocus = true;


function handleGameplayKeybinds(input) {
  const isGameOver = gameState.getOne('isGameOver');

  if (isGameOver) return; // Ignore all keypresses if the game is over

  const inputIsRotate = input === "rotateRight"
    || input === "rotateLeft";

  if (inputIsRotate && !rotationIsAllowed) return;

  if (input === "pause") {
    helper.togglePause();
    gameplayInputs[input] = false;
  }

  const isGamePaused = gameState.getOne('isGamePaused');
  // Causes movement keys pressed while the game is paused to be ignored
  if (isGamePaused && input !== "pause") return;

  // Skips checking movement delay if the move is forced by gravity
  if (!forcedMove) {
    const inputIsHorizontal = input === "moveRight"
      || input === "moveLeft";
    const inputIsVertical = input === "moveDown";

    const allowHorizontalRepeat = timeSinceHorizontalRepeat >= inputRepeatDelay;
    const allowVerticalRepeat = timeSinceVerticalRepeat >= inputRepeatDelay;

    if (inputIsHorizontal) {
      if (!allowHorizontalRepeat) return;
      timeSinceHorizontalRepeat = 0;
    }

    if (inputIsVertical) {
      if (!allowVerticalRepeat) return;
      timeSinceVerticalRepeat = 0;
      gameState.resetTimeSinceLastMoveDown();
    }
  }

  const pieceCanBeHeld = gameState.getOne('pieceCanBeHeld');
  if (input === "holdPiece" && pieceCanBeHeld) {
    helper.storeHeldPiece();
    render.heldPieces();
    return;
  }

  if (input === "dropPiece" && pieceCanBeDropped) {
    helper.dropPiece();
    sfx.playHardDrop();
  }

  // Returns 'undefined' if the move isn't valid
  const newPosition = logic.handlePieceMovement(input);


  if (!!!newPosition) return; // Exits function if 'newPosition' is undefined

  if (input === "moveLeft" || input === "moveRight" || input === "moveDown") {
    sfx.playMove();
  }

  if (input === "rotateRight" || input === "rotateLeft") {
    sfx.playRotate();
  }
  const currentPosition = gameState.getOne('currentPosition');
  gameState.setOne('previousPosition', currentPosition);
  gameState.setOne('currentPosition', newPosition);
  gameState.setShadowPosition();

  if (input !== "rotateRight" && input !== "rotateLeft") {
    gameState.setPieceCenter();
  }

  boardState.update();
  render.entirePlayArea();
}

function goToWindow(targetId) {
  const listOfWindowIds = ["mainMenu", "gameOverlay", "game", "playAreaMaster"];

  for (const windowId of listOfWindowIds) {
    const targetElem = document.getElementById(windowId);
    if (windowId === targetId) {
      render.showElement(targetElem);
      if (targetId === "mainMenu") gameIsRunning = false;
    } else {
      render.hideElement(targetElem);
    }
  }
}
function startNewGame() {
  resetTimers();
  helper.setupNewGame();
  render.game();

  gameState.giveFocus();
  goToWindow("game");

  gameIsRunning = true;
  rAF(gameLoop);
}

const menuButtons = document.querySelectorAll('[data-goto]');
menuButtons.forEach(button => {
  const menu = button.dataset.goto;

  button.addEventListener('click', () => {
    goToWindow(menu);
  });
});

const newGameButtons = document.querySelectorAll('[data-start-new-game');
newGameButtons.forEach(button => {
  button.addEventListener('click', () => {
    startNewGame();
    gameplayInputs = {};
  });
});

const resumeGameBtn = document.getElementById('resumeGameBtn');
resumeGameBtn.addEventListener('click', resumeGame);

function resumeGame() {
  helper.togglePause();
  rAF(gameLoop);
}

window.addEventListener('click', (e) => {
  const gameShouldHaveFocus = !!e.target.closest('#tetrisMaster') === true;
  gameState.setFocus(gameShouldHaveFocus);

  if (gameIsRunning && !gameShouldHaveFocus) {
    helper.pauseGame();
    appHasFocus = false;
  } else {
    appHasFocus = true;
  }
});

let gameplayInputs = {};
let pausePressed = false;

onkeydown = onkeyup = (e) => {
  if (!appHasFocus) return;

  const keyCode = e.code;

  const isGameOver = gameState.getOne('isGameOver');
  if (!isGameOver) {
    const gameplayKeybinds = defaults.keybinds;

    for (const action in gameplayKeybinds) {
      if (gameplayKeybinds[action].includes(keyCode)) {
        const isKeydown = e.type === 'keydown';
        gameplayInputs[action] = e.type === 'keydown';

        if (action === 'pause'
          && isKeydown
          && pausePressed === false) {
          pausePressed = true;
          helper.pauseGame();
        } else if (action === 'pause'
          && !isKeydown) {
          pausePressed = false;
        }

        break; // Exit loop after finding the action the input is bound to
      }
    }
  }
}

let rotationIsAllowed = true;
let pieceCanBeDropped = true;
function handleGameplayInputs() {
  for (const input in gameplayInputs) {
    const inputIsRotate = input === "rotateRight"
      || input === "rotateLeft";
    const inputIsDropPiece = input === "dropPiece";

    if (gameplayInputs[input]) {
      handleGameplayKeybinds(input);

      if (inputIsDropPiece) pieceCanBeDropped = false;
      if (inputIsRotate) rotationIsAllowed = false;
    } else {
      if (inputIsDropPiece) pieceCanBeDropped = true;

      // If no rotation keys are pressed, allow rotation to happen again
      if (inputIsRotate
        && !gameplayInputs['rotateRight']
        && !gameplayInputs['rotateLeft']) rotationIsAllowed = true;
    }
  }
};

function resetTimers() {
  timeSinceHorizontalRepeat = 0;
  timeSinceVerticalRepeat = 0;
  gameState.resetTimeSinceLastMoveDown();
  start = undefined;
}

let start;
const inputRepeatDelay = 75;
let timeSinceHorizontalRepeat = 0;
let timeSinceVerticalRepeat = 0;
let forcedMove = false;

function gameLoop(timeStamp) {
  if (start === undefined || timeStamp - start > 200) start = timeStamp;

  const elapsed = timeStamp - start;
  timeSinceHorizontalRepeat += elapsed;
  timeSinceVerticalRepeat += elapsed;
  gameState.addTo('timeSinceLastMoveDown', elapsed);
  start = timeStamp;

  const stopGameLoop = helper.isGamePaused()
    || helper.isGameOver()
    || !helper.gameHasFocus();

  if (stopGameLoop) return;

  handleGameplayInputs();

  const timeSinceLastMoveDown = gameState.getOne('timeSinceLastMoveDown');
  const gravitySpeed = gameState.getOne('gravitySpeed');
  if (timeSinceLastMoveDown >= gravitySpeed) {
    forcedMove = true;
    handleGameplayKeybinds("moveDown");
    gameState.resetTimeSinceLastMoveDown();
    forcedMove = false;
  }

  rAF(gameLoop);
}
