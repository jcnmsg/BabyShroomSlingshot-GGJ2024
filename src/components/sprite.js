export function Sprite(p = {}) {
    const props = {
        sheetSize: {
            width: 0,
            height: 0
        },
        frameSize: {
            width: 0,
            height: 0
        },
        numberOfFrames: 0,
        frameStart: 0,
        frameSpeed: 0,
        loop: false,
        img: null,
        ...p
    }

    let frame = props.frameStart;
    let texture = globalThis.res.load('img', props.img);
    let playing = true;

    function update(dt) {
        if (playing) {
            frame += props.frameSpeed * dt;
            if (frame >= props.frameStart + props.numberOfFrames) {
                if (props.loop) {
                    frame = props.frameStart;
                }
                else {
                    frame = props.frameStart + props.numberOfFrames - 1;
                }
            }
        }
    }

    function draw(x, y, dir = 0) {
        if (dir === 0) {
            drawTexturePro(
                texture,
                new Rectangle(props.frameSize.width * Math.floor(frame), 0, props.frameSize.width, props.frameSize.height),
                new Rectangle(x, y, props.frameSize.width, props.frameSize.height),
                new Vector2(0, 0),
                0,
                WHITE
            );
        }
        else if (dir === 1){ // Mirror sprite
            drawTexturePro(
                texture,
                new Rectangle(props.frameSize.width * Math.floor(frame), 0, -props.frameSize.width, props.frameSize.height),
                new Rectangle(x, y, props.frameSize.width, props.frameSize.height),
                new Vector2(0, 0),
                0,
                WHITE
            );
        }
    }

    function play() {
        playing = true;
    }

    function pause() {
        playing = false;
    }

    function reset() {
        frame = props.frameStart;
    }

    return {
        update,
        draw,
        play,
        pause,
        reset,
        get playing() {
            return playing;
        }
    }
}