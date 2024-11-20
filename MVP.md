#MVP

---

### Game Panel/Class
**Priority:** P0
**Implementation Timeline:** Day 1

**Core Requirements:**
Variables
-  `player`: Instance of the **Player** class.
- `tilemap`: 2D array representing the tile grid; uses the TileMap Class' generate method.
- `elapsedTime`: The timer tracking how long the player has been playing in the current round.
- `isGameOver`: Boolean to track if the game has ended/if the player has reached the bottom row.
Methods
1. **`initializeGame()`**
   - Generates the tilemap using `Tilemap.generateTilemap()`.
   - Initializes the player at a random column in the top row.
   - Sets up the game timer.

2. **`gameLoop()`**
   - Continuously listens for inputs and updates the game state:
     - Handles player movement.
     - Calls `Player.digTile()` for digging actions.
     - Updates tilemap after destruction.
     - Checks for end-game condition.

3. **`displayEndGameMessage(time)`**
   - Stops the timer.
   - Displays a message with the player's total time.

4. **`trackBestTime()`**
   - Stores the fastest time in local storage.
   - Displays it on the end-game screen.

5. **`restartGame()`**
   - Resets the game state.
   - Generates a new tilemap and repositions the player.

### TileMap Class
**Priority:** P0
**Implementation Timeline:** Day 2
**Variables:**
- `map`: 2D array storing the tile color for each cell.

**Methods:**
1. **`generateTilemap(rows, columns, colors)`**
   - Generates a 2D array with random color assignments.
   - Ensures a balance between randomness and clustering.

2. **`renderTilemap()`**
   - Creates the visual grid layout in the DOM.
   - Updates the display when tiles are destroyed.

3. **`destroyAdjacentTiles(row, column)`**
   - Destroys tiles recursively if they match the given color.
   - Removes tiles visually using `animateTileDestruction()`.

### Player Class
**Priority:** P1

**Variables:**
- `playerX`: Current column of the player.
- `playerY`: Current row of the player.

**Methods:**
1. **`movePlayer(direction)`**
   - Moves the player horizontally based on input (`'left'` or `'right'`).
   - Includes boundary checks (player cannot move outside the grid).
   - Adds a small delay for smooth movement.

2. **`digTile()`**
   - Digs the tile the player is standing on.
   - Triggers `Tilemap.destroyAdjacentTiles()` for chain reactions.
   - Calls `applyGravity()` to handle falling logic.

3. **`applyGravity()`**
   - Updates the player's position to the next available tile below after a dig.
   - Calls `animatePlayerFall()` for smooth transitions.


### Timer
**Priority:** P1

---

# MVP Implementation Plan

## Day 1-2 (Core Framework)
### Game Class
### Player Class

## Day 3-4 (Essential Features)
### TileMap
### Implement all necessary functions to game class

## Day 5 (Enhancement & Testing)
### Add extras