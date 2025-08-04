import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";

function renderServerDown() {
    const container = UI.Container();
    const h1 = UI.h1("Server Down");
    const p1 = UI.p("The server seems to be down.");
    const p2 = UI.p("Please try again later and refresh the page.");
    container.append(h1, p1, p2);
    return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Server Down");
  }

  async getHtml() {
    return renderServerDown();
  }
}
