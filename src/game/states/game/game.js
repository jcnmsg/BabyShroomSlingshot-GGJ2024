import { EventManager } from "../../../lib/eventManager.js";

export function Game() {
    const events = new EventManager();
    
    function load(callback) {
        callback();
    }

    function update(dt) {
        
    }

    function draw() {
        clearBackground(BLUE);
    }

    function unload() {
        
    }

    return {
        load,
        update,
        draw,
        unload,
        on: events.on,
        off: events.off
    }
}