import { EventManager } from "../../../lib/eventManager.js";
import { Player } from "../../../components/player.js";
import { GameObject } from "../../../components/object.js";
import { Dialog } from "../../../components/dialog.js";
import { HUD } from "../../../components/hud.js";
import { intro } from '../../../data/intro.js';
import { objs } from '../../../data/objects.js';

export function Game() {
    const events = new EventManager();
    const clickOffset = new Vector2(-20, -60);
    const finalUnloadingX = 500;
    const objects = [];
    const dialogs = [];
    const doneFns = {
        rackDone: function() {
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
        },
        swingDone: function() {
            objects.push(new GameObject({
                img: 'swing-big.png',
                boundingBox: new Rectangle(-83, -485, 261, 757),
                interactableBoundingBox: new Rectangle(-83 + 93, -485 + 713, 80, 44),
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
    }

    let circleRadius = 15;
    let loadingX = 500;
    let finishedGame, mousePos, cursor, cursorClicking, cursorSprite, cameraTarget, player, camera, bg, movementPos, currentlyHolding, hud, finishEntity, nailedIt, loading;
    let unloading, unloadingCb, unloaded;
    let unloadCounter = 0;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');
        player = new Player();
        hud = new HUD();
        camera = new Camera2D(new Vector2(480 / 2.0, 270 / 2.0), new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)
        bg = globalThis.res.load('img', 'bg.png');
        unloaded = false;
        loading = true;

        dialogs.push(...intro.map(d => new Dialog(d)));
        objects.push(...objs.map(o => new GameObject({ ...o, doneFn: o.doneFn ? doneFns[o.doneFn] : null })));

        callback();
    }

    function update(dt) {
        mousePos = globalThis.getMousePositionRelativeToTexture();

        if (unloading) {
            unloadCounter += 10;

            if (unloadCounter >= finalUnloadingX) {
                let cb = unloadingCb;

                unloaded = true;
                unloading = false;
                unloadingCb = null;
                unloadCounter = 0;

                return cb();
            }

            return;
        }

        if (isMouseButtonDown(MOUSE_BUTTON_LEFT)) {
            cursorSprite = cursorClicking;

            if (finishedGame) {
                unload(() => {
                    globalThis.closeGame();
                })
            }
        }
        else {
            cursorSprite = cursor;
        }

        if (loading) {
            if (loadingX <= 0) {
                return loading = false;
            }

            return loadingX -= 10;
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
                    let objPos, objBox;
                    
                    if (obj.ibox) {
                        objPos = getWorldToScreen2D(obj.iboxPos, camera);
                        objBox = obj.ibox;
                    }
                    else {
                        objPos = getWorldToScreen2D(obj.position, camera);
                        objBox = obj.box;
                    }

                    if (checkCollisionPointRec(mousePos, new Rectangle(objPos.x, objPos.y, objBox.x, objBox.y))) {
                        if (!obj.ignore && !obj.done) collidingObj = obj;
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

        endMode2D();

        dialogs[0]?.draw();

        if (!nailedIt) hud.draw();

        if (loading) {
            drawRectangle(0, 0, loadingX, 270, BLACK);
        }

        // Mouse sprite
        if (!nailedIt) drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);

        if (finishedGame) {
            drawTextEx(globalThis.res.fnt['mainfont.fnt'], 'Narrator: They didn\'t reach the moon, \nbut it was a good attempt...', new Vector2(20, 220), 14, 1, WHITE);
        }

        // Draw rectangle that fills the screen gradually from left to right during unload
        if (unloading) {
            drawRectangle(0, 0, unloadCounter, getScreenHeight(), BLACK);
        }
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