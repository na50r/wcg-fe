import { router, eventSource } from "../main.js";

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
  if (data.gameMode !== undefined) {
    const playerName = localStorage.getItem("playerName");
    const ownerName = localStorage.getItem("owner");
    if (playerName === ownerName) return;

    const table = document.getElementById("gameModes");
    if (!table) return;

    const rows = table.querySelectorAll("tr");
    for (const row of rows) {
      if (row.innerText.trim() === data.gameMode) {
        row.classList.add("selected");
      } else {
        row.classList.remove("selected");
      }
    }
  }
}

export function setLobbyEventListener() {
  eventSource.removeEventListener('msg', handleLobbyEvents);
  eventSource.addEventListener('msg', handleLobbyEvents);
}