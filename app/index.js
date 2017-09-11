// import 'pixi';
// import 'p2';
// import Phaser from 'phaser';
import MainState from './state/MainState';
import PlayState from './state/PlayState';

class Game extends Phaser.Game {
  constructor() {
    super(960, 600, Phaser.AUTO, 'app');
    this.state.add('MainState', MainState);
    this.state.add('PlayState', PlayState);
    this.state.start('PlayState', true, false, {level: 1});
  }
}

window.onload = function () {
    window.game = new Game();
};
