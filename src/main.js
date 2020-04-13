console.log("hello world");
console.log("testing123");

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

// reserve keyboard vars
let keyF, keyLEFT, keyRIGHT, keyUP, keyDOWN;