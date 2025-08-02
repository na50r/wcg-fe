import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import { createLobby } from "../utils/Calls.js";
import { loggedIn } from "../utils/Utility.js";
import { showAlert } from "../utils/Calls.js";


function renderCreateLobby() {
  const container = UI.Container();
  const h1 = UI.h1("Create a Lobby");
  const form = UI.form(createLobby);
  const username = localStorage.getItem("username")
  const input = UI.input("lobbyName", "Lobby Name", "text", `${username}'s Lobby`);
  const createBtn = UI.actionButton("Create", ()=>{}, "submit");
  const cancelBtn = UI.actionButton("Cancel", () => {router.navigateTo("/lobbies");});
  const btnBar = UI.buttonBar([createBtn, cancelBtn]);
  form.append(input, btnBar);
  container.append(h1, form);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Create Lobby");
  }

  async getHtml() {
    if (!loggedIn()) {
      showAlert("Please login to create a lobby");
      router.navigateTo("/login");
      return;
    }
    return renderCreateLobby();
  }
}
