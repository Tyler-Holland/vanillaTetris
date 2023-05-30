import * as helper from '../js/helpers.js';
import { tetrominoes } from './tetrominoes.js';
import * as defaults from './defaults.js';
import * as logic from '../js/logic.js';

let gameState = {
    currentPiece: "",
    currentPosition: [],
    currentCenter: [],
    reasonForBoardUpdate: undefined,
    previousPiece: "",
    previousPosition: [],
    shadowCurrentPosition: [],
    shadowPreviousPosition: [],
    pieceCanBeHeld: true,
    gravitySpeed: 1000, // Time in milliseconds
    gravityTimer: 0, // Tracks how long since a piece moved downward
    level: 1,        // ╵━> Is reset when a player moves manually
    score: 0,
    linesCleared: 0,
    isGamePaused: false,
    hasFocus: true,
    isGameOver: false,
    isTetrisB2B: false,
    upcomingPieces: [], // Example: ["T", "I", "J"]
    heldPieces: [], // Example: ["T"]
    turnsSinceTetris: 0,
    timeSinceLastMoveDown: 0
};

export function reset() {
    gameState = helper.copyObject(defaults.gameState);

    for (let i = 0; i < 3; i++) {
        addUpcomingPiece();
    }
}

export function resetTimeSinceLastMoveDown() {
    gameState.timeSinceLastMoveDown = 0;
}

export function get() {
    const gameStateCopy = helper.copyObject(gameState);
    return gameStateCopy;
}

export function getOne(key) {
    return gameState[key];
}

export function set(newState) {
    let pieceMovedSideways = false;

    for (let i = 0; i < 4; i++) {
        if (gameState.currentPosition[i][0] !== newState.currentPosition[i][0]) {
            pieceMovedSideways = true;
        }
    }

    gameState = newState;

    if (pieceMovedSideways) {
        setShadowPosition();
    }
}

export function setOne(key, value) {
    gameState[key] = value;
}

export function addTo(key, value) {
    const typeOfKeyValue = Object.prototype.toString.call(gameState[key])
        .slice(8, -1);

    if (typeOfKeyValue === 'Number') {
        gameState[key] += value;
    } else if (typeOfKeyValue === 'Array') {
        gameState[key].push(value);
    }
}

export function useHeldPiece() {
    const heldPiece = gameState.heldPieces.shift();

    gameState.currentPiece = heldPiece;

    setPositionForSpawnedPiece();
}

export function getIsGameOver() {
    return gameState.isGameOver;
}

export function togglePause() {
    gameState.isGamePaused = !gameState.isGamePaused;
}

export function giveFocus() {
    gameState.hasFocus = true;
}

export function loseFocus() {
    gameState.hasFocus = false;
}

export function setFocus(bool) {
    gameState.hasFocus = bool;
}

export function endGame() {
    gameState.isGameOver = true;
}

export function addUpcomingPiece() {
    const newPiece = helper.getNewPiece();
    gameState.upcomingPieces.push(newPiece);    
}

export function spawnNewPiece() {
    const upcomingPiece = gameState.upcomingPieces.shift();

    if (upcomingPiece) {
        gameState.currentPiece = upcomingPiece;
        addUpcomingPiece();
    } else {
        gameState.currentPiece = helper.getNewPiece();
    }

    setPositionForSpawnedPiece();
}

export function spawnHeldPiece() {
    gameState.currentPiece = gameState.heldPieces.shift();
    setPositionForSpawnedPiece();
}

function setPositionForSpawnedPiece() {
    const gameOptions = defaults.gameOptions;
    const piece = gameState.currentPiece;
    const pieceHalfWidth = tetrominoes[piece].width / 2;
    const spawnOffset = Math.floor(gameOptions.spawnOffset - pieceHalfWidth);

    const spawnPosition = [];

    for (const coordPair of tetrominoes[piece].shape) {
        const x = coordPair[0] + spawnOffset;
        let y = coordPair[1];

        if (piece === "I") y += 1;

        spawnPosition.push([x, y]);
    };

    const newCurrentCenter = helper.copyObject(tetrominoes[piece].center);
    newCurrentCenter[0] += spawnOffset;
    if (piece === "I") newCurrentCenter[1] += 1;
    setOne('currentCenter', newCurrentCenter);
    setOne('currentPosition', spawnPosition);
    setOne('previousPosition', spawnPosition);


    // console.log(gameState.currentCenter);
    // gameState.currentCenter = [...tetrominoes[piece].center];
    // console.log(gameState.currentCenter);
    // gameState.currentCenter[0] += spawnOffset;
    // if (piece === "I") y += 1;
    // gameState.currentPosition = spawnPosition;
    // gameState.previousPosition = spawnPosition;
   
    setShadowPosition();
}

export function setShadowPosition() {
    gameState.shadowCurrentPosition = logic.getShadowPosition();
}

export function setPieceCenter() {
    const previousPosition = gameState.previousPosition;
    const currentPosition = gameState.currentPosition;
    const offsetX = (previousPosition[0][0] - currentPosition[0][0]) * -1;
    const offsetY = (previousPosition[0][1] - currentPosition[0][1]) * -1;
    const currentCenterX = gameState.currentCenter[0] + offsetX;
    const currentCenterY = gameState.currentCenter[1] + offsetY;

    gameState.currentCenter = [currentCenterX, currentCenterY];
}

