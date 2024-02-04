export function GameObject(p = {}) {

    const props = {
        name: '',
        boundingBox: null,
        interactableBoundingBox: null,
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
    const interactableBoundingBox = props.interactableBoundingBox;
    const texture = globalThis.res.load('img', props.img);
    const dialogTexture = props.dialogPortrait ? globalThis.res.load('img', props.dialogPortrait) : null;

    function update(dt) {
        
    }

    function draw() {
        if((!picked && !done) || props.preventRemoval) drawTexture(texture, boundingBox.x, boundingBox.y, WHITE);
    }

    function pick() {
        if(picked || done) return;

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
        props.doneFn?.();
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
        get iboxPos() {
            return interactableBoundingBox ? new Vector2(interactableBoundingBox.x, interactableBoundingBox.y) : false;
        },
        get ibox() {
            return interactableBoundingBox ? new Vector2(interactableBoundingBox.width, interactableBoundingBox.height) : false;
        },
        get boundingBox() {
            return boundingBox;
        },
        get interactableBoundingBox() {
            return interactableBoundingBox || false;
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
        get endDialogInverted() {
            return props.endDialogInverted;
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
        get requires() {
            props.requires
        },
        get name() {
            return props.name;
        },
        get picked() {
            return picked;
        },
        get orientation() {
            return props.orientation;
        },
        setDone,
        randomDialog,
    }
}