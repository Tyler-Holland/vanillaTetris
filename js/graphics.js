import { tetrominoes } from '../gameData/tetrominoes.js';
import * as bsl from '../gameData/boardStateLegend.js';
import * as boardState from '../gameData/boardState.js';
import * as defaults from '../gameData/defaults.js';
import * as gameState from '../gameData/gameState.js';

export function game() {
    gridOverlay();
    entirePlayArea();
    upcomingPieces();
    heldPieces();
    gameInfoWindow();
    setGameOverlayToPauseMenu();
    hideShadowOverlay();
}

export function upcomingPieces() {
    const gameOptions = defaults.gameOptions;
    const upcomingPieces = gameState.getOne('upcomingPieces');
    const upcomingPiecesDiv = document.getElementById('upcomingPiecesDisplay');
    upcomingPiecesDiv.innerHTML = '';

    for (const piece of upcomingPieces) {
        const div = document.createElement('div');
        const canvasElem = document.createElement('canvas');
        const ctx = canvasElem.getContext('2d');
        const pieceWidth = tetrominoes[piece].width;
        const pieceHeight = tetrominoes[piece].height;
        const blockSize = gameOptions.blockSize;

        ctx.canvas.width = blockSize * pieceWidth + 4;
        ctx.canvas.height = blockSize * pieceHeight + 4;
        ctx.fillStyle = tetrominoes[piece].color;
        ctx.strokeStyle = gameOptions.gridColor;

        for (const coordPair of tetrominoes[piece].shape) {
            const x = coordPair[0];
            const y = coordPair[1];

            ctx.fillRect((blockSize * x + 2), (blockSize * y + 2), blockSize, blockSize);
            ctx.strokeRect((blockSize * x + 2), (blockSize * y + 2), blockSize, blockSize);
        }

        div.append(canvasElem);
        upcomingPiecesDiv.append(canvasElem);
    }
}

export function heldPieces() {
    const gameStateCopy = gameState.get();
    const gameOptions = defaults.gameOptions;
    const heldPieces = gameStateCopy.heldPieces;
    const heldPiecesDiv = document.getElementById('heldPiecesDisplay');
    heldPiecesDiv.innerHTML = '';

    for (const piece of heldPieces) {
        const div = document.createElement('div');
        const canvasElem = document.createElement('canvas');
        const ctx = canvasElem.getContext('2d');
        const pieceWidth = tetrominoes[piece].width;
        const pieceHeight = tetrominoes[piece].height;
        const blockSize = gameOptions.blockSize;

        ctx.canvas.width = blockSize * pieceWidth + 4;
        ctx.canvas.height = blockSize * pieceHeight + 4;
        ctx.fillStyle = tetrominoes[piece].color;
        ctx.strokeStyle = gameOptions.gridColor;

        for (const coordPair of tetrominoes[piece].shape) {
            const x = coordPair[0];
            const y = coordPair[1];

            ctx.fillRect((blockSize * x + 2), (blockSize * y + 2), blockSize, blockSize);
            ctx.strokeRect((blockSize * x + 2), (blockSize * y + 2), blockSize, blockSize);
        }

        div.append(canvasElem);
        heldPiecesDiv.append(canvasElem);
    }
}

export function gridOverlay() {
    const gameOptions = defaults.gameOptions;
    const playAreaY = gameOptions.playAreaY;
    const playAreaX = gameOptions.playAreaX;
    const blockSize = gameOptions.blockSize;

    const gridOverlay = document.getElementById('gridOverlay');
    const ctx = gridOverlay.getContext('2d');
    ctx.canvas.width = blockSize * playAreaX;
    ctx.canvas.height = blockSize * playAreaY;
    ctx.strokeStyle = gameOptions.gridColor;

    for (let y = 0; y < playAreaY; y++) {
        for (let x = 0; x < playAreaX; x++) {
            ctx.strokeRect((blockSize * x), (blockSize * y), blockSize, blockSize);
        }
    }
}

export function entirePlayArea() {
    const gameOptions = defaults.gameOptions;
    const boardStateCopy = boardState.get();
    const gameStateCopy = gameState.get();
    const playAreaY = gameOptions.playAreaY;
    const playAreaX = gameOptions.playAreaX;
    const blockSize = gameOptions.blockSize;

    const playArea = document.getElementById('playArea');
    const ctx = playArea.getContext("2d");
    ctx.canvas.width = blockSize * playAreaX;
    ctx.canvas.height = blockSize * playAreaY;

    for (let y = 0; y < playAreaY; y++) {
        for (let x = 0; x < playAreaX; x++) {
            if (boardStateCopy[y][x] === bsl.empty) {
                ctx.fillStyle = gameOptions.backgroundColor;
            } else if (boardStateCopy[y][x] === bsl.active) {
                ctx.fillStyle = tetrominoes[gameStateCopy.currentPiece].color;
            } else if (boardStateCopy[y][x] === bsl.shadow) {
                ctx.fillStyle = gameOptions.shadowColor;
            } else {
                ctx.fillStyle = tetrominoes[boardStateCopy[y][x]].color;
            }

            ctx.fillRect((blockSize * x), (blockSize * y), blockSize, blockSize);
        }
    }
}

export function gameInfoWindow() {
    const gameInfoScore = document.getElementById('gameInfoScore');
    const gameInfoLevel = document.getElementById('gameInfoLevel');
    const gameInfoLinesCleared = document.getElementById('gameInfoLinesCleared');

    gameInfoScore.innerText = gameState.getOne('score');
    gameInfoLevel.innerText = gameState.getOne('level');
    gameInfoLinesCleared.innerText = gameState.getOne('linesCleared');
}

export function showElement(elem) {
    elem.classList.add('visible');
    elem.classList.remove('hidden');
}

export function hideElement(elem) {
    elem.classList.remove('visible');
    elem.classList.add('hidden');
}

export function showGameOverlay() {
    const gameOverlay = document.getElementById('gameOverlay');
    showElement(gameOverlay);
}

export function hideGameOverlay() {
    const gameOverlay = document.getElementById('gameOverlay');
    hideElement(gameOverlay);
}

export function setGameOverlayToPauseMenu() {
    const gameOverlayText = document.getElementById('gameOverlayText');
    gameOverlayText.innerText = "Game Paused";

    const resumeGameBtn = document.getElementById('resumeGameBtn');
    resumeGameBtn.classList.remove('hidden');
}

export function setGameOverlayToGameOver() {
    const gameOverlayText = document.getElementById('gameOverlayText');
    gameOverlayText.innerText = "Game Over";

    const resumeGameBtn = document.getElementById('resumeGameBtn');
    hideElement(resumeGameBtn);
}

export function toggleGameOverlay() {
    const gameStateCopy = gameState.get();
    const gameOverlay = document.getElementById('gameOverlay');

    if (gameStateCopy.gameIsPaused || gameStateCopy.isGameOver) {
        showElement(gameOverlay);

        const gameOverlayText = document.getElementById('gameOverlayText');

        if (gameStateCopy.isGameOver) gameOverlayText.innerText = "Game Over";

        if (gameStateCopy.gameIsPaused) gameOverlayText.innerText = "Game Paused";

    } else {
        hideElement(gameOverlay);
    }
}

export function displayGameOver() {
    const gameStateCopy = gameState.get();
    gameStateCopy.isGameOver = true;
    gameStateCopy.gameIsPaused = true;
    toggleGameOverlay();
}

const shadowOverlays = document.querySelectorAll('.shadowOverlay');
export function hideShadowOverlay() {
    shadowOverlays.forEach(overlay => {
        overlay.classList.remove('visible');
        overlay.classList.add('hidden');
    })
}

export function showShadowOverlay() {
    shadowOverlays.forEach(overlay => {
        overlay.classList.remove('hidden');
        overlay.classList.add('visible');
    })
}