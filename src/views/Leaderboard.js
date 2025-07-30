import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getLeaderboard } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";


function renderEntry(name, wordCount, image) {
  const entry = document.createElement('div');
  entry.classList.add('entry');
  const img = lobbyPicture(image);
  const p = UI.p(`${name}`);
  const combined = UI.p(`Combined: ${wordCount}`);
  entry.append(img, p, combined);
  return entry;
}

function renderLeaderboard(data) {
  const container = UI.Container();
  container.classList.add('leaderboard');
  const h1 = UI.h1("Leaderboard");
  container.append(h1);
  const entries = data.map(entry => renderEntry(entry.username, entry.wordCount, entry.image));
  const scrollWrapper = document.createElement('div');
  scrollWrapper.classList.add('scroll-wrapper');
  for (const entry of entries) {
    scrollWrapper.append(entry);
  }
  container.append(scrollWrapper);
  return container;
}

export default class extends AbstractView {
  constructor(params) {
    super(params);
    this.setTitle("Leaderboard");
  }

  async getHtml() {
    const data = await getLeaderboard()
    return renderLeaderboard(data);
  }
}
