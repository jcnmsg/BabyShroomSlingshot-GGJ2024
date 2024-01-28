import { EventManager } from "../../../lib/eventManager.js";
import { Player } from "../../../components/player.js";
import { GameObject } from "../../../components/object.js";
import { Dialog } from "../../../components/dialog.js";
import { HUD } from "../../../components/hud.js";
import { intro } from '../../../intro.js';

export function Game() {
    const events = new EventManager();
    const clickOffset = new Vector2(-20, -60);
    const objects = [];
    const dialogs = [];

    let circleRadius = 15;
    let loadingX = 500;
    let finishedGame, mousePos, cursor, cursorClicking, cursorSprite, cameraTarget, player, camera, bg, movementPos, currentlyHolding, hud, finishEntity, nailedIt, loading;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');
        player = new Player();
        camera = new Camera2D(new Vector2(480 / 2.0, 270 / 2.0), new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)
        bg = globalThis.res.load('img', 'bg.png');
        
        dialogs.push(...intro.map(d => new Dialog(d)));

        objects.push(new GameObject({
            img: 'tennisball.png',
            boundingBox: new Rectangle(-257, -200, 17, 16),
            hud: 'hud_ball.png',
            dialogs: ['\n   Small ball...'],
            endDialogInverted: true,
            dialogPortrait: 'baby-portrait.png',
        }));

        objects.push(new GameObject({
            img: 'scissors.png',
            boundingBox: new Rectangle(538, -233, 53, 69),
            requires: 1,
            pickable: true,
            usable: false,
            hud: 'hud_scissors.png',
            dialogs: [' The rascal was \n sitting on the \n    scissors...'],
            endDialogInverted: true,
            dialogPortrait: 'baby-portrait.png',
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
            img: 'doghouse.png',
            boundingBox: new Rectangle(643, -111, 107, 125),
            pickable: false,
            usable: false
        }));

        objects.push(new GameObject({
            img: 'balls.png',
            boundingBox: new Rectangle(233, -322, 38, 43),
            pickable: false,
            requires: 1,
            dialogs: [
                '  What can I do \n   with these \n   big balls?',
            ],
            endDialogInverted: true,
            dialogPortrait: 'baby-portrait.png'
        }));

        objects.push(new GameObject({
            name: 'cat',
            img: 'cat-left.png',
            boundingBox: new Rectangle(-307, -106, 56, 66),
            requires: 1,
            pickable: false,
            dialogs: [
                '\n       Meow!',
            ],
            dialogPortrait: 'cat-portrait.png'
        }));

        objects.push(new GameObject({
            img: 'drying-rack-box.png',
            boundingBox: new Rectangle(-516, -249, 121, 218),
            requires: objects[1],
            pickable: false,
            endDialog: " Who the hell\n leaves a toolbox \n on a drying rack?!",
            endDialogInverted: true,
            dialogPortrait: 'baby-portrait.png',
            doneFn: () => {
                objects.push(new GameObject({
                    img: 'drying-rack-cut.png',
                    boundingBox: new Rectangle(-516, -249, 121, 218),
                    pickable: false,
                    ignore: true,
                }));

                objects.push(new GameObject({
                    name: 'hammer',
                    img: 'hammer.png',
                    boundingBox: new Rectangle(-424, -87, 36, 24),
                    pickable: true,
                    hud: 'hud_hammer.png',
                    dialogs: ['    One baby \n  One hammer... \n   huehuehue'],
                    endDialogInverted: true,
                    dialogPortrait: 'baby-portrait.png',
                }));
            }
        }));

        objects.push(new GameObject({
            img: 'drying-rack.png',
            boundingBox: new Rectangle(-408, -315, 121, 218),
            pickable: false,
            ignore: true
        }));

        objects.push(GameObject({
            img: 'fence-near.png',
            boundingBox: new Rectangle(-91, -99, 956, 623),
            pickable: false,
            ignore: true,
        }));

        objects.push(GameObject({
            img: 'swing.png',
            boundingBox: new Rectangle(-83, -485, 266, 236),
            pickable: false,
            requires: 'hammer',
            endDialog: "\n     Nailed it! \n    Literally...",
            endDialogInverted: true,
            dialogPortrait: 'baby-portrait.png', 
            doneFn: () => {
                objects.push(new GameObject({
                    img: 'swing-big.png',
                    boundingBox: new Rectangle(-83, -485, 261, 757),
                    pickable: false,
                    ignore: false,
                    requires: 'cat1',
                    endDialog: '\n   To the moon \n    and beyond!',
                    endDialogInverted: true,
                    dialogPortrait: 'babycat-portrait.png',
                    preventRemoval: true,
                    doneFn: () => {
                        nailedIt = true;
                    }
                }));

                objects.find((o) => o.name === 'cat').setDone();

                objects.push(new GameObject({
                    name: 'cat1',
                    img: 'cat-left.png',
                    boundingBox: new Rectangle(-307, -106, 56, 66),
                    pickable: true,
                    hud: 'hud_caty.png',
                    dialogs: ['\n  We ready fam?    '],
                    endDialogInverted: true,
                    dialogPortrait: 'baby-portrait.png',
                }));
            }
        }));

        objects.push(new GameObject({
            img: 'house.png',
            boundingBox: new Rectangle(-1068, -101, 1025, 857),
            ignore: true,
            pickable: false,
            usable: false
        }));

        hud = new HUD();

        loading = true;

        callback();
    }

    function update(dt) {
        mousePos = globalThis.getMousePositionRelativeToTexture();

        // Place objects, remove after debug
        /* if (isKeyDown(KEY_LEFT)) {
            objects[5].x--;
        }
        if (isKeyDown(KEY_RIGHT)) {
            objects[5].x++;
        }
        if (isKeyDown(KEY_UP)) {
            objects[5].y--;
        }
        if (isKeyDown(KEY_DOWN)) {
            objects[5].y++;
        } */

        if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            cursorSprite = cursorClicking;

            if (finishedGame) {
                globalThis.closeGame();
            }
        }
        else {
            cursorSprite = cursor;
        }       

        if (loading) {
            if (loadingX <= 0) {
                return loading = false;
            }

            return loadingX-=10;
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
            if (nailedIt) {
                movementPos = Vector2(32, 200);

                const dx = movementPos.x - player.x;
                const dy = movementPos.y - player.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                player.walking = true;
                camera.zoom += 0.005; 
                camera.zoom = clamp(camera.zoom, 1, 1.5)

                if (dist < 5) {
                    movementPos = null;
                    player.walking = false;

                    if (camera.zoom === 1.5) {
                        finishedGame = true;
                    }
                }
            }
            else if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
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
                    if (collidingObj.pickable && !collidingObj.done && !collidingObj.picked) {
                        collidingObj.pick();
                        currentlyHolding = collidingObj;
                        hud.update(currentlyHolding.hud);

                        if (collidingObj.endDialogInverted) {
                            triggeredDialog = collidingObj.randomDialog();
                        }
                    }
                    else if (!collidingObj.pickable) {
                        if (collidingObj.talk(currentlyHolding) || collidingObj.talk(currentlyHolding?.name)) {
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

            if (triggeredDialog && !dialogs.length) {
                dialogs.push(new Dialog({
                    text: triggeredDialog,
                    image: collidingObj.dialogPortrait,
                    inverted: collidingObj.endDialogInverted ? false : true,
                }));

                if (collidingObj.endDialog === triggeredDialog && triggeredDialog.toLowerCase().includes('my ball')) {
                    dialogs.push(new Dialog({
                        text: '\n  Aight, fetch!!',
                        image: globalThis.res.load('img', 'baby-portrait.png'),
                    }));

                    finishEntity = collidingObj;
                }
                else if (collidingObj.endDialog === triggeredDialog) {
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

        if(!nailedIt) hud.draw();

        if (loading) {
            drawRectangle(0, 0, loadingX, 270, BLACK);
        }

        // Mouse sprite
        if (!nailedIt) drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);

        if (finishedGame) {
            drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'Narrator: They didn\'t reach the moon, \nbut it was a good attempt...', new Vector2(20, 220), 14, 1, WHITE);
        }

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