import { Menu } from "./menu/menu.js";

let loadState = 0;
let unloadState = -1;
let currentState = -1;
let unloadNextTick;

const states = [
    Menu(),
    Menu(YELLOW),
    Menu(RED),
]

function setState(s) {
    if (currentState != s) {
        loadState = s;
    }
}

function loadedCallback() {
    currentState = loadState;

    return states[currentState];
}

function unloadedCallback() {
    unloadNextTick = true;
}

function update(dt) {
    if (loadState != currentState) {
        if (currentState != -1 && unloadState != currentState) {
            unloadState = currentState;
            states[currentState].unload(unloadedCallback);
        }
        else if (currentState == -1) {
            states[loadState].load(loadedCallback);
        }
    }

    if (unloadNextTick) {
        unloadNextTick = false;
        states[loadState].load(loadedCallback);
    }

    states[currentState].update(dt);
}

function draw() {
    states[currentState].draw();
}

function unload() {
    states[currentState].unload();
}

export const manager = {
    setState,
    update,
    draw,
    unload,
    get states() {
        return states;
    },
    get currentState() {
        return currentState;
    }
}