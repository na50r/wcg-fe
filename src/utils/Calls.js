import { router } from "../main.js";
import { Navbar } from "../components/Navbar.js";
import { initOrUpdateEventSource } from "./EventHandling.js";
import swal from 'sweetalert2'

const API = import.meta.env.VITE_API;

function generateHeader(token) {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
}


export async function showAlert(msg) {
    await swal.fire(
        {
            title: msg,
            confirmButtonText: "OK",
            confirmButtonColor: "#7c7c7cff",
        }
    )
}

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
        showAlert("Successfully registered!")
        router.navigateTo("/login")
    } else {
        const msg = await res.json()
        showAlert(`${msg.error}`)
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
        showAlert("Successfully logged in!")
        router.navigateTo(`/account/${un}`)
        router.navigate()
        Navbar()
    } else {
        const msg = await res.json()
        showAlert(`${msg.error}`)
    }
}

function clearCache() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    localStorage.removeItem("account")
    localStorage.removeItem("lobbies")
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("playerName")
    localStorage.removeItem("playerToken")
}

export async function logout() {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/logout`, {
        method: "POST",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    clearCache()
    showAlert("Successfully logged out!")
    router.navigateTo("/")
    router.navigate()
    Navbar()
}

export async function account(username) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/account/${username}`, {
        method: "GET",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function getImages(username) {
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/account/${username}/images`, {
        method: "GET",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}


export async function changeImage(imageName) {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const body = {
        type: "IMAGE",
        imageName: imageName,
    }
    console.log(body)
    const res = await fetch(`${API}/account/${username}`, {
        method: "PUT",
        headers: generateHeader(token),
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    localStorage.removeItem("account")
    router.navigate()
}

export async function editUsername(newUsername) {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const body = {
        type: "USERNAME",
        username: newUsername,
    }
    const res = await fetch(`${API}/account/${username}`, {
        method: "PUT",
        headers: generateHeader(token),
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    localStorage.removeItem("account")
    localStorage.setItem("username", newUsername)
    router.navigateTo(`/account/${newUsername}`)
}

export async function editPassword(oldPassword, newPassword) {
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    const body = {
        type: "PASSWORD",
        oldPassword: oldPassword,
        newPassword: newPassword,
    }
    const res = await fetch(`${API}/account/${username}`, {
        method: "PUT",
        headers: generateHeader(token),
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const resp = await res.json()
    showAlert(resp.message)
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
        showAlert(`${msg.error}`)
        return [];
    }
    const data = await res.json()
    return data
}

export async function createLobby(e) {
    e.preventDefault()
    const form = e.target
    const body = {
        name: form.lobbyName.value,
    }
    const token = localStorage.getItem("token")
    const username = localStorage.getItem("username")
    let res = await fetch(`${API}/lobbies`, {
        method: "POST",
        headers: generateHeader(token),
        body: JSON.stringify(body),
    })
    if (res.ok) {
        const data = await res.json()
        localStorage.setItem("lobbyCode", data.lobby.lobbyCode)
        localStorage.setItem("playerName", username)
        localStorage.setItem("playerToken", data.token)
        localStorage.setItem("owner", username)
        initOrUpdateEventSource()
        router.navigateTo(`/lobby/${data.lobby.lobbyCode}`)
        router.navigate()
        Navbar()
    } else {
        const msg = await res.json()
        showAlert(`${msg.error}`)
    }
}

export async function getLobby(lobbyCode, playerName, playerToken) {
    const res = await fetch(`${API}/lobbies/${lobbyCode}/${playerName}`, {
        method: "GET",
        headers: generateHeader(playerToken)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
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
    const res = await fetch(`${API}/lobbies`, {
        method: "PUT",
        headers: generateHeader(token),
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    localStorage.setItem("lobbyCode", lobbyCode)
    localStorage.setItem("playerName", playerName)
    localStorage.setItem("playerToken", data.token)
    localStorage.setItem("owner", data.owner)
    initOrUpdateEventSource()
    router.navigateTo(`/lobby/${data.lobby.lobbyCode}`)
    router.navigate()
    Navbar()
}

export async function leaveLobby() {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/lobbies/${lobbyCode}/${playerName}/leave`, {
        method: "POST",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("playerName")
    localStorage.removeItem("playerToken")
    localStorage.removeItem("lobby")
    router.navigateTo("/lobbies")
    router.navigate()
    Navbar()
}

export async function editGame(gameMode = null, duration = null) {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/lobbies/${lobbyCode}/${playerName}/edit`, {
        method: "PUT",
        headers: generateHeader(token),
        body: JSON.stringify({ gameMode: gameMode, duration: duration })
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
}

export async function getCombination(elemA, elemB) {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const body = {
        a: elemA,
        b: elemB,
    }
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/combinations`, {
        method: "POST",
        headers: generateHeader(token),
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function startGame() {
    const table = document.getElementById("gameModes");
    if (!table) return;
    var gameMode = null;
    const rows = table.querySelectorAll("tr");
    for (const row of rows) {
        if (row.classList.contains("selected")) {
            gameMode = row.getAttribute("data-mode");
            break;
        }
    }
    if (gameMode === null) {
        showAlert("Please select a game mode")
        return;
    }

    const durationSelect = document.getElementById("duration-select");
    const duration = durationSelect.value;
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const token = localStorage.getItem("playerToken")
    const body = {
        gameMode: gameMode,
        withTimer: !(duration === "0"),
        duration: parseInt(duration),
    }
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/game`, {
        method: "POST",
        headers: generateHeader(token),
        body: JSON.stringify(body)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
}

export async function getPlayerWords() {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/words`, {
        method: "GET",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function getGameStats() {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/game`, {
        method: "GET",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}

export async function deleteGame() {
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const playerName = localStorage.getItem("playerName")
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/game`, {
        method: "DELETE",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
}

export async function endGame() {
    const playerName = localStorage.getItem("playerName")
    const token = localStorage.getItem("playerToken")
    const lobbyCode = localStorage.getItem("lobbyCode")
    const res = await fetch(`${API}/games/${lobbyCode}/${playerName}/end`, {
        method: "POST",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
}

export async function getLeaderboard() {
    const username = localStorage.getItem("username")
    const token = localStorage.getItem("token")
    const res = await fetch(`${API}/account/${username}/leaderboard`, {
        method: "GET",
        headers: generateHeader(token)
    })
    if (!res.ok) {
        const msg = await res.json()
        showAlert(`${msg.error}`)
        return;
    }
    const data = await res.json()
    return data
}