export const gameState = {
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

export const gameOptions = {
    blockSize: 25,
    playAreaX: 10,
    playAreaY: 20,
    backgroundColor: "#b8b8b8",
    gridColor: "black",
    shadowColor: "#5c5c5c",
    spawnOffset: 5,
    numOfUpcomingPiecesAllowed: 3,
    numOfHeldPiecesAllowed: 1
};

export const keybinds = {
    moveRight: ["KeyD", "ArrowRight"],
    moveDown: ["KeyS", "ArrowDown"],
    moveLeft: ["KeyA", "ArrowLeft"],
    rotateRight: ["KeyW", "ArrowUp"],
    rotateLeft: ["KeyE", "KeyZ"],
    holdPiece: ["ShiftLeft", "KeyC"],
    dropPiece: ["Space"],
    pause: ["KeyP", "Escape"]
};