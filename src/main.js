import Login from './views/Login.js'
import Router from './routing/Router.js'
import Lobby from './views/Lobby.js'
import Register from './views/Register.js'
import Account from './views/Account.js'
import Logout from './views/Logout.js'

import { Navbar } from './components/Navbar.js';
import './style.css'

const routes = [
  { path: "/", view: Lobby },
  { path: "/login", view: Login },
  { path: "/register", view: Register },
  { path: "/lobby", view: Lobby },
  { path: "/logout", view: Logout },
  { path: "/account/:username", view: Account },
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
document.addEventListener("DOMContentLoaded", navBehaviour);






