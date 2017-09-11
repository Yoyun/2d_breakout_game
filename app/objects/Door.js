class Door extends Phaser.Sprite {
  constructor(game, x, y, key, frame){
    super(game, x, y, key, frame)
    this.anchor.setTo(0.5, 1);
    this.game.physics.enable(this);
    this.body.allowGravity = false;
  }
}

export default Door
