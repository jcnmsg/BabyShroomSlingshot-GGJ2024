import '../env.js'
import './polyfills.js'
import { Game } from './game/game.js'

const screen = { width: env.SCREEN_WIDTH, height: env.SCREEN_HEIGHT }
const renderer = { width: env.RENDERER_WIDTH, height: env.RENDERER_HEIGHT }

if (env.WINDOW_RESIZABLE) setConfigFlags(FLAG_WINDOW_RESIZABLE);

initWindow(screen.width, screen.height, "Olive Gold Panda - Global Game Jam 2024 @ Satakunta");

if (env.START_FULLSCREEN) toggleFullscreen();

setTargetFPS(env.TARGET_FPS);

const target = loadRenderTexture(renderer.width, renderer.height);

if (env.HARD_PIXELS) setTextureFilter(target.texture, TEXTURE_FILTER_POINT);

const game = new Game();

game.load();

while (!windowShouldClose()) {
    // Update
    game.update(getFrameTime());

    // Draw
    beginDrawing();
    {
        clearBackground(BLACK);

        // Draw to the render target
        beginTextureMode(target);
        {
            clearBackground(RAYWHITE);
            game.draw();
        }
        endTextureMode();

        // Calculate the destination rectangle maintaining the aspect ratio
        const aspectRatio = target.texture.width / target.texture.height;
        const scaleFactor = Math.min(getScreenWidth() / target.texture.width, getScreenHeight() / target.texture.height);
        const destWidth = target.texture.width * scaleFactor;
        const destHeight = target.texture.height * scaleFactor;

        const destX = (getScreenWidth() - destWidth) / 2;
        const destY = (getScreenHeight() - destHeight) / 2;

        // Draw the scaled render target to the window
        const source = new Rectangle(0, 0, target.texture.width, -target.texture.height);
        const dest = new Rectangle(destX, destY, destWidth, destHeight);
        const origin = new Vector2(0, 0);
        const rotation = 0;
        const tint = RAYWHITE;

        drawTexturePro(target.texture, source, dest, origin, rotation, tint);
    }
    endDrawing();
}

game.unload();
unloadRenderTexture(target);
closeWindow();
