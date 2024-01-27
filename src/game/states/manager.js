import { Menu } from "./menu/menu.js";
import { Game } from "./game/game.js";

let loadState = 0;
let unloadState = -1;
let currentState = -1;
let unloadNextTick;

const states = [
    Menu(),
    Game(),
]

function setState(s) {
    if (currentState != s) {
        loadState = s;
    }

    states[currentState]?.off('change-state');
}

function loadedCallback() {
    currentState = loadState;

    states[currentState].on('change-state', setState);

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