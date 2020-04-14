// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.isFiring = false; //track rocket's firing status
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        let speed = 5;

        

        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        //move up when firing
        if(this.isFiring && this.y >= 108) {
            this.y -= speed;
        }
        //reset when miss
        // if(this.y <= 108) {
        //     this.reset();
        // }
    }


    //reset player position back to start
    reset() {
        this.isFiring = false;
        // this.y = 431;
    }
}