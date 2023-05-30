import * as helper from './helpers.js';
import * as bsl from '../gameData/boardStateLegend.js';
import * as gameState from '../gameData/gameState.js';
import * as boardState from '../gameData/boardState.js';

export function doesSpawnCauseCollision() {
    const boardStateCopy = boardState.get();
    const position = gameState.getOne('currentPosition');
    let canPieceSpawn = true;

    for (const coordPair of position) {
        const x = coordPair[0];
        const y = coordPair[1];

        if (boardStateCopy[y][x] !== bsl.empty) {
            canPieceSpawn = false;
            break;
        }
    }

    return canPieceSpawn;
}

export function handlePieceMovement(action) {
    const boardStateCopy = boardState.get();
    const currentPosition = gameState.getOne('currentPosition');
    const currentCenter = gameState.getOne('currentCenter');
    let newPosition = [];

    for (const coordPair of currentPosition) {
        const x = coordPair[0];
        const y = coordPair[1];

        if (action === "moveRight") {
            if (!bsl.validMoveCoords.includes(boardStateCopy[y][x + 1])) break;

            newPosition.push([x + 1, y])
        } else if (action === "moveLeft") {
            if (!bsl.validMoveCoords.includes(boardStateCopy[y][x - 1])) break;

            newPosition.push([x - 1, y]);
        } else if (action === "moveDown") {
            if (!boardStateCopy[y + 1]
                || !bsl.validMoveCoords.includes(boardStateCopy[y + 1][x])) {
                helper.handleFailedMoveDown();
                break;
            } else {
                newPosition.push([x, y + 1]);
                gameState.resetTimeSinceLastMoveDown();
            }
        } else if (action === "rotateRight") {
            const currentCenterX = currentCenter[0];
            const currentCenterY = currentCenter[1];

            const offsetX = coordPair[0] - currentCenterX;
            const offsetY = coordPair[1] - currentCenterY;

            let newOffsetX;
            let newOffsetY;

            if (offsetX >= 0 && offsetY <= 0) {
                newOffsetX = (offsetY * -1) + currentCenterX;
                newOffsetY = offsetX + currentCenterY;
            } else if (offsetX >= 0 && offsetY >= 0) {
                newOffsetX = (offsetY * -1) + currentCenterX;
                newOffsetY = offsetX + currentCenterY;
            } else if (offsetX <= 0 && offsetY >= 0) {
                newOffsetX = (offsetY * -1) + currentCenterX;
                newOffsetY = offsetX + currentCenterY;
            } else {
                newOffsetX = (offsetY * -1) + currentCenterX;
                newOffsetY = offsetX + currentCenterY;
            }

            const hasCollision = !boardStateCopy[newOffsetY]
                || !bsl.validMoveCoords.includes(boardStateCopy[newOffsetY][newOffsetX]);

            if (hasCollision) break;

            const newCoordPair = [newOffsetX, newOffsetY];
            newPosition.push(newCoordPair);
        } else if (action === "rotateLeft") {

            const currentCenterX = currentCenter[0];
            const currentCenterY = currentCenter[1];

            const offsetX = coordPair[0] - currentCenterX;
            const offsetY = coordPair[1] - currentCenterY;

            let newOffsetX;
            let newOffsetY;

            if (offsetX >= 0 && offsetY <= 0) {
                newOffsetX = offsetY + currentCenterX;
                newOffsetY = (offsetX * -1) + currentCenterY;
            } else if (offsetX >= 0 && offsetY >= 0) {
                newOffsetX = offsetY + currentCenterX;
                newOffsetY = (offsetX * -1) + currentCenterY;
            } else if (offsetX <= 0 && offsetY >= 0) {
                newOffsetX = offsetY + currentCenterX;
                newOffsetY = (offsetX * -1) + currentCenterY;
            } else {
                newOffsetX = offsetY + currentCenterX;
                newOffsetY = (offsetX * -1) + currentCenterY;
            }

            const hasCollision = !boardStateCopy[newOffsetY]
                || !bsl.validMoveCoords.includes(boardStateCopy[newOffsetY][newOffsetX]);

            if (hasCollision) break;

            const newCoordPair = [newOffsetX, newOffsetY];
            newPosition.push(newCoordPair);
        }
    };

    const didPieceMove = currentPosition.length === newPosition.length;

    if (!didPieceMove) return;

    return newPosition;
}

export function getShadowPosition(shadowPosition) {
    const gameStateCopy = gameState.get();
    const startingPosition = shadowPosition ||
        gameStateCopy.currentPosition;

    if (canPieceMoveDown(startingPosition)) {
        const nextPosition = startingPosition.map(coordPair =>
            [coordPair[0], coordPair[1] + 1]);
        return getShadowPosition(nextPosition);
    } else {
        return startingPosition;
    }
}

function canPieceMoveDown(currentPosition) {
    const boardStateCopy = boardState.get();
    let pieceCanMove = true;

    for (const coordPair of currentPosition) {
        const x = coordPair[0];
        const y = coordPair[1];

        if (!boardStateCopy[y + 1]
            || !bsl.validMoveCoords.includes(boardStateCopy[y + 1][x])) {
            pieceCanMove = false;
            break;
        }
    }
    return pieceCanMove;
}