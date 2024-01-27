import { Sprite } from "./sprite.js";

export function Player(p = {}) {

    const boundingBox = new Rectangle(0, 0, 35, 70);
    const sprite = new Sprite({
        sheetSize: {
            width: 210,
            height: 70
        },
        frameSize: {
            width: 35,
            height: 70
        },
        numberOfFrames: 6,
        frameStart: 4,
        frameSpeed: 10,
        loop: true,
        img: 'baby.png'
    });

    sprite.pause();

    let direction = 0;

    function update(dt) {
        sprite.update(dt);
    }

    function draw() {
        sprite.draw(boundingBox.x, boundingBox.y, direction);
    }

    return {
        update,
        draw,
        get x() { return boundingBox.x },
        get y() { return boundingBox.y },
        set x(v) { boundingBox.x = v },
        set y(v) { boundingBox.y = v },
        get direction() { return direction },
        set direction(v) { direction = v },
        get walking() {
            return sprite.playing;
        },
        set walking(v) {
            if (v) {
                sprite.play();
            }
            else {
                sprite.pause();
                sprite.reset();
            }
        }
    }
}