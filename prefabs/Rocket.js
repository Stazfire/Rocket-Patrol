// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false; //track rocket's firing status
    }

    update() {
        let speed = 5;
        //move left/right
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47) {
                this.x -= speed;
            }
            else if(keyRIGHT.isDown && this.x <= 578) {
                this.x += speed;
            }
        }
        //move UP/DOWN
        if(!this.isFiring) {
            if(keyUP.isDown && this.y >= 108) {
                this.y -= speed;
            }
            else if(keyDOWN.isDown && this.y <= 431) {
                this.y += speed;
            }
        }

        //fire
        if(Phaser.Input.Keyboard.JustDown(keyF)) {
            this.isFiring = true;
        }
        //move up when firing
        if(this.isFiring && this.y >= 108) {
            this.y -= speed;
        }
        //reset when miss
        if(this.y <= 108) {
            this.reset();
        }
    }

    //reset player position back to start
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}