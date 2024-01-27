import { Menu } from "./states/menu/menu.js";

export function Game() {
    
    const states = [
        Menu()
    ]

    let currentState = 0;

    function load() {
        globalThis.res.load('fnt', 'MainFont.ttf');
        hideCursor();

        states[currentState].load();
    }
    
    function update(dt) {
        states[currentState].update(dt);
    }

    function draw() {
        states[currentState].draw();
    }

    function unload() {
        states[currentState].unload();
    }

    return {
        load,
        update,
        draw,
        unload
    }
}