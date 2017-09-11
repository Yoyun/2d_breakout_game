import assest from '../assest';
import Hero from '../objects/Hero'
import Spider from '../objects/Spider'
import EnemyWall from '../objects/EnemyWall'
import Platform from '../objects/Platform'
import Door from '../objects/Door'
import Key from '../objects/Key'
import Coin from '../objects/Coin'

class PlayState extends Phaser.State {
  constructor() {
    super();
    this.platforms = null;
    this.hero = null;
    this.keys = null;

    this._loadLevel = this._loadLevel.bind(this);
    this._spawnPlatform = this._spawnPlatform.bind(this);
    this._spawnCharacters = this._spawnCharacters.bind(this);
    this._handleInput = this._handleInput.bind(this);
    this._onHeroVsCoin = this._onHeroVsCoin.bind(this);
  }

  init(data) {
    console.log(data)
    this.game.renderer.renderSession.roundPixels = true;
    this.keys = this.game.input.keyboard.addKeys({
      left: Phaser.KeyCode.LEFT,
      right: Phaser.KeyCode.RIGHT,
      up: Phaser.KeyCode.UP
    });
    this.keys.up.onDown.add(() => {
      let didJump = this.hero.jump()
      if (didJump) {
        this.sfx.jump.play()
      }
    });

    this.coinPickupCount = 0;
    this.hasKey = false;

    this.level = 1;
  }

  preload() {
    // console.log(this.img_background);
    game.load.image('background', assest.img_background);
    game.load.image('ground', assest.img_ground);
    game.load.image('grass:1x1', assest.img_grass_1x1);
    game.load.image('grass:2x1', assest.img_grass_2x1);
    game.load.image('grass:4x1', assest.img_grass_4x1);
    game.load.image('grass:6x1', assest.img_grass_6x1);
    game.load.image('grass:8x1', assest.img_grass_8x1);
    game.load.image('invisible-wall', assest.img_invisible_wall);
    game.load.image('icon:coin', assest.img_coin_icon);
    game.load.image('font:numbers', assest.img_numbers);
    game.load.image('key', assest.img_key);
    game.load.spritesheet('coin', assest.img_coin_animated, 22, 22);
    game.load.spritesheet('spider', assest.img_spider, 42, 32);
    game.load.spritesheet('hero', assest.img_hero, 36, 42);
    game.load.spritesheet('door', assest.img_door, 42, 66);
    game.load.spritesheet('icon:key', assest.img_key_icon, 34, 30);
    game.load.json('level:0', assest.data_level00);
    game.load.json('level:1', assest.data_level01);
    game.load.audio('sfx:jump', assest.audio_jump);
    game.load.audio('sfx:coin', assest.audio_coin);
    game.load.audio('sfx:stomp', assest.audio_stomp);
    game.load.audio('sfx:key', assest.audio_key);
    game.load.audio('sfx:door', assest.audio_door);
  }

  create() {
    // create sound entities
    this.sfx = {
      jump: this.game.add.audio('sfx:jump'),
      coin: this.game.add.audio('sfx:coin'),
      stomp: this.game.add.audio('sfx:stomp'),
      key: this.game.add.audio('sfx:key'),
      door: this.game.add.audio('sfx:door')
    }
    this.game.add.image(0, 0, 'background');
    this._loadLevel(game.cache.getJSON(`level:${this.level}`));
    this._createHud();
  }

  update() {
    this._handleInput();
    this._handleCollisions();
    this.coinFont.text = `x${this.coinPickupCount}`
    this.keyIcon.frame = this.hasKey ? 1 : 0;
  }

  // 创建UI
  _createHud() {
    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);
    this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, PlayState.HUMBERS_STR, 6);
    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width, coinIcon.height/2, this.coinFont);
    coinScoreImg.anchor.set(0, 0.5)

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.position.set(10, 10);
    this.hud.add(coinScoreImg);
    this.hud.add(this.keyIcon);
  }

  // 加载关卡
  _loadLevel(data) {
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;
    data.platforms.forEach(this._spawnPlatform, this)
    this._spawnCharacters({hero: data.hero, spiders: data.spiders})
    data.coins.forEach(this._spawnCoin, this)
    this._spawnDoor(data.door.x, data.door.y)
    this._spawnKey(data.key.x, data.key.y)
    const GRAVITY = 1200
    this.game.physics.arcade.gravity.y = GRAVITY
  }

  // 生成平台
  _spawnPlatform(platform) {
    let sprite = new Platform(game, platform.x, platform.y, platform.image)
    this.platforms.add(sprite);
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x+sprite.width, platform.y, 'right');
  }

  // 生成敌人活动的范围墙
  _spawnEnemyWall(x, y, side) {
    let sprite = new EnemyWall(game, x, y, 'invisible-wall', side);
    this.enemyWalls.add(sprite);
  }

  // 生成角色（玩家 和 敌人）
  _spawnCharacters(data) {
    // spawn spiders
    console.log(data)
    data.spiders.forEach((spider) => {
      let sprite = new Spider(this.game, spider.x, spider.y, 'spider')
      this.spiders.add(sprite)
    }, this)

    this.hero = new Hero(game, data.hero.x, data.hero.y, 'hero')
    game.add.existing(this.hero)
  }

  // 生成门
  _spawnDoor(x, y) {
    this.door = new Door(game, x, y, 'door');
    this.bgDecoration.add(this.door);
  }

  // 生成钥匙
  _spawnKey(x, y) {
    this.key = new Key(game, x, y, 'key');
    this.bgDecoration.add(this.key);
  }

  // 生成金币
  _spawnCoin(coin) {
    let sprite = new Coin(game, coin.x, coin.y, 'coin');
    this.coins.add(sprite);
  }

  // 处理用户输入
  _handleInput() {
    if (this.keys.left.isDown) {
      this.hero.move(-1);
    } else if(this.keys.right.isDown) {
      this.hero.move(1);
    } else {
      this.hero.move(0);
    }
  }

  // 处理碰撞
  _handleCollisions() {
    this.game.physics.arcade.collide(this.spiders, this.platforms)
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls)
    this.game.physics.arcade.collide(this.hero, this.platforms)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this)
    this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey, null, this)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
      (hero, door) => {return this.hasKey && hero.body.touching.down},
      this
    )
  }

  // 玩家与门的交互
  _onHeroVsDoor(hero, door) {
    this.sfx.door.play();
    this.game.state.restart();
  }

  // 玩家与钥匙的交互
  _onHeroVsKey(hero, key) {
    this.sfx.key.play();
    key.kill();
    this.hasKey = true;
  }

  // 玩家与金币的交互
  _onHeroVsCoin(hero, coin) {
    this.sfx.coin.play();
    coin.kill()
    this.coinPickupCount ++;
  }

  // 玩家与敌人的交互
  _onHeroVsEnemy(hero, enemy) {
    if (hero.body.velocity.y > 0) {
      enemy.die();
      hero.bounce();
      enemy.kill();
      this.sfx.stomp.play();
    } else {
      this.sfx.stomp.play();
      this.game.state.restart();
    }
  }
}

PlayState.LEVEL_COUNT = 2;
PlayState.HUMBERS_STR = '0123456789X ';

export default PlayState;
