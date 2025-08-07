import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { lobbyPicture } from "../components/Images.js";
import { router } from "../main.js";
import { joinLobby, getLobbies } from "../utils/Calls.js";
import { PlayerLogin } from "../components/PlayerLogin.js";
import { setEventListeners } from "../utils/EventHandling.js";
import { Popup, loadData, cacheData, loggedIn, showAlert } from "../utils/Utility.js";

function renderLobby(name, image, playerCount) {
  const lobby = document.createElement('div');
  lobby.classList.add('lobby');
  const p = UI.p(name);
  const img = lobbyPicture(image);
  const cnt = UI.p(playerCount);
  lobby.append(img, p, cnt);
  return lobby;
}

function joinSelectedLobby(selectedLobby) {
  const lobbyCode = selectedLobby.querySelector('p').innerText;
  const playerName = localStorage.getItem("username");
  if (playerName === null) {
    const playerLogin = PlayerLogin(lobbyCode);
    Popup(playerLogin)
    return;
  }
  joinLobby(lobbyCode, playerName);
}

function renderLobbies(data) {
  var selectedLobby = null;
  const container = UI.Container();
  const h1 = UI.h1("Lobbies");
  const p = UI.p("Select a lobby or create a new one");
  container.append(h1);
  container.append(p);
  const lobbyInstances = data.map(lobby => renderLobby(lobby.lobbyCode, lobby.image, lobby.playerCount));
  const lobbies = document.createElement('div');
  lobbies.classList.add('lobbies');
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('scroll-wrapper');
  for (const lobby of lobbyInstances) {
    lobby.addEventListener('click', () => {
      if (selectedLobby) {
        selectedLobby.classList.remove('selected');
      }
      lobby.classList.add('selected');
      selectedLobby = lobby;
    });
    scrollWrapper.append(lobby);
  }
  lobbies.append(scrollWrapper);
  container.append(lobbies);
  const joinBtn = UI.actionButton("Join", () => {
    if (!selectedLobby) {
      showAlert("Please select a lobby");
      return;
    }
    joinSelectedLobby(selectedLobby);
  });

  const createBtn = UI.actionButton("Create", () => {
    if (!loggedIn()) {
      showAlert("Please login to create a lobby");
      return;
    }
    router.navigateTo("/lobby");
  });
  const btnBar = UI.buttonBar([joinBtn, createBtn]);
  container.append(btnBar);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Lobbies");
  }

  async getHtml() {
    setEventListeners();
    if (loadData('lobbies') === null) {
      const data = await getLobbies()
      cacheData(data, 'lobbies')
    }
    const data = loadData('lobbies')
    return renderLobbies(data);
  }
}