import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getLobby } from "../utils/Calls.js";


function renderLobby(lobbyName) {
  const container = UI.Container();
  const h1 = UI.h1(lobbyName);
  const p = UI.p("Time to play");
  container.append(h1, p);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    console.log("params", params)
    this.lobbyCode = params.lobbyCode
    this.setTitle(`Lobby ${this.params.lobbyCode}`);
  }

  async getHtml() {
    const lobbyCode = this.lobbyCode
    const playerName = localStorage.getItem("playerName")
    const playerToken = localStorage.getItem("playerToken")
    console.log(lobbyCode, playerName, playerToken)
    const data = await getLobby(lobbyCode, playerName, playerToken)
    console.log(data)
    return renderLobby(data.name);
  }
}
