function loggedIn() {
    return localStorage.getItem("token") !== null
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
    const routes = ["/lobbies", `/account/${localStorage.getItem("username")}`, "/logout"]
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
    if (loggedIn()) {
        loggedInView()
    } else {
        loggedOutView()
    }
}