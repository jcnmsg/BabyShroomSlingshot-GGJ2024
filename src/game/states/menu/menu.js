import { Sprite } from "../../../components/sprite.js";

export function Menu(color = BLUE) {

    const finalUnloadingY = 260;
    let sun, mousePos, hover, cursor, cursorClicking, cursorSprite, unloading, unloadingCb;
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

        const playSize = measureTextEx(globalThis.res.fnt['MainFont.ttf'], 'Play', 20, 0);
        const exitSize = measureTextEx(globalThis.res.fnt['MainFont.ttf'], 'Exit', 20, 0);

        if (checkCollisionPointRec(mousePos, new Rectangle(30, 232, playSize.x, playSize.y))) {
            hover = 1;
        }
        else if (checkCollisionPointRec(mousePos, new Rectangle(100, 232, exitSize.x, exitSize.y))) {
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
                
            }
            else if (hover == 2) {
                return globalThis.closeGame();
            }
        }

        if (unloading) {
            unloadCounter+=90*dt;

            if (unloadCounter >= finalUnloadingY) {
                let cb = unloadingCb;
                
                unloading = false;
                unloadingCb = null;
                unloadCounter = 0;
                
                return cb();
            }
        }
    }

    function draw() {
        clearBackground(color);
        sun.draw(300, 20 - unloadCounter);

        // Logo
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'A Baby', new Vector2(30, 100 - unloadCounter), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'A Shroom', new Vector2(30, 128 - unloadCounter), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'And A Slingshot', new Vector2(30, 156 - unloadCounter), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'To the Moon', new Vector2(26, 184 - unloadCounter), 32, 0, WHITE);

        // Buttons
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'Play', new Vector2(30, 232 - unloadCounter), 20, 0, hover == 1 ? globalThis.colors.YELLOW : WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'Exit', new Vector2(100, 232 - unloadCounter), 20, 0, hover == 2 ? globalThis.colors.YELLOW : WHITE);
    
        // Mouse sprite
        drawTextureEx(cursorSprite, new Vector2(parseInt(mousePos.x) - 6, parseInt(mousePos.y)), 0, 1, WHITE);
    }

    function unload(callback) {
        unloading = true;        
        unloadingCb = callback;
    }

    return {
        load,
        update,
        draw,
        unload
    }
}