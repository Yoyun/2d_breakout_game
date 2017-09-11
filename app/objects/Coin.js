class Coin extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);
    this.anchor.set(0.5, 0.5)
    this.animations.add('rotate', [0,1,2,1], 6, true)
    this.animations.play('rotate')
    this.game.physics.enable(this)
    this.body.allowGravity = false;
  }
}

export default Coin
