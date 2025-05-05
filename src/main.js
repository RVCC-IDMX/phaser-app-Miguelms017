// Import Phaser
import Phaser from 'phaser';

// Import Scenes

// Game configurations
const config={
  parent: 'game-container',
  type: Phaser.AUTO,
  width: 1200,
  height: 600,
  backgroundColor: '#333',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y:0}, //no gravity for horizontal movement
      debug: true  // activated to see collision boxes
    }
  },
  scene: []
};

//game instance
new Phaser.Game(config);