import { manager } from "./states/manager.js";

export function Game() {
    function load() {
        globalThis.res.load('fnt', 'mainfont.fnt');
        hideCursor();

        manager.setState(0);
    }
    
    function update(dt) {
        manager.update(dt);
    }

    function draw() {
        manager.draw();
    }

    function unload() {
       manager.unload();
    }

    return {
        load,
        update,
        draw,
        unload
    }
}