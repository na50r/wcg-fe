import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";

function renderAccount(username) {
    const container = UI.Container();
    const h1 = UI.h1("Account");
    const h2 = document.createElement("h2");
    h2.innerText = username;
    container.append(h1, h2);
    return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Account");
    this.username = params.username
  }

  async getHtml() {
    const username = this.username
    console.log(username)
    return renderAccount(username);
  }
}