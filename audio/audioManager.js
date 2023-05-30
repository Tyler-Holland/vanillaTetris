const hardDrop = new Audio('./audio/hardDrop.mp3');
const move = new Audio('./audio/move.mp3');
const rotate = new Audio('./audio/rotate.mp3');
const theme = new Audio('./audio/theme.mp3');
const hold = new Audio('./audio/hold.mp3');
const gameOver = new Audio('./audio/gameOver.mp3');
const lockPiece = new Audio('./audio/lockPiece.mp3');
const lineClear = new Audio('./audio/lineClear.mp3');
const tetrisClear = new Audio('./audio/tetrisClear.mp3');

let masterVolume = 1;
const toggleSoundBtn = document.getElementById('toggleSoundBtn');
toggleSoundBtn.addEventListener('click', () => {
    masterVolume = !masterVolume;

    if (masterVolume) {
        theme.volume = 0.7;
        toggleSoundBtn.classList.remove('muted');
    } else {
        theme.volume = 0;
        toggleSoundBtn.classList.add('muted');
    }
})

export function resetTheme() {
    theme.currentTime = 0;
}

export function playTheme() {
    theme.volume = 0.6 * masterVolume;
    theme.play();
}

export function pauseTheme() {
    theme.pause();
}

export function playMove() {
    move.currentTime = 0;
    move.volume = 0.4 * masterVolume;
    move.play();
}

export function playRotate() {
    rotate.currentTime = 0;
    rotate.volume = 0.4 * masterVolume;
    rotate.play();
}

export function playHardDrop() {
    hardDrop.currentTime = 0;
    hardDrop.volume = 0.7 * masterVolume;
    hardDrop.play();
}

export function playHold() {
    hold.currentTime = 0;
    hold.volume = 0.25 * masterVolume;
    hold.play();
}

export function playGameOver() {
    gameOver.currentTime = 0;
    gameOver.volume = 1 * masterVolume;
    gameOver.play();
}

export function playLockPiece() {
    lockPiece.currentTime = 0;
    lockPiece.volume = 0.5 * masterVolume;
    lockPiece.play();
}

export function playLineClear() {
    lineClear.currentTime = 0;
    lineClear.volume = 0.3 * masterVolume;
    lineClear.play();
}

export function playTetrisClear() {
    tetrisClear.currentTime = 0;
    tetrisClear.volume = 0.7 * masterVolume;
    tetrisClear.play();
}

theme.addEventListener('ended', playTheme);