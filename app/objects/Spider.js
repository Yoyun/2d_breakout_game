import assest from '../assest';

class Spider extends Phaser.Sprite{

  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame)
    // anchor
    this.anchor.set(0.5)
    // animations
    this.animations.add('crawl', [0,1,2], 8, true)
    this.animations.add('die', [0,4,0,4,0,4,3,3,3,3,3,3], 12)
    this.animations.play('crawl')

    // physics properties
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true
    this.body.velocity.x = Spider.SPEED
  }

  update() {
    if (this.body.touching.right || this.body.blocked.right) {
      this.body.velocity.x = -Spider.SPEED;
    } else if(this.body.touching.left || this.body.blocked.left) {
      this.body.velocity.x = Spider.SPEED;
    }
  }

  die() {
    this.body.enable = false;
    this.animations.play('die').onComplete.addOnce(() => {
      this.kill();
    })
  }
}

Spider.SPEED = 100;

export default Spider
