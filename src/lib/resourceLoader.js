globalThis.res = {
    img: {},
    fnt: {},
    mus: {},
    sfx: {},
    load,
    unload
}

function load(type, name) {
    if (globalThis.res[type][name]) return globalThis.res[type][name];

    switch (type) {
        case 'img':
            globalThis.res.img[name] = loadTexture(`../res/img/${name}`);
            return globalThis.res.img[name];
        case 'fnt':
            globalThis.res.fnt[name] = loadFont(`../res/fnt/${name}`);
            return globalThis.res.fnt[name];
        case 'mus':
            globalThis.res.mus[name] = loadMusicStream(`../res/mus/${name}`);
            return globalThis.res.mus[name];
        case 'sfx': 
            globalThis.res.sfx[name] = loadSound(`../res/sfx/${name}`);
            return globalThis.res.sfx[name];
    }
}

function unload(type, name) {
    switch (type) {
        case 'img':
            unloadTexture(globalThis.res.img[name]);
            delete globalThis.res.img[name];
            break;
        case 'fnt':
            unloadFont(globalThis.res.fnt[name]);
            delete globalThis.res.fnt[name];
            break;
        case 'mus':
            unloadSound(globalThis.res.mus[name]);
            delete globalThis.res.mus[name];
            break;
        case 'sfx': 
            unloadSound(globalThis.res.sfx[name]);
            delete globalThis.res.sfx[name];
            break;
    }
}

export const resourceLoader = globalThis.res;