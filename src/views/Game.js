import AbstractView from "./AbstractView.js";
import { getCombination } from "../utils/Calls.js";
import { getPlayerWords } from "../utils/Calls.js";
import * as UI from "../components/UI.js";
import { setEventListeners } from "../utils/EventHandling.js";
import { isOwner } from "../utils/Utility.js";
import { endGame } from "../utils/Calls.js";

function createGame() {
    const container = document.createElement('div');
    container.id = 'gamebox';
    container.classList.add('gamebox');
    const section = document.createElement('section');
    container.appendChild(section);
    const aside = document.createElement('aside');
    container.appendChild(aside);
    return container;
}

function CreateElem(name, isNew) {
    const elem = document.createElement("div");
    elem.setAttribute("data-elem", name);
    elem.classList.add("element");
    const span = document.createElement("span");
    span.innerText = name;
    elem.append(span);
    if (isNew) {
        elem.classList.add("loading");
    }
    return elem;
}

async function Merge(elemA, elemB) {
    console.log(elemA.getAttribute("data-elem"), elemB.getAttribute("data-elem"));
    const res = await getCombination(elemA.getAttribute("data-elem"), elemB.getAttribute("data-elem"));
    const word = res.result;
    const isNew = res.isNew;
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return { name: capitalized, isNew: isNew };
}

function renderBar(elem1, elem2, out) {
    const plus = document.createElement("span");
    plus.textContent = "+";
    plus.className = "symbol";

    const equals = document.createElement("span");
    equals.textContent = "=";
    equals.className = "symbol";

    const bar = document.createElement("div");
    bar.id = "bar";
    const div = document.createElement("div");
    bar.appendChild(elem1 ? elem1 : div);
    bar.appendChild(plus);
    bar.appendChild(elem2 ? elem2 : div);
    bar.appendChild(equals);
    bar.appendChild(out ? out : div);
    return bar;
}

// Renders Element list
function renderElems(state, elems) {
    state.aside.innerHTML = "";
    elems.forEach(element => {
        element = CreateElem(element.name, element.isNew);
        state.aside.appendChild(element);
    });
}

function formatList(data) {
    const list = [];
    for (const word of data) {
        const formatedWord = word.charAt(0).toUpperCase() + word.slice(1);
        list.push({ name: formatedWord, isNew: word.isNew });
    }
    return list;
}

function gameHandler(state) {
    return async (e) => {
        const copy = e.target.closest('.element');
        if (copy) {
            state.selected.push(copy.cloneNode(true));
        }
        if (state.selected.length === 2) {
            const out = await Merge(state.selected[0], state.selected[1]);
            const merged = CreateElem(out.name);
            if (!state.elems.find(elem => elem.name === out.name)) {
                state.elems.push(out);
                renderElems(state, state.elems);
            }
            state.selected.push(merged);
        }
        if (state.selected.length > 3) {
            state.selected = [];
            state.selected.push(copy.cloneNode(true));
        }
        state.section.replaceChild(renderBar(...state.selected), state.section.querySelector('#bar'));
    }
}

// Renders Game
async function renderGame(game) {
    const section = game.querySelector('section');
    const aside = game.querySelector('aside');
    const data = await getPlayerWords()
    const targetWord = data.targetWord
    const p = UI.p(`Target Word: ${targetWord}`);
    const currList = formatList(data.words);
    const state = {
        section: section,
        aside: aside,
        selected: [],
        elems: currList,
    };
    renderElems(state, currList);
    const bar = renderBar(...state.selected);
    state.section.append(bar);
    const handler = gameHandler(state);
    game.addEventListener("click", handler);
    if (targetWord.length > 0) {
        game.prepend(p);
    }
    return game;
}

function renderEndGameBtn () {
    const btn = UI.actionButton("End Game", endGame);
    btn.id = "end-game-btn";
    return btn;
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
    }

    async getHtml() {
        setEventListeners();
        const game = createGame();
        const div = document.createElement('div');
        const renderedGame = await renderGame(game);
        div.append(renderedGame);
        if (isOwner()) {
            const btn = renderEndGameBtn();
            div.append(btn);
        }
        return div;
    }
}