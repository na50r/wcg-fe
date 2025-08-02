import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import {logout} from "../utils/Calls.js";
import { Navbar } from "../components/Navbar.js";

function logoutAction() {
  logout()
  router.navigateTo("/");
  router.navigate();
  Navbar()
}

function renderLogout() {
  const container = UI.Container();
  const h1 = UI.h1("Logout");
  const p = UI.p("Are you sure you want to logout?");

  const yes = UI.actionButton("Yes", logoutAction);
  const notYet = UI.actionButton("No", ()=>{router.navigateTo(`/account/${localStorage.getItem("username")}`);});
  const btnBar = UI.buttonBar([yes, notYet]);
  container.append(h1, p, btnBar);
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
