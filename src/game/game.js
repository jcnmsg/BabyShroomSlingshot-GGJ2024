import { manager } from "./states/manager.js";

export function Game() {
    function load() {
        globalThis.res.load('fnt', 'mainfont.fnt');
        globalThis.res.load('mus', 'simple-joy-loopable.wav');
        globalThis.res.load('mus', 'sunny-day-ambience.wav');

        /* setMusicVolume(globalThis.res.load('mus', 'simple-joy-loopable.wav'), .1);
        setMusicVolume(globalThis.res.load('mus', 'sunny-day-ambience.wav'), .1);
        playMusicStream(globalThis.res.mus['simple-joy-loopable.wav']);
        playMusicStream(globalThis.res.mus['sunny-day-ambience.wav']); */
        hideCursor();

        manager.setState(0);
    }
    
    function update(dt) {
        /* updateMusicStream(globalThis.res.mus['simple-joy-loopable.wav']);
        updateMusicStream(globalThis.res.mus['sunny-day-ambience.wav']); */
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