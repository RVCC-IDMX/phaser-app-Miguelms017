import Phaser from 'phaser';

/**
 * Gameplay Scene
 * Main Scene with characters
 */

export default class GameplayScene extends Phaser.Scene {
  constructor() {
    //scene key
    super({ key: 'GameplayScene' });

    //initialize properties
    this.player = null;
    this.cursor = null;
    this.grid = [];
    this.cellSize = 40;
    this.gridWidth = 30;
    this.gridHeight = 15;
    this.wallsGroup = null;
    this.cursors = null;
    this.keyItem = null;
    this.goal = null;
    this.hasKey = false;
  }

  /**
  * create project and set up gameplay
  */

  create(){
    //walls
    this.wallsGroup = this.physics.add.staticGroup();

    // maze
    this.createMaze();

    // player
    this.createPlayer();

    // add a key and the goal
    this.placeKeyAndGoal();

    //input
    this.cursors = this.input.keyboard.createCursorKeys();

    //collisions
    this.physics.add.collider(this.player, this.wallsGroup);
  }

  /**
   * create a new maze
   */

  createMaze(){
    // initialize grid (1 = wall)
    this.grid = [];
    for (let y = 0; y < this.gridHeight; y++) {
      this.grid.push(Array(this.gridWidth).fill(1));
    }

    // start in a random cell
    const startX = Math.floor(Math.random() * this.gridWidth);
    const startY = Math.floor(Math.random() * this.gridHeight);
    this.grid[startY][startX] = 0; //0 = path

    // backtracking
    this.carvePath(startX, startY);

    // create maze ealls
    this.drawMaze();
  }

  /**
   * seek for a path
   */

  carvePath(x, y){
    const directions =[
      {dx: -1, dy: 0}, //left
      {dx: 1, dy: 0}, //right
      {dx: 0, dy: -1}, //up
      {dx: 0, dy: 1}, //Down
    ];

    // randomize directions
    Phaser.Utils.Array.Shuffle(directions);

    for (const dir of directions){
      const newX = x + dir.dx * 2;
      const newY = y + dir.dy * 2;

      // check positions
      if (newX > 0 && newX < this.gridWidth &&
            newY > 0 && newY < this.gridHeight &&
            this.grid[newY][newX] === 1
      ) {
        //seek directions
        this.grid[y + dir.dy][x + dir.dx] = 0;
        this.grid[newY][newX] = 0;
        this.carvePath(newX, newY);
      }
    }
  }

  /**
   * drawing maze
   */

  drawMaze(){
    this.wallsGroup.clear(true, true);
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y][x] === 1) {
          const worldX = (x + 0.5) * this.cellSize;
          const worldY = (y + 0.5) * this.cellSize;
          this.wallsGroup.create(worldX, worldY, 'wall').setOrigin(0.5);
        }
      }
    }
    this.physics.world.setBounds(0, 0, this.gridWidth * this.cellSize, this.gridHeight *
        this.cellSize);
  }

  /**
  * player setup
  */

  createPlayer(){
    // set point of spawn
    let startX, startY;
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++){
        if (this.grid[y][x] === 0) {
          startX = ( x + 0.5 ) * this.cellSize;
          startY = ( y + 0.5 ) * this.cellSize;
          break;
        }
      }
      if (startX !== undefined) {
        break;
      }
    }

    // spawn player
    this.player = this.physics.add.sprite(startX, startY, 'player').setScale(1.5);

    //physics
    this.player.setCollideWorldBounds(true);
  }

  /**
   * creating a goal and a key to unlock it
   */

  placeKeyAndGoal(){
    const pathCells = [];
    for (let y = 0; y < this.gridHeight; y++) {
      for (let x = 0; x < this.gridWidth; x++) {
        if (this.grid[y][x] === 0) {
          pathCells.push({ x, y });
        }
      }
    }

    Phaser.Utils.Array.Shuffle(pathCells);

    //create key and goal
    const keyCell = pathCells[0];
    const goalCell = pathCells[1];

    //spawn key
    const keyX = (keyCell.x + 0.5) * this.cellSize;
    const keyY = (keyCell.y + 0.5) * this.cellSize;
    this.keyItem = this.physics.add.sprite(keyX, keyY, 'key').setScale(0.25);
    this.physics.add.overlap(this.player, this.keyItem, () => {
      this.hasKey = true;
      this.keyItem.destroy();
    });

    //spawn goal
    const goalX = (goalCell.x + 0.5) * this.cellSize;
    const goalY = (goalCell.y + 0.5) * this.cellSize;
    this.goal = this.physics.add.staticSprite(goalX, goalY, 'goal').setScale(0.25);
    this.goal.body.setSize(32, 32);
    this.goal.body.setOffset(48, 48);
    this.physics.add.overlap(this.player, this.goal, () => {
      if (this.hasKey){
        //open goal
        this.goal.setTexture('goal_open');
        this.hasKey = false;
        this.scene.restart();
      }
    });
  }

  /**
   *update by frame
   */

  update() {
    const speed = 200; //current speed in pixels/s
    if (!this.player){
      return;
    }

    //player movement
    this.player.setVelocity(0);
    if (this.cursors){
      if (this.cursors.left.isDown){
      // move to the left
        this.player.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
      // move to the right
        this.player.setVelocityX(speed);
      } else if (this.cursors.up.isDown){
      // move up
        this.player.setVelocityY(-speed);
      } else if (this.cursors.down.isDown){
      // move down
        this.player.setVelocityY(speed);
      } else {
        this.player.setVelocity(0);
      }
    } else {
      this.player.setVelocity(0);
    }
  }
}