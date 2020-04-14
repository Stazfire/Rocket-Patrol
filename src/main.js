console.log("hello world");
console.log("testing123");

let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 640,
        height: 480,
    },
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT, keyUP, keyDOWN;