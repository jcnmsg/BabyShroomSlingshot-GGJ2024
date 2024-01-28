import { EventManager } from "../../../lib/eventManager.js";
import { Player } from "../../../components/player.js";
import { Object } from "../../../components/object.js";
import { Dialog } from "../../../components/dialog.js";
import { HUD } from "../../../components/hud.js";

export function Game() {
    const events = new EventManager();
    const clickOffset = new Vector2(-20, -60);
    const objects = {
        tennisBall: null,
        doggo: null
    };
    const dialogs = [];

    let circleRadius = 15;
    let mousePos, cursor, cursorClicking, cursorSprite, cameraTarget, player, camera, bg, movementPos, currentlyHolding, hud;

    function load(callback) {
        cursor = globalThis.res.load('img', 'cursor.png');
        cursorClicking = globalThis.res.load('img', 'cursor_clicking.png');
        player = new Player();
        camera = new Camera2D(new Vector2(480 / 2.0, 270 / 2.0), new Vector2(player.x + 20.0, player.y + 20.0), 0, 1)
        bg = globalThis.res.load('img', 'bg.png');

        objects.tennisBall = new Object({
            img: 'tennisball.png',
            boundingBox: new Rectangle(90, 90, 17, 16),
            hud: 'hud_ball.png',
        })

        objects.doggo = new Object({
            img: 'doggo.png',
            boundingBox: new Rectangle(528, -235, 84, 101),
            requires: objects.tennisBall,
            pickable: false,
            dialogs: [
                '\n  Get lost kiddo!',
                '  I\'m not letting \nyou pass, midget!... \n  I mean, woof!',
                '        Wait! \nHow can you even \n  understand me?!'
            ],
            endDialog: "  Whatchu doin' \n  with MY BALL?!\n  Give it here!!",
            dialogPortrait: 'doggo-portrait.png'
        })

        objects.lawnmower = new Object({
            img: 'lawnmower.png',
            boundingBox: new Rectangle(598, -155, 274, 223),
            pickable: false,
            usable: true
        });

        hud = new HUD();

        callback();
    }

    function update(dt) {
        mousePos = globalThis.getMousePositionRelativeToTexture();

        // Place objects, remove after debug
        if (isKeyPressed(KEY_LEFT)) {
            objects[objects.length - 1].x --;
        }
        else if (isKeyPressed(KEY_RIGHT)) {
            objects[objects.length - 1].x ++;
        }
        else if (isKeyPressed(KEY_UP)) {
            objects[objects.length - 1].y --;
        }
        else if (isKeyPressed(KEY_DOWN)) {
            objects[objects.length - 1].y ++;
        }
        
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
            let triggeredDialog = false;
            let collidingObj = false;

            if (isMouseButtonReleased(MOUSE_BUTTON_LEFT)) {
                for (let obj in objects) {
                    const objPos = getWorldToScreen2D(objects[obj].position, camera);
    
                    if (checkCollisionPointRec(mousePos, new Rectangle(objPos.x, objPos.y, objects[obj].box.x, objects[obj].box.y))) {
                        collidingObj = objects[obj];
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
                movementPos.x += clickOffset.x;
                movementPos.y += clickOffset.y;
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
    
            camera.zoom = clamp(camera.zoom, 0.8, 1.5);
            
            if (triggeredDialog && !dialogs.length) {
                dialogs.push(new Dialog({
                    text: triggeredDialog,
                    image: collidingObj.dialogPortrait
                }));

                if (collidingObj.endDialog === triggeredDialog) {
                    dialogs.push(new Dialog({
                        text: '\n  Aight, fetch!!',
                        image: globalThis.res.load('img', 'baby-portrait.png'),
                    }));
                }
            }
    
            player.update(dt);
        }
    }

    function draw() {
        clearBackground(BLACK);

        beginMode2D(camera);
            drawTexturePro(bg, new Rectangle(0, 0, bg.width, bg.height), new Rectangle(0, 0, bg.width, bg.height), new Vector2(bg.width/2, bg.height/2), 0, WHITE);
            
            if (movementPos) {
                drawEllipseLines(movementPos.x - clickOffset.x, movementPos.y - clickOffset.y, circleRadius, circleRadius/2, WHITE);
            }

            for (let obj in objects) {
                if (objects[obj].position.y + objects[obj].box.y < player.y + player.height) {
                    objects[obj].draw();
                }
            }
            
            player.draw();

            for (let obj in objects) {
                if (objects[obj].position.y + objects[obj].box.y > player.y + player.height) {
                    objects[obj].draw();
                }
            }

        endMode2D();

        dialogs[0]?.draw();

        hud.draw();

        // Mouse sprite
        drawTexture(cursorSprite, mousePos.x - 6, mousePos.y, WHITE);
        drawText(`x ${player.x}, y ${player.y}`, 10, 10, 10, WHITE);
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