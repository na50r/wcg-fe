import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getLobbies } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";
import { eventSource, router } from "../main.js";
import { loggedIn } from "../utils/Utility.js";

function handleLobbyEvents(event) {
  let data = JSON.parse(event.data)
  if (data === "LOBBY_CREATED" || data === "LOBBY_DELETED") {
    console.log("Lobby created")
    localStorage.removeItem("lobbies")
    location.reload()
  }
}

function cacheLobbies(data) {
  localStorage.setItem("lobbies", JSON.stringify(data))
}

function loadLobbies() {
  const lobbies = localStorage.getItem("lobbies")
  if (!lobbies) return null;
  return JSON.parse(lobbies)
}

function renderLobby(name, image, playerCount) {
  const lobby = document.createElement('div');
  lobby.classList.add('lobby');
  const p = UI.p(name);
  const img = lobbyPicture(image);
  const cnt = UI.p(playerCount);
  lobby.append(img, p, cnt);
  return lobby;
}

function renderLobbies(data) {
  var selectedLobby = null;
  const container = UI.Container();
  const h1 = UI.h1("Lobbies");
  const p = UI.p("Select a lobby or create a new one");
  container.append(h1);
  container.append(p);
  const lobbyInstances = data.map(lobby => renderLobby(lobby.lobbyID, lobby.owner.image, lobby.playerCount));
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
      alert("Please select a lobby");
      return;
    }
    alert(`Joined ${selectedLobby.querySelector('p').innerText}`);
  });

  const createBtn = UI.actionButton("Create", () => {
    if (!loggedIn()) {
      alert("Please login to create a lobby");
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
    eventSource.removeEventListener('msg', handleLobbyEvents);
    eventSource.addEventListener('msg', handleLobbyEvents);
    if (loadLobbies() === null) {
      const data = await getLobbies()
      cacheLobbies(data)
    }
    const data = loadLobbies()
    return renderLobbies(data);
  }
}