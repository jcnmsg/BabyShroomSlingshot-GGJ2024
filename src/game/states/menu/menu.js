import { Sprite } from "../../../components/sprite.js";

export function Menu() {

    let sun, mousePos, hover, cursor, cursorClicking, cursorSprite;

    function load() {
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
    }

    function update(dt) {
        sun.update(dt);

        mousePos = globalThis.getMousePositionRelativeToTexture();

        const playSize = measureTextEx(globalThis.res.fnt['MainFont.ttf'], 'Play', 20, 0);
        const exitSize = measureTextEx(globalThis.res.fnt['MainFont.ttf'], 'Exit', 20, 0);

        if (checkCollisionPointRec(mousePos, new Rectangle(30, 90+10+28+28+28+48, playSize.x, playSize.y))) {
            hover = 1;
        }
        else if (checkCollisionPointRec(mousePos, new Rectangle(100, 90+10+28+28+28+48, exitSize.x, exitSize.y))) {
            hover = 2;
        }
        else {
            hover = 0;
        }

        if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            cursorSprite = cursorClicking;

            if (hover == 1) {
                
            }
            else if (hover == 2) {
                return globalThis.closeGame();
            }
        }
        else {
            cursorSprite = cursor;
        }
    }

    function draw() {
        clearBackground(BLUE);
        sun.draw(300, 20);

        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'A Baby', new Vector2(30, 90 + 10), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'A Shroom', new Vector2(30, 90 + 10 + 28), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'And A Slingshot', new Vector2(30, 90 + 10 + 28 + 28), 32, 0, WHITE);
        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'To the Moon', new Vector2(26, 90 + 10 + 28 + 28 + 28), 32, 0, WHITE);

        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'Play', new Vector2(30, 90 + 10 + 28 + 28 + 28 + 48), 20, 0, hover == 1 ? globalThis.colors.YELLOW : WHITE);

        drawTextEx(globalThis.res.fnt['MainFont.ttf'], 'Exit', new Vector2(100, 90 + 10 + 28 + 28 + 28 + 48), 20, 0, hover == 2 ? globalThis.colors.YELLOW : WHITE);
    
        drawTextureEx(cursorSprite, new Vector2(mousePos.x - 6, mousePos.y), 0, 1, WHITE);
    }

    function unload() {

    }

    return {
        load,
        update,
        draw,
        unload
    }
}