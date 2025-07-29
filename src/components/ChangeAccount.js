import * as UI from "./UI.js";
import { createToggleHandler } from "../utils/Utility.js";
import { editUsername, editPassword } from "../utils/Calls.js"; 

function changeUsernameForm(e) {
    e.preventDefault()
    const changeUsername = document.getElementById("change-username");
    const form = changeUsername.querySelector("form")
    const newUsername = form.username.value
    alert("Not implemented yet")
}

async function changePasswordForm(e) {
    e.preventDefault()
    const changeAccount = document.getElementById("change-password");
    const form = changeAccount.querySelector("form")
    const oldPassword = form.oldPassword.value
    const newPassword = form.newPassword.value
    await editPassword(oldPassword, newPassword)
}

export function ChangeUsername() {
    const container = UI.Container();
    container.id = "change-username";
    container.classList.add("modal-overlay-1");
    const h2 = UI.h2("Provide a new username");
    const form = UI.form(changeUsernameForm);
    const input = UI.input("username", "New Username", "text");
    const toggleButton = createToggleHandler(["username"], "enter-btn-username")
    input.id = "username"
    input.addEventListener("input", toggleButton)
    const joinBtn = UI.actionButton("Confirm", ()=>{}, "submit");
    joinBtn.id = "enter-btn-username"
    joinBtn.disabled = true
    const cancelBtn = UI.actionButton("Cancel", () => {container.classList.remove("open");});
    const btnBar = UI.buttonBar([joinBtn, cancelBtn]);
    form.append(input, btnBar);
    container.append(h2, form);
    return container;
}

export async function ChangePassword() {
    const container = document.createElement("div");
    container.id = "change-password";
    container.classList.add("modal-overlay-1");
    const h2 = UI.h2("Provide your old and new password");
    const form = UI.form(changePasswordForm);
    const oldPassword = UI.input("oldPassword", "Old Password", "password");
    const newPassword = UI.input("newPassword", "New Password", "password");
    oldPassword.id = "oldPassword"
    newPassword.id = "newPassword"
    const toggleButton = createToggleHandler(["oldPassword", "newPassword"], "enter-btn")
    oldPassword.addEventListener("input", toggleButton)
    newPassword.addEventListener("input", toggleButton)
    const joinBtn = UI.actionButton("Confirm", () => { }, "submit");
    joinBtn.id = "enter-btn"
    joinBtn.disabled = true

    close = () => {
        const app = document.getElementById("app")
        app.removeChild(container);
    }
    const cancelBtn = UI.actionButton("Cancel", () => { close()  });
    const btnBar = UI.buttonBar([joinBtn, cancelBtn]);
    form.append(oldPassword, newPassword, btnBar);
    container.append(h2, form);
    return container;
}
