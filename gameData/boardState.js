import * as bsl from './boardStateLegend.js';
import * as gameState from './gameState.js';
import * as defaults from './defaults.js';
import * as helper from '../js/helpers.js';

let boardState = [];

export function reset() {
    boardState = [];
    const gameOptions = defaults.gameOptions;
    const x = gameOptions.playAreaX;
    const y = gameOptions.playAreaY;

    for (let i = 0; i < y; i++) {
        const newLine = new Array(x).fill(bsl.empty);
        boardState.push(newLine);
    }
}

export function get() {
    const boardStateCopy = helper.copyObject(boardState);
    return boardStateCopy;
}

export function set(newState) {
    boardState = newState;
}

export function setCoordinateToCurrentPiece(x, y) {
    boardState[y][x] = gameState.getOne('currentPiece');
}

export function setCoordinateToEmpty(x, y) {
    boardState[y][x] = bsl.empty;
}

export function update() {
    const piecePosition = gameState.getOne('currentPosition');
    const shadowPosition = gameState.getOne('shadowCurrentPosition');

    // Removes any active piece and it's shadow from the board state
    boardState.forEach((row, yIdx) => {
        row.forEach((column, xIdx) => {
            if (column === bsl.active || column === bsl.shadow) {
                boardState[yIdx][xIdx] = bsl.empty;
            }
        })
    });

    //=============================================================
    // Add the shadow first so that the piece will cover the shadow
    // when they overlap
    shadowPosition.forEach(coordPair => {
        const x = coordPair[0];
        const y = coordPair[1];

        boardState[y][x] = bsl.shadow;
    });

    piecePosition.forEach(coordPair => {
        const x = coordPair[0];
        const y = coordPair[1];

        boardState[y][x] = bsl.active;
    });
    //=============================================================
}

export function lockPiece() {
    const gameStateCopy = gameState.get();
    boardState.forEach((row, yIdx) => {
        row.forEach((column, xIdx) => {
            if (column === bsl.active) {
                boardState[yIdx][xIdx] = gameStateCopy.currentPiece;
            }
        })
    });
}