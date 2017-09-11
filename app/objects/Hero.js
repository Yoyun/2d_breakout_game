class Hero extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame)
    this.anchor.set(0.5, 0.5)
    this.game.physics.enable(this)
    this.body.collideWorldBounds = true

    this.animations.add('stop', [0]);
    this.animations.add('run', [1,2], 8, true);
    this.animations.add('jump', [3]);
    this.animations.add('fall', [4]);
  }

  move(direction) {
    this.body.velocity.x = direction * Hero.SPEED
    if (this.body.velocity.x < 0) {
      this.scale.x = -1;
    } else if(this.body.velocity.x >0) {
      this.scale.x = 1;
    }
  }

  jump() {
    let canJump = this.body.touching.down

    if (canJump) {
      this.body.velocity.y = -Hero.JUMP_SPEED
    }
    return canJump
  }

  bounce() {
    this.body.velocity.y = -Hero.BOUNCE_SPEED
  }

  update() {
    let animationName = this._getAnimationName();
    if (this.animations.name != animationName) {
      this.animations.play(animationName);
    }
  }

  _getAnimationName() {
    let name = 'stop';

    if (this.body.velocity.y < 0) {
      name = 'jump';
    } else if (this.body.velocity.y >=0 && !this.body.touching.down) {
      name = 'fall';
    } else if(this.body.velocity.x !== 0 && this.body.touching.down) {
      name = 'run';
    }

    return name;
  }
}

Hero.JUMP_SPEED = 600;
Hero.SPEED = 200;
Hero.BOUNCE_SPEED = 200;

export default Hero
