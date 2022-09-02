function openMediaInFullScreen(mediaId) {
    const media = document.getElementById(mediaId);
    if (media.requestFullscreen) {
        media.requestFullscreen();
    } else if (media.mozRequestFullScreen) {
        media.mozRequestFullScreen();
    } else if (media.webkitRequestFullscreen) {
        media.webkitRequestFullscreen();
    } else if (media.msRequestFullscreen) {
        media.msRequestFullscreen();
    }
}
