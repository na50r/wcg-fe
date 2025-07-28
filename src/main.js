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
import { initOrUpdateEventSource } from './utils/EventHandling.js';
import { Navbar, navBehaviour } from './components/Navbar.js';
import './style.css'

var routes = [
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

document.addEventListener("load", Navbar);
document.addEventListener("DOMContentLoaded", () => { initOrUpdateEventSource(), Navbar(), navBehaviour() });