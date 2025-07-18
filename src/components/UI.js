export function actionButton(text, action = function() {}, type="button") {
    const btn = document.createElement('button');
    btn.innerText = text;
    btn.onclick = action;
    btn.classList.add('btn');
    btn.type = type;
    return btn;
}

export function Container() {
    const container = document.createElement('div');
    container.classList.add('container');
    return container;
}

export function h1(text) {
    const h1 = document.createElement('h1');
    h1.innerText = text;
    return h1;
}

export function h2(text) {
    const h2 = document.createElement('h2');
    h2.innerText = text;
    return h2;
}

export function column(text) {
    const col = document.createElement('td');
    col.classList.add('col');
    col.innerText = text;
    return col;
}

export function row(cols) {
    const row = document.createElement('tr');
    row.classList.add('row');
    row.append(...cols)
    return row;
}

export function form(action= function() {}) {
    const form = document.createElement('form');
    form.addEventListener('submit', action);
    return form;
}

export function buttonBar(btns) {
    const bar = document.createElement('div');
    bar.classList.add('btn-bar');
    bar.append(...btns);
    return bar;
}

export function input(name, placeholder, type="text") {
    const input = document.createElement('input');
    input.name = name;
    input.placeholder = placeholder;
    input.type = type;
    return input;
}