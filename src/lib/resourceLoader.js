globalThis.res = {
    img: {},
    fnt: {},
    mus: {},
    sfx: {},
    load: load,
}

function load(type, name) {
    switch (type) {
        case 'img':
            globalThis.res.img[name] = loadTexture(`../res/img/${name}`);
            return globalThis.res.img[name];
        case 'fnt':
            globalThis.res.fnt[name] = loadFont(`../res/fnt/${name}`);
            return globalThis.res.fnt[name];
        case 'mus':
            globalThis.res.mus[name] = loadSound(`../res/mus/${name}`);
            return globalThis.res.mus[name];
        case 'sfx': 
            globalThis.res.sfx[name] = loadSound(`../res/sfx/${name}`);
            return globalThis.res.sfx[name];
    }
}

export const resourceLoader = globalThis.res;