export function Object(p = {}) {

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

    console.log(props.endDialog);
    
    const boundingBox = props.boundingBox;
    const texture = globalThis.res.load('img', props.img);
    const dialogTexture = props.dialogPortrait ? globalThis.res.load('img', props.dialogPortrait) : null;

    function update(dt) {
        
    }

    function draw() {
        if(!picked) drawTexture(texture, boundingBox.x, boundingBox.y, WHITE);
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

    return {
        update,
        draw,
        pick,
        talk,
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
        randomDialog,
    }
}