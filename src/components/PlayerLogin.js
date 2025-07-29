import * as UI from "./UI.js";
import { joinLobby } from "../utils/Calls.js";
import { createToggleHandler } from "../utils/Utility.js";

function joinLobbyAnon(e) {
    e.preventDefault()
    const playerLogin = document.getElementById("player-login");
    const lobbyCode = playerLogin.dataset.lobbyCode
    const form = e.target
    const playerName = form.playerName.value
    joinLobby(lobbyCode, playerName)
}

export function PlayerLogin(lobbyCode) {
    const container = UI.Container();
    container.id = "player-login";
    container.classList.add("modal-overlay-1");
    container.dataset.lobbyCode = lobbyCode;
    const h2 = UI.h2("Provide a player name");
    const form = UI.form(joinLobbyAnon);
    const input = UI.input("playerName", "Player Name", "text");
    input.id = "playerName"
    const toggleButton = createToggleHandler(["playerName"], "enter-btn")
    input.addEventListener("input", toggleButton)
    const joinBtn = UI.actionButton("Confirm", ()=>{}, "submit");
    joinBtn.id = "enter-btn"
    joinBtn.disabled = true
    const close = () => {
        const app = document.getElementById("app")
        app.removeChild(container);
    }
    const cancelBtn = UI.actionButton("Cancel", () => {close(); container.dataset.lobbyCode = null;});
    const btnBar = UI.buttonBar([joinBtn, cancelBtn]);
    form.append(input, btnBar);
    container.append(h2, form);
    return container;
}
