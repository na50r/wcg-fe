import * as UI from "./UI.js";
import { joinLobby } from "../utils/Calls.js";

function joinLobbyAnon(e) {
    e.preventDefault()
    const playerLogin = document.querySelector(".player-login");
    const lobbyCode = playerLogin.dataset.lobbyCode
    const form = e.target
    const playerName = form.playerName.value
    joinLobby(lobbyCode, playerName)
}

export function PlayerLogin() {
    const container = UI.Container();
    container.classList.add("player-login");
    const h2 = UI.h2("Provide a player name");
    const form = UI.form(joinLobbyAnon);
    const input = UI.input("playerName", "Player Name", "text");
    const joinBtn = UI.actionButton("Confirm", ()=>{}, "submit");
    const cancelBtn = UI.actionButton("Cancel", () => {container.classList.remove("open"); container.dataset.lobbyCode = null;});
    const btnBar = UI.buttonBar([joinBtn, cancelBtn]);
    form.append(input, btnBar);
    container.append(h2, form);
    return container;
}
