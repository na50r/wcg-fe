import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";

function tmpLogout() {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    router.navigateTo("/")
    location.reload()
}

function renderLogout() {
  const container = UI.Container();
  const h1 = UI.h1("Logout");
  const h2 = document.createElement("h2");
  h2.innerText = "Are you sure you want to logout?";

  const logout = UI.actionButton("Yes", () => {tmpLogout();});
  const notYet = UI.actionButton("No", ()=>{router.navigateTo(`/account/${localStorage.getItem("username")}`);});
  const btnBar = UI.buttonBar([logout, notYet]);
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
