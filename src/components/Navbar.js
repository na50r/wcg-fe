import { router } from "../main.js";

function loggedIn() {
    return localStorage.getItem("token") !== null
}

function inLobby() {
    return localStorage.getItem("playerToken") !== null
}

function inGame() {
    return localStorage.getItem("game") !== null
}

function loggedOutView() {
    const newNav = document.createElement("nav")
    const routes = ["/lobbies", "/login", "/register"]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

function loggedInView() {
    const newNav = document.createElement("nav")
    const routes = ["/lobbies", `/leaderboard`, `/account/${localStorage.getItem("username")}`, "/logout"]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

function loggedInAndInLobbyView() {
    const newNav = document.createElement("nav")
    const routes = [`/lobby/${localStorage.getItem("lobbyCode")}`, `/account/${localStorage.getItem("username")}`, "/logout"]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

function loggedInAndInGameView() {
    const newNav = document.createElement("nav")
    const routes = ["/game", `/lobby/${localStorage.getItem("lobbyCode")}`, `/account/${localStorage.getItem("username")}`, "/logout"]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

function InGameView() {
    const newNav = document.createElement("nav")
    const routes = ["/game", `/lobby/${localStorage.getItem("lobbyCode")}`]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}


function lobbyView() {
    const newNav = document.createElement("nav")
    const routes = [`/lobby/${localStorage.getItem("lobbyCode")}`]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

function temporaryView() {
    const currRoute = location.pathname
    if (currRoute !== "/") return;
    const nav= document.querySelector("nav")
    nav.classList.add("nav-visible")
    setTimeout(() => {
        nav.classList.remove("nav-visible")
    }, 3000);
}

export function navBehaviour() {
  setInterval(temporaryView, 20000);
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      router.navigateTo(e.target.href)
    }
  })
}

export function isServerDown() {
    return localStorage.getItem("serverDown") === "true"
}

function serverDownView() {
    const newNav = document.createElement("nav")
    const routes = ["/server-down"]
    for (const route of routes) {
        const a = document.createElement("a")
        a.href = route
        a.innerText = route.replace("/", "").toUpperCase()
        a.dataset.link = true
        a.classList.add("nav__link")
        newNav.appendChild(a)
    }
    const nav = document.querySelector("nav")
    nav.replaceWith(newNav)
}

export function Navbar() {
    if (isServerDown()) {
        serverDownView()
        return;
    }
    if (loggedIn() && inLobby() && inGame()) {
        loggedInAndInGameView()
    }
    else if (loggedIn() && inLobby()) {
        loggedInAndInLobbyView()
    } else if (loggedIn() && !inLobby()) {
        loggedInView()
    } else if (!loggedIn() && inLobby() && inGame()) {
        InGameView()
    } else if (!loggedIn() && inLobby()) {
        lobbyView()
    } else {
        loggedOutView()
    }
}