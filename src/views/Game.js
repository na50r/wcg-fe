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
    const ctable = renderCtable()
    container.appendChild(ctable);
    const inventory = document.createElement('div');
    inventory.classList.add('inventory');
    container.appendChild(inventory);
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

function renderCtable(elem1, elem2, out) {
    const plus = document.createElement("span");
    plus.textContent = "+";
    plus.className = "symbol";

    const equals = document.createElement("span");
    equals.textContent = "=";
    equals.className = "symbol";

    const ctable = document.createElement("div");
    ctable.classList.add("crafting-table");
    const div = document.createElement("div");
    ctable.appendChild(elem1 ? elem1 : div);
    ctable.appendChild(plus);
    ctable.appendChild(elem2 ? elem2 : div);
    ctable.appendChild(equals);
    ctable.appendChild(out ? out : div);
    return ctable

}

// Renders Element list
function renderElems(state, elems) {
    state.inventory.innerHTML = "";
    elems.forEach(element => {
        element = CreateElem(element.name, element.isNew);
        state.inventory.appendChild(element);
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

function updateCtable(oldCT, newCT) {
    oldCT.innerHTML = ''
    while (newCT.firstChild) {
        oldCT.appendChild(newCT.firstChild)
    }
    oldCT.scrollTo(
        {
            left: oldCT.scrollWidth,
            behavior: 'smooth'
        }
    )
}

function createGameHandler(state) {
    return async (e) => {
        const copy = e.target.closest('.element');
        if (copy) {
            state.selected.push(copy.cloneNode(true));
        }
        if (state.selected.length === 2) {
            const result = await Merge(state.selected[0], state.selected[1]);
            const merged = CreateElem(result.name);

            // Real time update of inventory
            if (!state.elems.find(elem => elem.name === result.name)) {
                state.elems.push(result);
                renderElems(state, state.elems);
            }
            state.selected.push(merged);
        }
        if (state.selected.length > 3) {
            state.selected = [];
            state.selected.push(copy.cloneNode(true));
        }
        const oldCtable = state.ctable;
        const newCtable = renderCtable(...state.selected)
        updateCtable(oldCtable, newCtable)
    }
}

// Renders Game
async function renderGame(game) {
    const ctable = game.querySelector('.crafting-table');
    const inventory = game.querySelector('.inventory');
    const data = await getPlayerWords()
    const targetWord = data.targetWord
    const p = UI.p(`Target Word: ${targetWord}`);
    const currList = formatList(data.words);
    const state = {
        ctable: ctable,
        inventory: inventory,
        selected: [],
        elems: currList,
    };
    renderElems(state, currList);
    const handler = createGameHandler(state);
    game.addEventListener("click", handler);
    if (targetWord.length > 0) {
        game.prepend(p);
    }
    return game;
}

function renderEndGameBtn() {
    const trigger = document.createElement('div');
    trigger.id = "end-game-btn-trigger";
    const btn = UI.actionButton("End Game", endGame);
    btn.id = "end-game-btn";
    trigger.append(btn);
    return trigger;
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