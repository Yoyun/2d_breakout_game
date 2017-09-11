class Key extends Phaser.Sprite {
  constructor(game, x, y, key, frame) {
    super(game, x, y, key, frame)
    this.anchor.set(0.5, 0.5);
    this.game.physics.enable(this);
    this.body.allowGravity = false;

    this.y -= 3;
    this.game.add.tween(this)
      .to({y: this.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
      .yoyo(true)
      .loop()
      .start();
  }
}


export default Key
