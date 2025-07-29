function toggleButton(inputIds, buttonId) {
    const inputs = inputIds.map(id => document.getElementById(id));
    const btn = document.getElementById(buttonId);

    const allFilled = inputs.every(input => input && input.value.trim());
    btn.disabled = !allFilled;
}

export function createToggleHandler(inputIds, buttonId) {
    return () => toggleButton(inputIds, buttonId);
}


export function loggedIn() {
    return localStorage.getItem("token") !== null
}


export function isOwner() {
    const cond = localStorage.getItem("playerName") === localStorage.getItem("owner")
    const cond2 = localStorage.getItem('owner') !== undefined
    return cond && cond2
}

export function Popup(element) {
    const app = document.getElementById("app")
    app.append(element);
}