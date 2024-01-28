export function Dialog(p = {}) {

    const props = {
        text: '',
        image: null,
        sound: null,
        ...p
    }

    const position = Vector2(20, 270 - 103);

    let dismissed = false;

    function draw() {
        drawTexture(props.image, position.x, position.y, WHITE);
        drawTextEx(globalThis.res.fnt['mainfont.fnt'], props.text, new Vector2(170, position.y + 28), 14, 1, BLACK);
    }

    return {
        draw,
        dismiss: () => dismissed = true,
        get dismissed() {
            return dismissed;
        }
    }
}