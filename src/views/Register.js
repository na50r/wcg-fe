import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import {register} from "../utils/Calls.js";

function renderRegister() {
  const container = UI.Container();
  const h1 = UI.h1("Register");
  const form = UI.form(register);
  
  const input = UI.input("username", "username", "text");
  const password = UI.input("password", "password", "password")

  const loginBtn = UI.actionButton("Login", () => {router.navigateTo("/login");});
  const registerBtn = UI.actionButton("Register", ()=>{}, "submit");
  const btnBar = UI.buttonBar([registerBtn, loginBtn]);
  form.append(input, password, btnBar);
  container.append(h1, form);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Register");
  }

  async getHtml() {
    return renderRegister();
  }
}
