class EnemyWall extends Phaser.Sprite {
  constructor(game, x, y, key, side){
    super(game, x, y, key)

    this.anchor.set(side === 'left' ? 1 : 0, 1)
    this.game.physics.enable(this);
    this.body.immovable = true
    this.body.allowGravity = false;
  }
}

export default EnemyWall
