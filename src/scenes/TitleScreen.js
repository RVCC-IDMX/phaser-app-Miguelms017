import Phaser from 'phaser';

/**
 * TitleScreen
 * First screen when game starts
 */
export default class TitleScreen extends Phaser.Scene {
  constructor(){
    //reference key
    super({ key: 'TitleScreen'});
  }

  /**
     * Preload
     */
  preload(){
    this.load.image('player', 'assets/images/New Piskel.gif');
    this.load.image('wall', 'assets/images/New Piskel.png');
    this.load.image('key', 'assets/images/key.png');
    this.load.image('goal', 'assets/images/goal.png');
    this.load.image('goal_open', 'assets/images/goal_open.png');
  }

  /**
     * create objects and set up title screen
     */
  create(){
    //title
    this.add.text(600, 200, 'Maze Dungeons', {
      fontFamily: 'Monospace',
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    //instructions
    this.add.text(600, 300, 'Press any key to start', {
      fontFamily: 'Monospace',
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Listen for Keyboard Input to start the game
    this.input.keyboard.once('keydown', () => {
      console.log('key pressed - would start gameplay scene');
      this.scene.start('GameplayScene');
    });
  }
}