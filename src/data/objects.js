export const objs = [
    {
        name: 'tennisball',
        img: 'tennisball.png',
        boundingBox: new Rectangle(-257, -200, 17, 16),
        hud: 'hud_ball.png',
        dialogs: ['\n   Small ball...'],
        endDialogInverted: true,
        dialogPortrait: 'baby-portrait.png',
    },
    {
        name: 'scissors',
        img: 'scissors.png',
        boundingBox: new Rectangle(538, -233, 53, 69),
        requires: 1,
        pickable: true,
        hud: 'hud_scissors.png',
        dialogs: [' The rascal was \n sitting on the \n    scissors...'],
        endDialogInverted: true,
        dialogPortrait: 'baby-portrait.png',
    },
    {
        img: 'doggo.png',
        boundingBox: new Rectangle(528, -235, 84, 101),
        requires: 'tennisball',
        pickable: false,
        dialogs: [
            '\n  Get lost kiddo!',
            '  I\'m not letting \nyou pass, midget!... \n  I mean, woof!',
            '        Wait! \nHow can you even \n  understand me?!'
        ],
        endDialog: "  Whatchu doin' \n  with MY BALL?!\n  Give it here!!",
        dialogPortrait: 'doggo-portrait.png'
    },
    {
        img: 'doghouse.png',
        boundingBox: new Rectangle(643, -111, 107, 125),
        requires: 1,
        dialogs: [
            '\n  I ain\'t no dog!',
            '\nSleep? Right now? \nI\'m on a mission!',
        ],
        dialogPortrait: 'baby-portrait.png',
        endDialogInverted: true,
        pickable: false,
    },
    {
        img: 'balls.png',
        boundingBox: new Rectangle(233, -322, 38, 43),
        pickable: false,
        requires: 1,
        dialogs: [
            '  What can I do \n   with these \n   big balls?',
        ],
        endDialogInverted: true,
        dialogPortrait: 'baby-portrait.png'
    },
    {
        name: 'cat',
        img: 'cat-left.png',
        boundingBox: new Rectangle(-307, -106, 56, 66),
        requires: 1,
        pickable: false,
        dialogs: [
            '\n       Meow!',
        ],
        dialogPortrait: 'cat-portrait.png'
    },
    {
        img: 'drying-rack.png',
        boundingBox: new Rectangle(-408, -315, 121, 218),
        pickable: false,
        ignore: true
    },
    {
        img: 'fence-near.png',
        boundingBox: new Rectangle(-91, -99, 956, 623),
        pickable: false,
        ignore: true,
    },
    {
        img: 'house.png',
        boundingBox: new Rectangle(-1068, -101, 1025, 857),
        ignore: true,
        pickable: false,
    },
    {
        img: 'drying-rack-box.png',
        boundingBox: new Rectangle(-516, -249, 121, 218),
        interactableBoundingBox: new Rectangle(-516, -249 + 69, 117, 80),
        requires: 'scissors',
        pickable: false,
        dialogs: [
            "   Who the hell\n leaves a toolbox \n on a drying rack?!",
            "    An oddly \n   inconvenient\nplace for a box...",
            "     I wonder \n  what's inside..."
        ],
        endDialog: " \n   Great success!",
        endDialogInverted: true,
        dialogPortrait: 'baby-portrait.png',
        doneFn: 'rackDone'
    },
    {
        img: 'swing.png',
        boundingBox: new Rectangle(-83, -485, 266, 236),
        interactableBoundingBox: new Rectangle(-83 + 90, -485 + 120, 88, 65),
        pickable: false,
        requires: 'hammer',
        dialogs: [
            'Dad says he likes\nto swing but he\nnever plays with\nit... IDK',
            '\nHow do I turn this\ninto a rocket?...',
            'Nice elastic ropes, \n  but they need a\n  small boost...'
        ],
        endDialog: "\n     Nailed it! \n    Literally...",
        endDialogInverted: true,
        dialogPortrait: 'baby-portrait.png',
        doneFn: 'swingDone'
    }
]