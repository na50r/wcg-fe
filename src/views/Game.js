import AbstractView from "./AbstractView.js";
import { getCombination } from "../utils/Calls.js";
import { getPlayerWords } from "../utils/Calls.js";
import * as UI from "../components/UI.js";

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

function CreateElem(name) {
    const elem = document.createElement("div");
    elem.setAttribute("data-elem", name);
    elem.classList.add("element");
    const span = document.createElement("span");
    span.innerText = name;
    elem.append(span);
    return elem;
}

async function Merge(elemA, elemB) {
    console.log(elemA.getAttribute("data-elem"), elemB.getAttribute("data-elem"));
    const res = await getCombination(elemA.getAttribute("data-elem"), elemB.getAttribute("data-elem"));
    const capitalized = res.charAt(0).toUpperCase() + res.slice(1);
    return { name: capitalized };
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
        element = CreateElem(element.name);
        state.aside.appendChild(element);
    });
}

function formaList(data) {
    const list = [];
    for (const word of data) {
        const formatedWord = word.charAt(0).toUpperCase() + word.slice(1);
        list.push({ name: formatedWord });
    }
    return list;
}

function createHandler(state) {
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
    const currList = formaList(data.words);
    const state = {
        section: section,
        aside: aside,
        selected: [],
        elems: currList,
    };
    renderElems(state, currList);
    const bar = renderBar(...state.selected);
    state.section.append(bar);
    const handler = createHandler(state);
    game.addEventListener("click", handler);
    if (targetWord.length > 0) {
        game.prepend(p);
    }
    return game;
}

function renderTimer() {
    const h3 = document.createElement('h3');
    h3.id = "timer-popup";
    h3.innerText = "Timer";
    return h3;
}

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Game");
    }

    async getHtml() {
        const game = createGame();
        const div = document.createElement('div');
        const h3 = renderTimer();
        const renderedGame = await renderGame(game);
        div.append(h3, renderedGame);
        return div;
    }
}