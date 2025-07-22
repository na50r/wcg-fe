import Login from './views/Login.js'
import Router from './routing/Router.js'
import Lobbies from './views/Lobbies.js'
import Register from './views/Register.js'
import Account from './views/Account.js'
import Logout from './views/Logout.js'
import CreateLobby from './views/CreateLobby.js'
import Lobby from './views/Lobby.js'
import Game from './views/Game.js'
import GameEnd from './views/GameEnd.js'

import { EventSource } from 'extended-eventsource';

const API = import.meta.env.VITE_API;
export var eventSource = new EventSource(`${API}/events/lobbies`);
export function initOrUpdateEventSource() {
  if (eventSource !== null) {
    eventSource.close();
  }
  const playerToken = localStorage.getItem("playerToken")
  if (playerToken !== null) {
    eventSource = new EventSource(`${API}/events/lobbies`, {
      headers: {
        "Authorization": `${playerToken}`
      }
    });
  } else {
    eventSource = new EventSource(`${API}/events/lobbies`);
  }
}

import { Navbar } from './components/Navbar.js';
import './style.css'


const routes = [
  { path: "/", view: Lobbies },
  { path: "/login", view: Login },
  { path: "/register", view: Register },
  { path: "/lobbies", view: Lobbies },
  { path: "/logout", view: Logout },
  { path: "/account/:username", view: Account },
  { path: "/lobby", view: CreateLobby },
  { path: "/lobby/:lobbyCode", view: Lobby },
  { path: "/game", view: Game },
  { path: "/game/end", view: GameEnd },
]

export const router = new Router(routes)
router.start()

function navBehaviour() {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      console.log(e.target.href)
      router.navigateTo(e.target.href)
    }
  })
}

document.addEventListener("DOMContentLoaded", Navbar);
document.addEventListener("load", Navbar);
document.addEventListener("DOMContentLoaded", navBehaviour);
document.addEventListener("DOMContentLoaded", initOrUpdateEventSource);