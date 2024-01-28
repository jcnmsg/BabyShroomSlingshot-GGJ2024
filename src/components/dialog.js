export function Dialog(p = {}) {

    const props = {
        text: '',
        image: null,
        sound: null,
        inverted: false,
        ...p
    }

    const position = Vector2(20, 270 - 103);

    let dismissed = false;

    function draw() {
        //drawTexture(props.image, position.x, position.y, WHITE);
        if (props.inverted) {
            drawTexturePro(
                props.image,
                new Rectangle(0, 0, -props.image.width, props.image.height),
                new Rectangle(100, position.y, props.image.width, props.image.height),
                new Vector2(0, 0),
                0,
                WHITE
            );
            drawTextEx(globalThis.res.fnt['mainfont.fnt'], props.text, new Vector2(120, position.y + 28), 14, 1, BLACK);
        }
        else {
            drawTexturePro(
                props.image,
                new Rectangle(0, 0, props.image.width, props.image.height),
                new Rectangle(position.x, position.y, props.image.width, props.image.height),
                new Vector2(0, 0),
                0,
                WHITE
            );
            drawTextEx(globalThis.res.fnt['mainfont.fnt'], props.text, new Vector2(170, position.y + 28), 14, 1, BLACK);
        }
    }

    return {
        draw,
        dismiss: () => dismissed = true,
        get dismissed() {
            return dismissed;
        }
    }
}