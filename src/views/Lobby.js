import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";

function renderLobby() {
    const container = UI.Container();
    const h1 = UI.h1("Lobby");
    container.append(h1);
    return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Lobby");
  }

  async getHtml() {
    return renderLobby();
  }
}