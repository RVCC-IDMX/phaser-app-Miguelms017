// Import Phaser
import Phaser from 'phaser';

// Import Scenes
import TitleScreen from './scenes/TitleScreen';
import GameplayScene from './scenes/GameplayScene';

// Game configurations
const config = {
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  backgroundColor: '#567d46',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y:0}, //no gravity for horizontal movement
      debug: false  // activated to see collision boxes
    }
  },
  scene: [TitleScreen, GameplayScene]
};

//game instance
new Phaser.Game(config);