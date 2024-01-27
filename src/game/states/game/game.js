import { EventManager } from "../../../lib/eventManager.js";
import { Player } from "../../../components/player.js";

export function Game() {
    const events = new EventManager();
    const clickOffeset = new Vector2(-20, -60);
    
    let circleRadius = 15;
    let mousePos, cursor, cursorClicking, cursorSprite, cameraTarget, player, camera, bg, movementPos;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');
        player = new Player();
        camera = new Camera2D(new Vector2(480 / 2.0, 270 / 2.0), new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)
        bg = globalThis.res.load('img', 'bgtest.png');

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
            movementPos = getScreenToWorld2D(mousePos, camera);
            movementPos.x += clickOffeset.x;
            movementPos.y += clickOffeset.y;
            circleRadius = 15;
        }

        if (movementPos) {
            if (circleRadius > 0) circleRadius--;

            const speed = 2;
            const dx = movementPos.x - player.x;
            const dy = movementPos.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const vx = dx / dist * speed;
            const vy = dy / dist * speed;
            player.x += vx;
            player.y += vy;
            player.walking = true;
            if (dist < 2) {
                movementPos = null;
                player.walking = false;
                circleRadius = 15;
            }

            if (dx > 0) {
                player.direction = 0;
            }
            else {
                player.direction = 1;
            }
        }

        cameraTarget = new Vector2(player.x + 20, player.y + 20);
        camera.target = cameraTarget;
        camera.zoom += (getMouseWheelMove()*0.05);

        player.update(dt);
    }

    function draw() {
        clearBackground(BLACK);

        beginMode2D(camera);
            drawTexturePro(bg, new Rectangle(0, 0, bg.width, bg.height), new Rectangle(0, 0, bg.width, bg.height), new Vector2(bg.width/2, bg.height/2), 0, WHITE);
            
            if (movementPos) {
                drawCircleLines(movementPos.x - clickOffeset.x, movementPos.y - clickOffeset.y, circleRadius, WHITE);
            }
            
            player.draw();
            /* drawLine(cameraTarget.x, -270*10, cameraTarget.x, 270*10, GREEN);
            drawLine(-480*10, cameraTarget.y, 480*10, cameraTarget.y, GREEN); */
        endMode2D();

        // Mouse sprite
        drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);
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