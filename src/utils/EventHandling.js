import { router } from "../main.js";
import { isOwner } from "./Utility.js";
import { eventSource } from "../main.js";
import { Navbar } from "../components/Navbar.js";


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


export function handleLobbyEvents(event) {
  let data = JSON.parse(event.data)
  console.log(data)
  if (data === "PLAYER_JOINED" || data === "LOBBY_CREATED" || data === "PLAYER_LEFT") {
    updateLobbyEvent();
    router.navigate();
  }
  if (data === "LOBBY_DELETED") {
    deleteLobbyEvent();
    router.navigateTo("/lobbies");
    router.navigate();
  }
  if (data.gameMode !== undefined && !isOwner()) {
    console.log("Game mode changed");
    const table = document.getElementById("gameModes");
    console.log("Table:", table);
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
  if (data === "GAME_STARTED") {
    localStorage.setItem("game", true)
    router.navigateTo("/game");
    router.navigate();
    Navbar()
  }
  if (data === "GAME_OVER") {
    localStorage.removeItem("game")
    router.navigateTo(`/game/end`);
    router.navigate();
    Navbar()
  }
}

export function setLobbyEventListener() {
  eventSource.addEventListener('msg', handleLobbyEvents);
}