//Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this); //add existing scene, displayList, updateList

        //storing points
        this.points = pointValue;
    }

    update() {
        //move left
        this.x -= 3;

        //wraparound from left to right edge
        if(this.x <= 0 - this. width) {
            this.x = game.config.width;
        }
    }

    reset() {
        this.x = game.config.width;
    }
}