var currTimeout;
export function renderTimer(secondsLeft) {
    if (location.pathname !== "/game") {
        return;
    }
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

export function setupTimer() {
    const timer = document.createElement('h3');
    timer.id = "timer-popup";
    timer.innerText = "Timer";
    return timer;
}
