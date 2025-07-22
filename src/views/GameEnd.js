import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import { gameEnd } from "../utils/Calls.js";

function renderGameEnd(data) {
    const container = UI.Container();
    const isWinner = data.winner === localStorage.getItem("playerName")
    const h1 = isWinner ? UI.h1("You have won the game") : UI.h1("You have lost the game");
    const btn = UI.actionButton("Back to Lobby", () => { router.navigateTo(`/lobby/${localStorage.getItem("lobbyCode")}`); });
    container.append(h1, btn);
    return container;
}


export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game End");
    }

    async getHtml() {
        const data = await gameEnd()
        return renderGameEnd(data);
    }
}
