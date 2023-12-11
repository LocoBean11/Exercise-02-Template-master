class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        //Add the ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        //Add the walls
        const wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width /2 ))
        wallA.body.setImmovable(true)

        const wallB = this.physics.add.sprite(0, height / 4, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width /2 ))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB]);

         //Ball collides with walls
         this.physics.add.collider(this.ball, this.walls)

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            this.resetBall()
        })

        //Moving wall
        const wall = this.physics.add.sprite(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2), height / 4, 'wall')
        wall.body.setImmovable(true)
        this.physics.add.collider(this.ball, this.wall)
        wall.body.velocity.x = 100 

        //Wall moves back and forth
        this.tweens.add({
            targets: wall,
            x: width - wall.width / 2, // Move to the right edge
            duration: 2000, 
            ease: 'Linear',
            yoyo: true, 
            repeat: -1, 
        })

        //one way
        this.oneWay = this.physics.add.sprite(0, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2,
        width - this.oneWay.width /2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        //variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1100

        this.input.on('pointerdown', (pointer) => {
            //Pointer's relative x-position shoots in correct x-position
            const pointerX = pointer.x
            const ballX = this.ball.x
            const velocityX = (pointerX - ballX) * 2

            let shotDirection = pointer.y <=this.ball.y ? 1 : -1

            this.ball.body.setVelocityX(velocityX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })

          /*  let shotDirection
            pointer.y <= this.ball.y ? shotDirection = 1 : shotDirection = -1
            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, 
                this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, 
                this.SHOT_VELOCITY_Y_MAX) * shotDirection)
        })*/

        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)
    }

    //Resets ball when hole-in-one occurs
    resetBall(){
        const width = this.sys.game.config.width;
        const height = this.sys.game.config.height;

        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // Collision between new ball and walls
        this.physics.add.collider(this.ball, this.walls)
        this.physics.add.collider(this.ball, this.oneWay)

        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.destroy()
            this.resetBall()
        })
    }

    update() {

    }
}