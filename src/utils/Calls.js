import { router } from "../main.js";
import { Navbar } from "../components/Navbar.js";

const API = import.meta.env.VITE_API;

export async function register(e) {
    e.preventDefault()
    const form = e.target
    const body = {
        username: form.username.value,
        password: form.password.value,
    }
    let res = await fetch(`${API}/accounts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })
    if (res.ok) {
        alert("Successfully registered")
        router.navigateTo("/login")
    } else {
        const msg = await res.json()
        alert(`${msg.error}`)
    }
}

export async function login(e) {
    e.preventDefault()
    const un = e.target.username.value
    localStorage.setItem("username", un)
    const form = e.target
    const body = {
        username: un,
        password: form.password.value,
    }
    let res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
    if (res.ok) {
        const data = await res.json()
        localStorage.setItem("token", data.token)
        alert("Successfully logged in")
        router.navigateTo(`/account/${un}`)
        router.navigate()
        Navbar()
    } else {
        const msg = await res.json()
        alert(`${msg.error}`)
    }
}

export async function logout() {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/logout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    alert("Successfully logged out")
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("account")
    localStorage.removeItem("lobbies")
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("playerName")
    localStorage.removeItem("playerToken")
    router.navigateTo("/")
    router.navigate()
    Navbar()
}

export async function account(username) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/account/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function getImages(username) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/account/${username}/images`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}


export async function changeImage(imageName) {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const res = await fetch(`${API}/account/${username}/image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body: JSON.stringify({ imageName: imageName })
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    localStorage.removeItem("account")
    router.navigate()
}

export async function getLobbies() {
    const res = await fetch(`${API}/lobbies`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export function lobbyEvents() {
    const evntSource = new EventSource(`${API}/events/lobbies`);
    return evntSource;
}

export async function createLobby(e) {
    e.preventDefault()
    const form = e.target
    const body = {
        name: form.lobbyName.value,
    }
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    let res = await fetch(`${API}/account/${username}/lobby`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body: JSON.stringify(body),
    })
    if (res.ok) {
        alert("Successfully created lobby")
        const data = await res.json()
        console.log(data)
        localStorage.setItem("lobbyCode", data.lobby.lobbyCode)
        localStorage.setItem("playerName", username)
        localStorage.setItem("playerToken", data.token)
        localStorage.setItem("owner", username)
        router.navigateTo(`/lobby/${data.lobby.lobbyCode}`)
        router.navigate()
        Navbar()
    } else {
        const msg = await res.json()
        alert(`${msg.error}`)
    }
}

export async function getLobby(lobbyCode, playerName, playerToken) {
    const res = await fetch(`${API}/lobbies/${lobbyCode}/view/${playerName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${playerToken}`
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function joinLobby(lobbyCode, playerName) {
    var token = localStorage.getItem("token")
    if (token === null) {
        token = ""
    }
    const body = {
        lobbyCode: lobbyCode,
        playerName: playerName,
    }
    const res = await fetch(`${API}/lobbies/join`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
        },
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    console.log(data)
    localStorage.setItem("lobbyCode", lobbyCode)
    localStorage.setItem("playerName", playerName)
    localStorage.setItem("playerToken", data.token)
    localStorage.setItem("owner", data.owner)
    router.navigateTo(`/lobby/${data.lobby.lobbyCode}`)
    router.navigate()
    Navbar()
}

export async function leaveLobby() {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/lobbies/${lobbyCode}/leave/${playerName}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        }
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("playerName")
    localStorage.removeItem("playerToken")
    localStorage.removeItem("lobby")
    router.navigateTo("/lobbies")
    router.navigate()
}

export async function changeGameMode(gameMode) {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/lobbies/${lobbyCode}/edit/${playerName}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`
        },
        body: JSON.stringify({ gameMode: gameMode })
    })
    if (!res.ok) {
        const msg = await res.json()
        alert(`${msg.error}`)
        return;
    }
}