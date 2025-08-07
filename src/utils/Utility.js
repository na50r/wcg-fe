import swal from 'sweetalert2'

export async function showNotification(msg) {
    await swal.fire(
        {
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: `${msg}`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            customClass: {
                title: 'custom-title',
            }
        }
    )
}

export async function showAlert(msg) {
    await swal.fire(
        {
            title: msg,
            confirmButtonText: "OK",
            confirmButtonColor: "#7c7c7cff",
            customClass: {
                title: 'custom-title',
            }
        }
    )
}

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

export function cacheData(data, dataName) {
    try {
        const json = JSON.stringify(data);
        localStorage.setItem(dataName, json);
    } catch (e) {
        console.error(`Failed to cache ${dataName}:`, e);
    }
}
export function loadData(dataName){
    const raw = localStorage.getItem(dataName);
    if (!raw) return null;

    try {
        return JSON.parse(raw);
    } catch (e) {
        console.warn("Failed to parse cached data, clearing it.");
        localStorage.removeItem(dataName);
        return null;
    }
}

