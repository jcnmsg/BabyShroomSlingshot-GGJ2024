import { manager } from "./states/manager.js";

export function Game() {
    function load() {
        globalThis.res.load('fnt', 'MainFont.ttf');
        hideCursor();

        manager.setState(0);
    }
    
    function update(dt) {
        manager.update(dt);
        manager.states[manager.currentState].update(dt);
    }

    function draw() {
        manager.states[manager.currentState].draw();
    }

    function unload() {
       manager.states[manager.currentState].unload();
    }

    return {
        load,
        update,
        draw,
        unload
    }
}