import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import {logout} from "../utils/Calls.js";

function renderLogout() {
  const container = UI.Container();
  const h1 = UI.h1("Logout");
  const h2 = document.createElement("h2");
  h2.innerText = "Are you sure you want to logout?";

  const yes = UI.actionButton("Yes", logout);
  const notYet = UI.actionButton("No", ()=>{router.navigateTo(`/account/${localStorage.getItem("username")}`);});
  const btnBar = UI.buttonBar([yes, notYet]);
  container.append(h1, h2, btnBar);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Logout");
  }

  async getHtml() {
    return renderLogout();
  }
}
