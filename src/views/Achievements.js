import AbstractView from "./AbstractView.js";
import * as UI from "../components/UI.js";
import { getAchievements } from "../utils/Calls.js";
import { lobbyPicture } from "../components/Images.js";
import { cacheData, loadData } from "../utils/Utility.js"


function renderEntry(title, desc, image, unlocked) {
    const entry = document.createElement('div');
    entry.classList.add('entry');
    if (!unlocked) {
        entry.classList.add('blurred');
    }
    const img = lobbyPicture(image);
    const p1 = UI.p(`${title}`);
    const p2 = UI.p(`${desc}`);
    entry.append(img, p1, p2);
    return entry;
}

function renderAchievements(data) {
    const container = UI.Container();
    container.classList.add('achievements');
    const h1 = UI.h1("Achievements");
    container.append(h1);
    const entries = data.map(entry => renderEntry(entry.title, entry.description, entry.image, entry.unlocked));
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
        this.setTitle("Achievements");
    }

    async getHtml() {
        var data = loadData("achievements");
        if (!data) {
            data = await getAchievements();
            cacheData(data, "achievements");
        }
        return renderAchievements(data);
    }
}
