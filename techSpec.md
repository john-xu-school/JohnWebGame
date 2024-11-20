### **Technical Specifications**

#### **1. Game Class:** Powers the actual game.

**Variables:**
- `player`: Instance of the **Player** class.
- `tilemap`: 2D array representing the tile grid; uses the TileMap Class' generate method.
- `elapsedTime`: The timer tracking how long the player has been playing in the current round.
- `isGameOver`: Boolean to track if the game has ended/if the player has reached the bottom row.

**Methods:**
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

#### **7. Scoring and Performance**
1. **`trackBestTime()`**
   - Stores the fastest time in local storage.
   - Displays it on the end-game screen.

2. **`restartGame()`**
   - Resets the game state.
   - Generates a new tilemap and repositions the player.

---

#### **8. Visual and Audio Effects**
1. **Tilemap Display:**
   - Use a scrollable grid layout for the tilemap in CSS.
   - Clearly distinguish between different tile colors.

2. **Player Indicator:**
   - Highlight the player's position with a distinct overlay.

3. **Sound Effects (Optional):**
   - Play sounds for digging, tile destruction, and falling.


---

#### **2. Tilemap Class**
Handles the grid layout and logic.

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

---

#### **3. Player Class**
Represents the player character and player interactions.

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

---

#### **4. Key Input**
| Action        | Key       | Description                                      |
|---------------|-----------|--------------------------------------------------|
| Move Left     | `A`       | Calls `Player.movePlayer('left')`.               |
| Move Right    | `D`       | Calls `Player.movePlayer('right')`.              |
| Dig Down      | `Space`   | Calls `Player.digTile()` to destroy tiles.        |

---

#### **5. Animations**
1. **`animateTileDestruction()`**
   - Applies a fade-out effect to destroyed tiles.
   - Updates the tilemap display after destruction.

2. **`animatePlayerFall()`**
   - Smoothly transitions the player's position when falling.
   - Uses CSS transitions or JavaScript animations.

---

#### **6. Timer**
1. **`startTimer()`**
   - Initializes `startTime`.
   - Continuously updates `elapsedTime` in the UI.

2. **`stopTimer()`**
   - Records final time upon reaching the 50th row.
   - Stops updating `elapsedTime`.

---

#### **Code Structure**

##### **HTML**
- **Game Area:** 
  - A `div` container for the tilemap grid.
  - A separate section for the timer and controls.

##### **CSS**
- **Tile Colors:** Predefined styles for the four tile colors.
- **Transitions:** Smooth animations for tile destruction and player movement.

##### **JavaScript**
- **Event Listeners:** For keyboard inputs (`A`, `D`, `Space`).
- **Game Logic:** Separate modules for tilemap generation, player actions, and animations.
