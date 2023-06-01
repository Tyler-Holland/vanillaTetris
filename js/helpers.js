import { tetrominoes } from '../gameData/tetrominoes.js';
import * as render from './graphics.js';
import * as logic from './logic.js';
import * as bsl from '../gameData/boardStateLegend.js';
import * as boardState from '../gameData/boardState.js';
import * as gameState from '../gameData/gameState.js';
import * as defaults from '../gameData/defaults.js';
import * as sfx from './audioManager.js';

export function setupNewGame() {
    sfx.resetTheme();
    gameState.reset();
    boardState.reset();
    gameState.spawnNewPiece();
    boardState.update();
    sfx.playTheme();
}

// Returns the name of the piece as a string
export function getNewPiece() {
    const pieces = Object.keys(tetrominoes);
    const chosenPiece = pieces[Math.floor(Math.random() * pieces.length)];
    return chosenPiece;
}

export function handleFullLines() {
    const boardStateCopy = boardState.get();
    const gameOptions = defaults.gameOptions;
    let fullLines = [];

    boardStateCopy.forEach((row, idx) => {
        const rowIsFull = row.every(block => {
            return block !== bsl.empty
        });

        if (rowIsFull) fullLines.push(idx);
    });

    const linesCleared = fullLines.length;
    if (linesCleared === 0) return;

    if (linesCleared === 4) {
        sfx.playTetrisClear();
    } else {
        sfx.playLineClear();
    }

    fullLines.forEach(rowIdx => {
        boardStateCopy.splice(rowIdx, 1);
        boardStateCopy.unshift(new Array(gameOptions.playAreaX).fill(bsl.empty));
    });

    updateGameInfo(linesCleared);
    render.gameInfoWindow();

    boardState.set(boardStateCopy);
    render.entirePlayArea();

    setGravity();
}

function updateGameInfo(linesCleared) {
    gameState.addTo('linesCleared', linesCleared);

    let pointsEarned = 0;

    if (linesCleared === 1) {
        pointsEarned = 100;
    } else if (linesCleared === 2) {
        pointsEarned = 300;
    } else if (linesCleared === 3) {
        pointsEarned = 500;
    } else if (linesCleared === 4) {
        const turnsSinceTetris = gameState.getOne('turnsSinceTetris');

        if (turnsSinceTetris <= 1) {
            pointsEarned = 1200;
        } else {
            pointsEarned = 800;
        }

        gameState.setOne('turnsSinceTetris', 0);
    }
    gameState.addTo('score', pointsEarned);

    const totalLinesCleared = gameState.getOne('linesCleared');
    const currentLevel = Math.floor(totalLinesCleared / 10) + 1;

    gameState.setOne('level', currentLevel);
}

export function dropPiece() {
    const currentPosition = gameState.getOne('currentPosition');
    currentPosition.forEach(coordPair => {
        const x = coordPair[0];
        const y = coordPair[1];

        boardState.setCoordinateToEmpty(x, y);
    });

    const shadowPosition = gameState.getOne('shadowCurrentPosition');
    shadowPosition.forEach(coordPair => {
        const x = coordPair[0];
        const y = coordPair[1];

        boardState.setCoordinateToCurrentPiece(x, y);
    });

    handleFailedMoveDown();
}

export function storeHeldPiece() {
    gameState.setOne('pieceCanBeHeld', false);
    const currentlyStoredPiece = gameState.getOne('heldPieces')[0];
    const currentPiece = gameState.getOne('currentPiece');
    gameState.addTo('heldPieces', currentPiece);

    if (currentlyStoredPiece) {
        gameState.useHeldPiece();
    } else {
        gameState.spawnNewPiece();
    }

    sfx.playHold();
    boardState.update();
    render.entirePlayArea();
    render.upcomingPieces();
}

export function handleFailedMoveDown() {
    gameState.setOne('pieceCanBeHeld', true);
    boardState.lockPiece();
    sfx.playLockPiece();
    handleFullLines();
    gameState.addTo('turnsSinceTetris', 1);
    gameState.spawnNewPiece();
    gameState.resetTimeSinceLastMoveDown();
    if (!logic.doesSpawnCauseCollision()) endGame();
    boardState.update();
    render.entirePlayArea();
    render.upcomingPieces();
}

function setGravity() {
    const level = gameState.getOne('level');
    const gravityInSeconds = Math.pow((0.8 - ((level - 1) * 0.007)), (level - 1));
    const gravityInMilliseconds = Math.round(gravityInSeconds * 1000);
    gameState.setOne('gravitySpeed', gravityInMilliseconds);
}

export function copyObject(obj) {
    const objCopy = JSON.parse(JSON.stringify(obj));
    return objCopy;
}

export function togglePause() {
    gameState.togglePause();

    const isGamePaused = gameState.getOne('isGamePaused');

    if (isGamePaused) {
        render.showGameOverlay();
        render.showShadowOverlay();
        sfx.pauseTheme();
    } else {
        render.hideGameOverlay();
        render.hideShadowOverlay();
        sfx.playTheme();
    }
}

export function pauseGame() {
    render.showShadowOverlay();
    sfx.pauseTheme();
    gameState.togglePause();
    render.showGameOverlay();
}

export function endGame() {
    gameState.endGame();
    sfx.pauseTheme();
    sfx.playGameOver();
    render.setGameOverlayToGameOver();
    render.toggleGameOverlay();
    render.showShadowOverlay();
}

export function isGamePaused() {
    const isGamePaused = gameState.getOne("isGamePaused");
    return isGamePaused;
}

export function isGameOver() {
    const isGameOver = gameState.getOne("isGameOver");
    return isGameOver;
}

export function gameHasFocus() {
    const gameHasFocus = gameState.getOne("hasFocus");
    return gameHasFocus;
}