import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import {login} from "../utils/Calls.js";

function renderLogin() {
  const container = UI.Container();
  const h1 = UI.h1("Login");
  const form = UI.form(login);
  const input = UI.input("username", "username", "text");
  const password = UI.input("password", "password", "password");

  const registerBtn = UI.actionButton("Register", () => {router.navigateTo("/register");});
  const loginBtn = UI.actionButton("Login", ()=>{}, "submit");
  const btnBar = UI.buttonBar([loginBtn, registerBtn]);
  form.append(input, password, btnBar);
  container.append(h1, form);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    return renderLogin();
  }
}
