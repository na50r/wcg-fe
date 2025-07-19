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

export function loggedIn() {
    return localStorage.getItem("token") !== null
}