
export function HUD() {
    // Preload
    globalThis.res.load('img', 'hud_empty.png');
    globalThis.res.load('img', 'hud_ball.png');

    const position = Vector2(10, 10);

    let image = globalThis.res.load('img', 'hud_empty.png');

    function update(i) {
        image = globalThis.res.load('img', i);
    }

    function draw() {
        drawTexture(image, position.x, position.y, WHITE);
    }

    return {
        draw,
        update
    }
}