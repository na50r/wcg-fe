import { router } from "../main.js";
import { isOwner } from "./Utility.js";
import { Navbar } from "../components/Navbar.js";
import { renderTimer } from "../components/Timer.js";
import { EventSource } from 'extended-eventsource';
import { showAlert } from "./Calls.js";

const API = import.meta.env.VITE_API;
var eventSource = new EventSource(`${API}/events`);
export function initOrUpdateEventSource() {
  const playerToken = localStorage.getItem("playerToken")
  if (eventSource !== null) {
    eventSource.close();
  }
  if (playerToken) {
    eventSource = new EventSource(`${API}/events`, {
      headers: {
        "Authorization": `Bearer ${playerToken}`
      }
    });
  } else {
    eventSource = new EventSource(`${API}/events`);
  }
  localStorage.removeItem("serverDown")
  Navbar()
  
  eventSource.onerror = () => {
    console.log("Connection Failed");
    localStorage.setItem("serverDown", true)
    router.navigateTo("/server-down");
    router.navigate();
    Navbar()
  };
}

const EventMessage = {
  PLAYER_JOINED: "PLAYER_JOINED",
  LOBBY_CREATED: "LOBBY_CREATED",
  PLAYER_LEFT: "PLAYER_LEFT",
  LOBBY_DELETED: "LOBBY_DELETED",
  GAME_STARTED: "GAME_STARTED",
  GAME_OVER: "GAME_OVER",
  GAME_DELETED: "GAME_DELETED",
  ACCOUNT_UPDATE: "ACCOUNT_UPDATE",
  WOMBO_COMBO_EVENT: "WOMBO_COMBO",
}

export function deleteLobbyEvent() {
  localStorage.removeItem("lobbies")
  localStorage.removeItem("lobbyCode")
  localStorage.removeItem("playerName")
  localStorage.removeItem("playerToken")
  localStorage.removeItem("lobby")
}

export function updateLobbyEvent() {
  localStorage.removeItem("lobby")
  localStorage.removeItem("lobbies")
}

export function updateGameMode() {
  localStorage.removeItem("lobby")
}


export function handleEvents(event) {
  let data = JSON.parse(event.data)
  console.log(data)
  if (data === EventMessage.PLAYER_JOINED || data === EventMessage.LOBBY_CREATED || data === EventMessage.PLAYER_LEFT) {
    updateLobbyEvent();
    router.navigate();
  }
  if (data === EventMessage.LOBBY_DELETED) {
    deleteLobbyEvent();
    router.navigateTo("/lobbies");
    router.navigate();
  }

  if (data.secondsLeft !== undefined) {
    renderTimer(data.secondsLeft)
  }

  if (data.achievementTitle !== undefined) {
    showAlert(`Achievement Unlocked: ${data.achievementTitle}`)
  }


  if (data === EventMessage.GAME_STARTED) {
    localStorage.setItem("game", true)
    router.navigateTo("/game");
    router.navigate();
    Navbar()
  }

  if (data === EventMessage.WOMBO_COMBO_EVENT) {
    // Player reached one target words; re-render game to load new target word
    router.navigate()
  }

  if (data === EventMessage.GAME_OVER) {
    localStorage.removeItem("game")
    router.navigateTo(`/game/end`);
    router.navigate();
    Navbar()
  }
  if (data === EventMessage.GAME_DELETED) {
    router.navigateTo(`/lobby/${localStorage.getItem("lobbyCode")}`);
    router.navigate();
    Navbar()
  }
  if (data === EventMessage.LOBBY_DELETED) {
    localStorage.removeItem("lobbyCode")
    localStorage.removeItem("playerName")
    localStorage.removeItem("playerToken")
    localStorage.removeItem("lobby")
    router.navigateTo("/lobbies");
    router.navigate();
    Navbar()
  }
  if (data === EventMessage.ACCOUNT_UPDATE) {
    localStorage.removeItem("account")
  }
  if (data.gameMode !== '' && !isOwner()) {
    const table = document.getElementById("gameModes");
    if (!table) return;
    const rows = table.querySelectorAll("tr");
    for (const row of rows) {
      if (row.getAttribute("data-mode") === data.gameMode) {
        row.classList.add("selected");
      } else {
        row.classList.remove("selected");
      }
    }
  }

  if (data.duration !== -1 && !isOwner()) {
    const select = document.getElementById("duration-select");
    select.value = data.duration;
  }
}



export function setEventListeners() {
  eventSource.addEventListener('msg', handleEvents);
}