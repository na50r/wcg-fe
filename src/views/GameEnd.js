import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { router } from "../main.js";
import { getGameStats, deleteGame } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";
import { setEventListeners } from "../utils/EventHandling.js";

function ownerAction() {
    const isOwner = localStorage.getItem("playerName") === localStorage.getItem("owner")
    if (isOwner) {
        deleteGame()
    }
    router.navigateTo(`/lobby/${localStorage.getItem("lobbyCode")}`);
}


function renderPlayer(name, image, cnt) {
  const player = document.createElement('div');
  player.classList.add('player');
  const p = UI.p(name);
  const c = UI.p(`Pts: ${cnt}`);
  const img = lobbyPicture(image);
  player.append(img, p, c);
  if (name === localStorage.getItem("playerName")) {
    player.classList.add('current');
  }
  return player;
}


function renderPlayers(data) {
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('scroll-wrapper');
  const sortedPlayers = data.playerResults.sort((a, b) => b.points - a.points);
  const players = sortedPlayers.map(player => renderPlayer(player.playerName, player.image, player.points));
  for (const player of players) {
    scrollWrapper.append(player);
  }
  return scrollWrapper;

}

function renderGameEnd(data) {
    const container = UI.Container();
    container.classList.add('game-end');
    const isWinner = data.winner === localStorage.getItem("playerName")
    const h1 = isWinner ? UI.h1("Victory") : UI.h1("Defeat");
    const btn = UI.actionButton("Back to Lobby", ownerAction);
    const players = renderPlayers(data);
    container.append(h1, players, btn);
    return container;
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game End");
    }

    async getHtml() {
        setEventListeners();
        const data = await getGameStats()
        return renderGameEnd(data);
    }
}
