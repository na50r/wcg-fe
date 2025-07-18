import { router } from "../main.js";

const API = "http://localhost:3000"

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
        username: form.username.value,
        password: form.password.value,
    }
    let res = await fetch(`${API}/login`, {
        method: "PUT",
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
        location.reload()
    } else {
        const msg = await res.json()
        alert(`${msg.error}`)
    }
}