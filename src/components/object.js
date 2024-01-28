export function GameObject(p = {}) {

    const props = {
        boundingBox: null,
        img: null,
        pickable: true,
        dialogs: [],
        endDialog: '',
        portrait: null,
        dialogPortrait: null,
        ...p
    }

    let picked = false;
    let done = false;

    const boundingBox = props.boundingBox;
    const texture = globalThis.res.load('img', props.img);
    const dialogTexture = props.dialogPortrait ? globalThis.res.load('img', props.dialogPortrait) : null;

    function update(dt) {
        
    }

    function draw() {
        if(!picked && !done) drawTexture(texture, boundingBox.x, boundingBox.y, WHITE);
    }

    function pick() {
        if (props.pickable) picked = true;
    }

    function talk (obj) {
        return obj === props.requires;
    }

    function randomDialog() {
        return props.dialogs[Math.floor(Math.random() * props.dialogs.length)];
    }

    function setDone() {
        done = true;
    }

    return {
        update,
        draw,
        pick,
        talk,
        get x () {
            return boundingBox.x;
        },
        get y () {
            return boundingBox.y;
        },
        set x (v) {
            boundingBox.x = v;
        },
        set y (v) {
            boundingBox.y = v;
        },
        get position() {
            return new Vector2(boundingBox.x, boundingBox.y);
        },
        get box() {
            return new Vector2(boundingBox.width, boundingBox.height);
        },
        get boundingBox() {
            return boundingBox;
        },
        get pickable() {
            return props.pickable;
        },
        get dialogPortrait() {
            return dialogTexture;
        },
        get endDialog() {
            return props.endDialog;
        },
        get hud() {
            return props.hud;
        },
        get img() {
            return props.img;
        },
        get ignore() {
            return props.ignore;
        },
        get done() {
            return done;
        },
        setDone,
        randomDialog,
    }
}