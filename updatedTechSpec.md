# Classes
# Technical Specification: Additional Game Scripts

## CameraController.cs

Attached to MainCamera in Scene.

### Class Overview
Manages camera movement to follow the player vertically

### Public Variables
- `pc` (PlayerController): Reference to the player controller for tracking player position

### Methods
- `Start()`: Currently empty, no initialization logic
- `Update()`: 
  - Updates camera's vertical position to match the player's y-coordinate
  - Maintains the original x and z positions of the camera

## HealthController.cs

Attached to PlayerController in Scene.

### Class Overview
Manages player health mechanics, including health bar UI and game state

### Public Variables
- `health` (int): Current player health
- `lh` (LevelHandler): Reference to level handler for game state management
- `maxHealth` (int): Maximum possible health (default 50)
- `healthBarUI` (Slider): UI slider representing player's health

### Methods
- `Start()`: 
  - Initializes health bar UI
  - Sets maximum health value
  - Sets initial health bar value

- `Update()`: 
  - Checks if health has dropped to zero
  - Triggers end game if health reaches 0

- `endGame()`: 
  - Calls level handler to display death UI

- `decHealth()`: 
  - Reduces health by 2 points
  - Updates health bar slider

- `incHealth()`: 
  - Increases health by 20 points
  - Prevents health from exceeding maximum health
  - Updates health bar slider

## LevelHandler.cs

Attached to LevelHandler in Scene.

### Class Overview
Manages game state, UI for win/loss conditions, and level reloading

### Public Variables
- `gameLoss` (GameObject): UI object for game loss screen
- `gameWin` (GameObject): UI object for game win screen

### Methods
- `Start()`: 
  - Hides both game loss and game win UI elements on initial load

- `deathUI()`: 
  - Activates game loss UI when player dies

- `winUI()`: 
  - Activates game win UI when player reaches the level goal

- `reloadLevel()`: 
  - Reloads the game scene (Scene index 1)

## PlayerController.cs

Attached to PlayerController in Scene.

### Class Overview
Manages player movement, interactions, and game state in a tile-based environment.

### Public Variables
- `playerMap` (Tilemap): Tilemap for player representation
- `tm` (Tilemap): Main game tilemap
- `playerTile` (TileBase): Tile representing the player
- `playerPos` (Vector2Int): Current player position
- `tileManager` (tileBehaviorManager): Reference to tile behavior management
- `pg` (ProceduralGenerator): Reference to procedural level generation
- `orientation` (int): Player's current orientation (-1: left, 0: down, 1: right)
- `hc` (HealthController): Reference to health management
- `lh` (LevelHandler): Reference to level handling
- `playerEffects` (GameObject): Player effect prefab
- `playerEffectsInstance` (GameObject): Instantiated player effects

### Private Variables
- `timer` (float): Used for managing fall timing

### Methods
- `Start()`: 
  - Initializes player position
  - Creates player effects instance
  - Places player tile on the map

- `Update()`: 
  - Handles player input
  - Manages movement (A/D keys for horizontal, W for vertical)
  - Handles tile destruction on left mouse click
  - Checks for falling
  - Manages healing
  - Checks win/lose conditions

- `checkFall()`: 
  - Implements player falling mechanism
  - Limits fall distance to prevent infinite falling

- `fallAnim()`: Coroutine for fall animation (currently empty)

- `heal()`: 
  - Increases player health when on health tile
  - Removes health tile after healing

## ProceduralGenerator.cs

Attached to Grid in Scene.

### Class Overview
Responsible for procedural level generation and tile placement

### Public Variables
- `width` (int): Level width
- `height` (int): Level height
- `tm` (Tilemap): Main game tilemap
- `healthMap` (Tilemap): Tilemap for health tiles
- `allTileType` (TileBase[]): Array of possible tile types
- `healthTile` (TileBase): Tile representing health pickup
- `emptyTile` (TileBase): Represents an empty tile
- `healthEffectPos` (Dictionary<Vector3, Vector3>): Tracks health effect positions
- `healEffect` (GameObject): Prefab for heal effect
- `spawnRate` (float): Probability of spawning health tiles

### Private Variables
- `mapOfType` (int[,]): 2D array tracking tile types

### Methods
- `Start()`: 
  - Generates random tile layout
  - Spawns health tiles based on spawn rate
  - Creates heal effect instances

## tileBehaviorManager.cs

Attached to TileBehaviorManager in Scene.

### Class Overview
Manages tile behavior, including cascading and falling mechanics

### Public Variables
- `tm` (Tilemap): Main game tilemap
- `pg` (ProceduralGenerator): Reference to procedural generation
- `visited` (bool[,]): Tracks visited tiles
- `rows` (int): Number of rows in the level
- `cols` (int): Number of columns in the level
- `startingPos` (Vector3Int): Starting position for cascading
- `test` (TileBase): Test tile (currently unused)
- `pc` (PlayerController): Reference to player controller
- `tileFallDelay` (float): Delay between tile falling steps

### Methods
- `Start()`: 
  - Initializes visited tiles array
  - Sets rows and columns based on procedural generator

- `Update()`: 
  - Continuously checks for block falling

- `cascade(Vector3Int pos, TileBase tileBase)`: 
  - Triggers tile deletion for connected tiles
  - Calls `findConnected()` to determine tiles to delete

- `findConnected(Vector3Int pos, TileBase tileBase, bool[,] visited)`: 
  - Recursive method to find connected tiles of the same type
  - Uses depth-first search to identify connected tiles

- `checkBlockFall()`: 
  - Iterates through tiles to check for falling blocks
  - Starts fall animation for unsupported tiles

- `fallAnim(Vector3Int pos, TileBase tb)`: 
  - Coroutine for animating tile falling
  - Moves tile down one step after a delay


