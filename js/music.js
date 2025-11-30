function startAudio() {
    const audio = document.getElementById('myAudio');
    audio.muted = false;
    audio.play();
}

['click', 'mousedown', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, startAudio, { once: true });
});