import { EventManager } from "../../../lib/eventManager.js";
import { Player } from "../../../components/player.js";
import { GameObject } from "../../../components/object.js";
import { Dialog } from "../../../components/dialog.js";
import { HUD } from "../../../components/hud.js";

export function Game() {
    const events = new EventManager();
    const clickOffset = new Vector2(-20, -60);
    const objects = [];
    const dialogs = [];

    let circleRadius = 15;
    let mousePos, cursor, cursorClicking, cursorSprite, cameraTarget, player, camera, bg, movementPos, currentlyHolding, hud, finishEntity;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');
        player = new Player();
        camera = new Camera2D(new Vector2(480 / 2.0, 270 / 2.0), new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)
        bg = globalThis.res.load('img', 'bg.png');

        objects.push(new GameObject({
            img: 'tennisball.png',
            boundingBox: new Rectangle(-257, -200, 17, 16),
            hud: 'hud_ball.png',
        }));

        objects.push(new GameObject({
            img: 'scissors.png',
            boundingBox: new Rectangle(538, -233, 53, 69),
            requires: 1,
            pickable: true,
            usable: false,
            hud: 'hud_scissors.png'
        }));

        objects.push(new GameObject({
            img: 'doggo.png',
            boundingBox: new Rectangle(528, -235, 84, 101),
            requires: objects[0],
            pickable: false,
            dialogs: [
                '\n  Get lost kiddo!',
                '  I\'m not letting \nyou pass, midget!... \n  I mean, woof!',
                '        Wait! \nHow can you even \n  understand me?!'
            ],
            endDialog: "  Whatchu doin' \n  with MY BALL?!\n  Give it here!!",
            dialogPortrait: 'doggo-portrait.png'
        }));

        objects.push(new GameObject({
            img: 'lawnmower.png',
            boundingBox: new Rectangle(491, -137, 274, 223),
            pickable: false,
            usable: true
        }));

        objects.push(new GameObject({
            img: 'doghouse.png',
            boundingBox: new Rectangle(-369, -289, 107, 125),
            pickable: false,
            usable: false
        }));

        objects.push(new GameObject({
            img: 'balls.png',
            boundingBox: new Rectangle(233, -322, 38, 43),
            pickable: false,
            usable: false
        }));

        objects.push(new GameObject({
            img: 'cat.png',
            boundingBox: new Rectangle(-367, -156, 56, 66),
            requires: 1,
            pickable: false,
            usable: false,
            dialogs: [
                '\n       Meow!',
            ],
            dialogPortrait: 'cat-portrait.png'
        }));

        objects.push(GameObject({
            img: 'fence-near.png',
            boundingBox: new Rectangle(-91, -99, 956, 623),
            pickable: false,
            ignore: true,
            usable: false
        }));

        objects.push(GameObject({
            img: 'swing.png',
            boundingBox: new Rectangle(-83, -485, 266, 236),
            pickable: false,
            ignore: true,
            usable: false
        }));

        objects.push(new GameObject({
            img: 'house.png',
            boundingBox: new Rectangle(-1068, -101, 1025, 857),
            ignore: true,
            pickable: false,
            usable: false
        }));

        hud = new HUD();

        callback();
    }

    function update(dt) {
        mousePos = globalThis.getMousePositionRelativeToTexture();

        // Place objects, remove after debug
        /* if (isKeyDown(KEY_LEFT)) {
            objects[objects.length - 1].x--;
        }
        if (isKeyDown(KEY_RIGHT)) {
            objects[objects.length - 1].x++;
        }
        if (isKeyDown(KEY_UP)) {
            objects[objects.length - 1].y--;
        }
        if (isKeyDown(KEY_DOWN)) {
            objects[objects.length - 1].y++;
        } */

        if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            cursorSprite = cursorClicking;
        }
        else {
            cursorSprite = cursor;
        }

        if (dialogs.length && !dialogs[0].dismissed) {
            if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
                dialogs[0].dismiss();
                dialogs.shift();
            }

            movementPos = null;
            player.walking = false;
            circleRadius = 15;
            return;
        }
        else {
            if (finishEntity) {
                finishEntity.setDone();
                finishEntity = null;
                currentlyHolding = null;
                hud.reset();
            }

            let triggeredDialog = false;
            let collidingObj = false;

            if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
                for (let obj of objects) {
                    const objPos = getWorldToScreen2D(obj.position, camera);

                    if (checkCollisionPointRec(mousePos, new Rectangle(objPos.x, objPos.y, obj.box.x, obj.box.y))) {
                        if(!obj.ignore && !obj.done) collidingObj = obj;
                    }
                }

                if (!collidingObj) {
                    circleRadius = 15;
                }
                else {
                    circleRadius = 0;
                    if (collidingObj.pickable) {
                        collidingObj.pick();
                        currentlyHolding = collidingObj;
                        hud.update(currentlyHolding.hud);
                    }
                    else {
                        if (collidingObj.talk(currentlyHolding)) {
                            triggeredDialog = collidingObj.endDialog;
                        }
                        else {
                            triggeredDialog = collidingObj.randomDialog();
                        }
                    }

                }

                movementPos = getScreenToWorld2D(mousePos, camera);
                
                const triangleTop = {
                    a: new Vector2(55, -462),
                    b: new Vector2(-718, -20),
                    c: new Vector2(819, -20)
                }

                const triangleBottom = {
                    a: new Vector2(-718, -20),
                    b: new Vector2(-84, 495),
                    c: new Vector2(819, -20)
                }

                if (
                    !checkCollisionPointTriangle(movementPos, triangleTop.a, triangleTop.b, triangleTop.c) &&
                    !checkCollisionPointTriangle(movementPos, triangleBottom.a, triangleBottom.b, triangleBottom.c)
                ) {
                    movementPos = null;
                    player.walking = false;
                    circleRadius = 15;
                }
                else {
                    movementPos.x += clickOffset.x;
                    movementPos.y += clickOffset.y;
                }
            }

            if (movementPos) {
                if (circleRadius > 0) circleRadius--;

                const speed = 2;
                const dx = movementPos.x - player.x;
                const dy = movementPos.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
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

           /*  camera.zoom += (getMouseWheelMove() * 0.05);
            camera.zoom = clamp(camera.zoom, 0.8, 1.5); */

            if (triggeredDialog && !dialogs.length) {
                dialogs.push(new Dialog({
                    text: triggeredDialog,
                    image: collidingObj.dialogPortrait,
                    inverted: true,
                }));

                if (collidingObj.endDialog === triggeredDialog) {
                    dialogs.push(new Dialog({
                        text: '\n  Aight, fetch!!',
                        image: globalThis.res.load('img', 'baby-portrait.png'),
                    }));

                    finishEntity = collidingObj;
                }
            }

            player.update(dt);
        }
    }

    function draw() {
        clearBackground(BLACK);

        beginMode2D(camera);
        drawTexturePro(bg, new Rectangle(0, 0, bg.width, bg.height), new Rectangle(0, 0, bg.width, bg.height), new Vector2(bg.width / 2, bg.height / 2), 0, WHITE);
        
        if (movementPos) {
            drawEllipseLines(movementPos.x - clickOffset.x, movementPos.y - clickOffset.y, circleRadius, circleRadius / 2, WHITE);
        }

        for (let obj of objects) {
            if (obj.position.y + obj.box.y < player.y + player.height) {
                obj.draw();
            }
        }

        player.draw();

        for (let obj of objects) {
            if (obj.position.y + obj.box.y > player.y + player.height) {
                obj.draw();
            }
        }

        /* drawTriangleLines(new Vector2(55, -462), new Vector2(-718, -20), new Vector2(819, -20), RED);
        drawTriangleLines(new Vector2(-718, -20), new Vector2(-81, 495), new Vector2(819, -20), RED); */
        endMode2D();

        dialogs[0]?.draw();
        hud.draw();

        // Mouse sprite
        drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);
        //drawText(`x ${player.x}, y ${player.y}`, 80, 80, 10, WHITE);
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