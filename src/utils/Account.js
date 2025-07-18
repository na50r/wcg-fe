export function cacheAccount(data) {
    localStorage.setItem("account", JSON.stringify(data))
}

export function loadAccount() {
    const account = localStorage.getItem("account")
    if (!account) return null;
    return JSON.parse(account)
}