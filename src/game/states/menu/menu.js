import { Sprite } from "../../../components/sprite.js";
import { EventManager } from "../../../lib/eventManager.js";

export function Menu(color = BLUE) {

    const events = new EventManager();
    const finalUnloadingX = 500;
    let sun, mousePos, hover, cursor, cursorClicking, cursorSprite, unloading, unloadingCb, unloaded;
    let unloadCounter = 0;

    function load(callback) {
        sun = Sprite({
            sheetSize: {
                width: 268,
                height: 136
            },
            frameSize: {
                width: 134,
                height: 136
            },
            numberOfFrames: 2,
            frameStart: 0,
            frameSpeed: 5,
            loop: true,
            img: 'sun.png'
        });

        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');

        callback();
    }

    function update(dt) {
        sun.update(dt);

        mousePos = globalThis.getMousePositionRelativeToTexture();

        if (!unloading) {
            const playSize = measureTextEx(globalThis.res.fnt['mainfont.fnt'], 'Play', 20, 2);
            const exitSize = measureTextEx(globalThis.res.fnt['mainfont.fnt'], 'Exit', 20, 2);

            if (checkCollisionPointRec(mousePos, new Rectangle(30, 232, playSize.x, playSize.y))) {
                hover = 1;
            }
            else if (checkCollisionPointRec(mousePos, new Rectangle(110, 232, exitSize.x, exitSize.y))) {
                hover = 2;
            }
            else {
                hover = 0;
            }

            if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
                cursorSprite = cursorClicking;
            }
            else {
                cursorSprite = cursor;
            }

            if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
                if (hover == 1) {
                    events.dispatch('change-state', 1);
                }
                else if (hover == 2) {
                    return globalThis.closeGame();
                }
            }
        }
        else if (unloading) {
            unloadCounter += 10;

            if (unloadCounter >= finalUnloadingX) {
                let cb = unloadingCb;

                unloaded = true;
                unloading = false;
                unloadingCb = null;
                unloadCounter = 0;

                return cb();
            }
        }
    }

    function draw() {
        if (!unloaded) clearBackground(color);
        else {
            return drawTexture(cursorSprite, parseInt(mousePos.x), parseInt(mousePos.y), WHITE);
        }

        sun.draw(300, 40);

        // Logo
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'A Baby', new Vector2(30, 100), 32, 2, WHITE);
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'A Shroom', new Vector2(30, 128), 32, 2, WHITE);
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'And A Slingshot', new Vector2(30, 156), 32, 2, WHITE);
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'To the Moon', new Vector2(26, 184), 32, 2, WHITE);

        // Buttons
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'Play', new Vector2(30, 232), 20, 2, hover == 1 ? globalThis.colors.YELLOW : WHITE);
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'Exit', new Vector2(110, 232), 20, 2, hover == 2 ? globalThis.colors.YELLOW : WHITE);

        // Draw rectangle that fills the screen gradually from left to right during unload
        if (unloading) {
            drawRectangle(0, 0, unloadCounter, getScreenHeight(), BLACK);
        }

        // Mouse sprite
        drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);
    }

    function unload(callback) {
        unloading = true;
        unloadingCb = callback;
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