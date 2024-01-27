import { EventManager } from "../../../lib/eventManager.js";

export function Game() {
    const events = new EventManager();

    let mousePos, cursor, cursorClicking, cursorSprite;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');

        callback();
    }

    function update(dt) {
        mousePos = globalThis.getMousePositionRelativeToTexture();

        if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            cursorSprite = cursorClicking;
        }
        else {
            cursorSprite = cursor;
        }

        if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
            
        }
    }

    function draw() {
        clearBackground(BLUE);

        // Mouse sprite
        drawTexture(cursorSprite, parseInt(mousePos.x), parseInt(mousePos.y), WHITE);
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