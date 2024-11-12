# Game DESIGN

## Overview
This is a tile-based browser game developed with JavaScript, HTML, and CSS. The player's objective is to navigate through a procedurally generated tilemap of 50 rows by 4 columns, aiming to reach the bottom as fast as possible by "digging" through colored tiles. The player can move horizontally between columns and dig down vertically, with adjacent tiles of the same color being destroyed simultaneously.

## Game Mechanics

### Tilemap Generation
- **Dimensions:** 50 rows x 4 columns.
- **Tile Colors:** Four unique colors represent different tile types.
- **Generation Algorithm:** 
  - **Method:** `generateTilemap(rows, columns, colors)`
  - Procedurally generate the tilemap using a random selection from the four colors, ensuring each tile is assigned a color at random. Consider adding constraints to control clusters or ensure variety.

### Player Actions
- **Movement:** 
  - **Method:** `movePlayer(direction)`
  - The player can move between columns using the `A` (left) and `D` (right) keys.
  
- **Digging:** 
  - **Method:** `digTile()`
  - The player digs down the tile they are currently standing on by pressing `Space`.
    - **Chain Digging:** 
      - **Method:** `destroyTiles(tileType, row, column)`
      - If the player digs a tile with adjacent tiles of the same color (horizontally or vertically), all adjacent same-colored tiles are also destroyed (chain reaction).
    - **Gravity Effect:** 
      - **Method:** `applyGravity()`
      - After digging a tile, the player "falls" to the next available tile in the column, unless there are no tiles below.

### Tile Destruction and Falling Logic
- **Adjacent Destruction:** 
  - **Method:** `destroyAdjacentTiles(row, column)`
  - When a tile is destroyed, any adjacent (above, below, left, right) tiles of the same color are destroyed simultaneously.
  
- **Player Falling Mechanism:**
  - **Method:** `updatePlayerPosition()`
  - If a tile beneath the player is destroyed, the player visually "falls" to the next available tile.
  - **Animation:** 
    - **Method:** `animatePlayerFall()`
    - Implement a smooth falling animation using CSS transitions or JavaScript animation to simulate the player’s descent.

### Game Objective
- The player's goal is to reach the bottom row (50th row) as quickly as possible by digging through tiles.
- Upon reaching the bottom, the game alerts the player of the time spent to reach the end.
  
## Game Controls

| Action        | Key       | Description                                      |
|---------------|-----------|--------------------------------------------------|
| Move Left     | `A`       | Calls `movePlayer('left')` to move the player one column to the left, if within bounds. |
| Move Right    | `D`       | Calls `movePlayer('right')` to move the player one column to the right, if within bounds. |
| Dig Down      | `Space`   | Calls `digTile()` to dig the tile the player is currently on, initiating any chain destruction. |

- **Tile Selection Restriction:** The player can only dig a tile if there is no tile directly above them in the same column.

## Game Flow

1. **Initialization:**
   - **Method:** `initializeGame()`
   - Generate the tilemap with random color assignments.
   - Position the player at the top row in a random column.

2. **Gameplay Loop:**
   - **Method:** `gameLoop()`
   - Await player input for movement or digging.
   - Update player position and tilemap state based on player actions.
   - Check for chain reactions and falling conditions.

3. **End Condition:**
   - When the player reaches the bottom row (50th row), call `displayEndGameMessage(time)` to show an alert with the time taken to complete the game.

## UI and Visual Effects

### Layout
- **Game Area:** 
  - Use a grid layout to create a 50x4 structure for the tilemap.
  - **Method:** `renderTilemap()`
- **Player Indicator:** 
  - **Method:** `updatePlayerIndicator()`
  - Visually represent the player’s current position with a distinct icon or colored overlay on the tile they are standing on.
- **Timer Display:** 
  - **Method:** `updateTimerDisplay()`
  - Display an active timer at the top to show elapsed time since the start.

### Tile Destruction Animation
- **Chain Reaction Effect:**
  - **Method:** `animateTileDestruction()`
  - Implement a brief color flash or fade-out animation when a tile (and any adjacent tiles) is destroyed.
  
- **Player Falling Animation:**
  - **Method:** `animatePlayerFall()`
  - Smooth transition for the player falling down to the next tile, enhancing the game's visual flow.

### Timer
- **Timer Start:** 
  - Begins as soon as the player initiates their first move. 
  - **Method:** `startTimer()`
  
- **Timer Stop:** 
  - Ends once the player reaches the bottom row, with the total time displayed to the player.
  - **Method:** `stopTimer()`

## Code Structure

### HTML
- **Container for the Tilemap:** Use a grid layout to create a 50x4 structure for the tilemap.
- **Timer Display and Player Icon:** Basic elements to display the player's position and elapsed time.

### CSS
- **Tile Colors:** Define unique colors for each tile type.
- **Animations:** CSS transitions for tile destruction and player movement.
- **Grid Layout:** Ensure a fixed-size layout with a scrollable viewport if needed.

### JavaScript
- **Game Logic:** Core game loop to handle player movement, tile destruction, and chain reactions.
- **Event Listeners:** For player inputs (`A`, `D`, and `Space` keys).
- **Procedural Generation:** Call `generateTilemap()` to create the initial tilemap layout with random colors.
- **Timing Logic:** Calculate and display the elapsed time upon reaching the bottom row using `stopTimer()`.

## Additional Considerations

### Scoring and Performance Tracking
- **Local Storage for Best Time:** 
  - **Method:** `trackBestTime()`
  - Track the player's fastest time in local storage and display it upon game completion.
  
- **Replay Option:** 
  - **Method:** `restartGame()`
  - Provide a button to restart the game with a new tilemap.

### Future Enhancements
- **Difficulty Levels:** Introduce different tile color combinations or obstacles.
- **Power-Ups:** Add temporary abilities such as faster digging speed or tile immunity.
