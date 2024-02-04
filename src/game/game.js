import { manager } from "./states/manager.js";

export function Game() {
    function load() {
        globalThis.res.load('fnt', 'mainfont.fnt');
        globalThis.res.load('mus', 'simple-joy-loopable.wav');
        globalThis.res.load('mus', 'sunny-day-ambience.wav');

        // Preoad big assets to avoid loading hiccups
        globalThis.res.load('img', 'bg.png');
        globalThis.res.load('img', 'house.png');
        globalThis.res.load('img', 'fence-near.png');

        setMusicVolume(globalThis.res.load('mus', 'simple-joy-loopable.wav'), .5);
        setMusicVolume(globalThis.res.load('mus', 'sunny-day-ambience.wav'), .7);
        playMusicStream(globalThis.res.mus['simple-joy-loopable.wav']);
        playMusicStream(globalThis.res.mus['sunny-day-ambience.wav']);
        hideCursor();

        manager.setState(1);
    }
    
    function update(dt) {
        updateMusicStream(globalThis.res.mus['simple-joy-loopable.wav']);
        updateMusicStream(globalThis.res.mus['sunny-day-ambience.wav']);
        manager.update(dt);
    }

    function draw() {
        manager.draw();
        //drawFPS(0, 0);
    }

    function unload() {
       manager.unload();
    }

    return {
        load,
        update,
        draw,
        unload
    }
}