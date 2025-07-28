export function toggleButton() {
    const input = document.getElementById("username")
    const pw = document.getElementById("password")
    const btn = document.getElementById("enter-btn")
    if (input.value && pw.value) {
        btn.disabled = false
    } else {
        btn.disabled = true
    }
}

export function toggleButtonForPlayerLogin() {
    const input = document.getElementById("playerName")
    const btn = document.getElementById("enter-btn")
    if (input.value) {
        btn.disabled = false
    } else {
        btn.disabled = true
    }
}

export function toggleButtonForNewUsername() {
    const input = document.getElementById("username")
    const btn = document.getElementById("enter-btn-username")
    if (input.value) {
        btn.disabled = false
    } else {
        btn.disabled = true
    }
}

export function toggleButtonForNewPassword() {
    const oldPassword = document.getElementById("oldPassword")
    const newPassword = document.getElementById("newPassword")
    const btn = document.getElementById("enter-btn")
    if (oldPassword.value && newPassword.value) {
        btn.disabled = false
    } else {
        btn.disabled = true
    }
}

export function loggedIn() {
    return localStorage.getItem("token") !== null
}


export function isOwner() {
    const cond = localStorage.getItem("playerName") === localStorage.getItem("owner")
    const cond2 = localStorage.getItem('owner') !== undefined
    return cond && cond2
}