import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getLobby } from "../utils/Calls.js";
import { leaveLobby } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";
import { setLobbyEventListener } from "../utils/EventHandling.js";
import { changeGameMode } from "../utils/Calls.js";
import { isOwner } from "../utils/Utility.js";
import { startGame } from "../utils/Calls.js";

function cacheLobby(data) {
  localStorage.setItem("lobby", JSON.stringify(data))
}

function loadLobby() {
  const lobby = localStorage.getItem("lobby")
  if (!lobby) return null;
  return JSON.parse(lobby)
}

function renderPlayer(name, image) {
  const player = document.createElement('div');
  player.classList.add('player');
  const p = UI.p(name);
  const img = lobbyPicture(image);
  player.append(img, p);
  return player;
}

function renderPlayers(data) {
  const h3 = document.createElement('h3');
  h3.innerText = "Players";
  const container = UI.Container();
  container.classList.add('players');
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('scroll-wrapper');
  container.append(h3);
  const players = data.players.map(player => renderPlayer(player.name, player.image));
  for (const player of players) {
    scrollWrapper.append(player);
  }
  container.append(scrollWrapper);
  return container;
}

function renderGameModes(gameModes) {
  const table = document.createElement('table');
  table.id = "gameModes"
  for (const mode of gameModes) {
    const row = UI.row([UI.column(mode)]);
    row.setAttribute("data-mode", mode);
    table.append(row);
  }
  return table;
}

function renderGameModesForOwner(gameModes) {
  var selectedMode = null;
  const table = document.createElement('table');
  table.id = "gameModes";
  for (const mode of gameModes) {
    const row = UI.row([UI.column(mode)]);
    row.setAttribute("data-mode", mode);

    row.addEventListener('click', (event) => {
      event.preventDefault();
      if (selectedMode) {
        selectedMode.classList.remove('selected');
      }
      row.classList.add('selected');
      selectedMode = row;
      changeGameMode(mode);
    });

    table.append(row);
  }

  return table;
}


function renderMenu(data) {
  const container = UI.Container();
  const h3 = document.createElement('h3');
  h3.innerText = "Game Modes";
  container.classList.add('menu');
  const gameModes = data.gameModes;
  var table = null;
  if (isOwner()) {
    table = renderGameModesForOwner(gameModes);
  } else {
    table = renderGameModes(gameModes);
  }
  container.append(h3, table);
  return container;
}

async function renderLobby(data) {
  const container = UI.Container();
  const h1 = UI.h1(data.name);
  const p = UI.p("Time to play");
  const playerContainer = renderPlayers(data);
  const menuContainer = renderMenu(data);
  const containers = document.createElement('div');
  containers.classList.add('lobby');
  containers.append(playerContainer, menuContainer);
  container.append(h1, p, containers);
  const leaveBtn = UI.actionButton("Leave", leaveLobby);
  const startBtn = UI.actionButton("Start", startGame);
  if (!isOwner()) {
    startBtn.disabled = true;
  }
  const btnBar = UI.buttonBar([startBtn, leaveBtn]);
  container.append(btnBar);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.lobbyCode = params.lobbyCode
    this.setTitle(`Lobby ${this.params.lobbyCode}`);
  }

  async getHtml() {
    setLobbyEventListener();
    const lobbyCode = this.lobbyCode
    const playerName = localStorage.getItem("playerName")
    const playerToken = localStorage.getItem("playerToken")
    if (loadLobby() === null) {
      const data = await getLobby(lobbyCode, playerName, playerToken)
      cacheLobby(data)
    }
    const data = loadLobby()
    return renderLobby(data);
  }
}
