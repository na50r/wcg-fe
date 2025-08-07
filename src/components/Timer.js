var currTimeout;

function setupTimer() {
    const timer = document.createElement('h3');
    timer.id = "timer-popup";
    return timer;
}

export function renderTimer(secondsLeft) {
    if (location.pathname !== "/game") {
        return;
    }
    const text = `${secondsLeft} seconds left`;
    const app = document.getElementById("app");
    var timer = app.getElementById("timer-popup");
    if (!timer) {
        timer = setupTimer();
        app.append(timer);
    }
    timer.innerText = text;
    timer.classList.add("show");
    if (currTimeout) {
        //Deals with the case of countdown form 10 every second
        clearTimeout(currTimeout);
    }
    currTimeout = setTimeout(() => {
        timer.classList.remove("show");
    }, 2000);
}
