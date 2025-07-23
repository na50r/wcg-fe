var currTimeout;
export function renderTimer(secondsLeft) {
    const text = `${secondsLeft} seconds left`;
    const currTimer = document.getElementById("timer-popup");
    currTimer.classList.add("show");
    if (currTimer) {
        currTimer.innerText = text;
    }
    if (currTimeout) {
        clearTimeout(currTimeout);
    }
    currTimeout = setTimeout(() => {
        currTimer.classList.remove("show");
    }, 2000);
}