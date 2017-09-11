class Platform extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame);
    this.game.physics.enable(this)
    this.body.allowGravity = false
    this.body.immovable = true
  }
}

export default Platform
