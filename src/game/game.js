import { manager } from "./states/manager.js";

export function Game() {
    function load() {
        globalThis.res.load('fnt', 'MainFont.ttf');
        hideCursor();

        manager.setState(0);
    }
    
    function update(dt) {
        manager.update(dt);

        if (isKeyPressed(KEY_RIGHT)) {
            manager.setState(manager.currentState+1);
        }
        else if (isKeyPressed(KEY_LEFT)) {
            manager.setState(manager.currentState-1);
        }
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