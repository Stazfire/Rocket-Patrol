class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/player.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('boss', './assets/boss.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 1040, 680, 'starfield').setScale(1, 1).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width - 100, game.config.height/2, 'rocket').setScale(1, 1).setOrigin(0, 0);

        this.bossB = new Boss(this, 0, game.config.height/2 - 50, 'boss').setScale(1, 1).setOrigin(0,0);


        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + 192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width + 96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 60
        });

        // score
        this.p1Score = 0;
        // timer
        this.timer = 60;
        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(69, 54, this.p1Score, scoreConfig);
        this.timeRight = this.add.text(400, 54, this.timer, timerConfig);

        // game over flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        this.countDown = this.time.addEvent({ delay: 1000, callback: () => { 
            if(this.timer>=1) {
                this.timer--;
            }
            else {
                this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
                this.add.text(game.config.width/2, game.config.height/2 + 64, '(F)ire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
                this.gameOver = true;
            }
        }, callbackScope: this, loop: true });
        game.canvas.addEventListener('mousedown', function () {
            game.input.mouse.requestPointerLock();
        });

        this.slow = 1;
        //  Input events
        this.input.on('pointermove', function (pointer) {
            if (this.input.mouse.locked) {
                
                this.p1Rocket.x += pointer.movementX/this.slow;
                this.p1Rocket.y += pointer.movementY/this.slow;
                //  Keep the rocket within the game
                this.p1Rocket.x  = Phaser.Math.Clamp(this.p1Rocket.x , 0, 1000);
                this.p1Rocket.y  = Phaser.Math.Clamp(this.p1Rocket.y , 40, 640);
            }
        }, this);
    }

    update() {
        let pointer = this.input.activePointer;
        if(pointer.isDown) {
            this.slow = 10;
        }
        else {
            this.slow = 3;
        }

        this.timeRight.text = this.timer;
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.scene.restart(this.p1Score);
        }

        this.starfield.tilePositionX -= 8;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.bossB.update();
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        } 

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);   
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }
}
