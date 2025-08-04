import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getLobby } from "../utils/Calls.js";
import { leaveLobby } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";
import { setEventListeners } from "../utils/EventHandling.js";
import { editGame } from "../utils/Calls.js";
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
  const container = document.createElement('div');
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
      editGame(mode, -1);
    });

    table.append(row);
  }

  return table;
}

function renderTimer() {
  const div = document.createElement('div');
  div.classList.add('timer');
  const h3 = document.createElement('h3');
  h3.innerText = "Timer";
  const selection = renderSelection(5);
  div.append(h3, selection);
  return div;
}

function renderSelection(duration) {
  const div = document.createElement('div');
  div.classList.add('custom-select');
  const select = document.createElement('select');
  select.id = "duration-select"
  const noneOpt = document.createElement('option');
  noneOpt.value = 0;
  noneOpt.text = "None";
  select.append(noneOpt);
  for (let i = 1; i <=duration; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.text = `${i}min`;
    select.append(option);
  }
  select.value = 0;
  div.append(select);
  select.addEventListener('change', (event) => {
    event.preventDefault();
    editGame('', Number(select.value));
  });
  if (!isOwner()) {
    select.disabled = true;
  }
  return div;
}


function renderMenu(data) {
  const container = document.createElement('div');
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
  const timer = renderTimer();
  container.append(h3, table, timer);
  return container;
}

async function renderLobby(data) {
  const container = document.createElement('div');
  container.classList.add('lobby-view');
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
    setEventListeners();
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
