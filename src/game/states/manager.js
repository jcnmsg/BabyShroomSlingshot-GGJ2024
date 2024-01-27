import { Menu } from "./menu/menu.js";

let loadState = 0;
let currentState = -1;

const states = [
    Menu(),
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

function update(dt) {
    if (loadState != currentState) {
        if (currentState != -1) {
            states[currentState].unload();
        }

        states[loadState].load(loadedCallback);
    }
}

export const manager = {
    setState,
    update,
    get states() {
        return states;
    },
    get currentState() {
        return currentState;
    }
}