// Game variables
let board = [];
const rows = 50;
const cols = 4;
let playerPosition = { row: 0, col: 0 };
let startTime, timerInterval;
let isAnimating = false;
const PLAYER_FALL_SPEED = 0.1; 
const BLOCK_FALL_SPEED = 0.025; 
let playerVisualPosition = { row: 0, col: 0 };

let isJumping = false;
const HARD_BLOCK_HITS = 3; // Number of hits required to break hard blocks
let hardBlockHealth = {};

const DIRECTION = {
    LEFT: -1,
    RIGHT: 1,
    DOWN: 0  
};
let playerDirection = DIRECTION.RIGHT;

let fallingBlocks = new Set(); // Track blocks that are currently falling
let blockVisualPositions = {};

// Initialize board with random colors
function initBoard() {
    board = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => {
            // 20% chance of spawning a hard block
            return Math.random() < 0.2 ? 5 : Math.floor(Math.random() * 4) + 1;
        })
    );
    
    // Clear first row
    for (let i = 0; i < board[0].length; i++) {
        board[0][i] = null;
    }

    // Initialize health for hard blocks
    hardBlockHealth = {};
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            if (tile === 5) {
                hardBlockHealth[`${rowIndex},${colIndex}`] = HARD_BLOCK_HITS;
            }
        });
    });
    
    renderBoard();
}

function endGameByBlockHit() {
    clearInterval(timerInterval);
    const timeTaken = (Date.now() - startTime) / 1000;
    alert(`Game Over! You were crushed by a falling block! Time: ${timeTaken} seconds`);
    isAnimating = false;
    
    // Optional: Restart game
    setTimeout(() => {
        if (confirm("Would you like to play again?")) {
            initBoard();
            startTimer();
            playerPosition = { row: 0, col: 0 };
            playerVisualPosition = { ...playerPosition };
            fallingBlocks.clear();
            blockVisualPositions = {};
        }
    }, 100);
}


// Render the board in HTML
function renderBoard() {
    const boardDiv = document.getElementById("game-board");
    boardDiv.innerHTML = "";
    
    // Create a temporary board for rendering that includes falling blocks
    let renderBoard = board.map(row => [...row]);
    
    // Render the base board
    board.forEach((row, rowIndex) => {
        row.forEach((tile, colIndex) => {
            const tileDiv = document.createElement("div");
            tileDiv.classList.add("tile");
            
            // Skip rendering if this position has a falling block
            const blockId = `${rowIndex},${colIndex}`;
            if (fallingBlocks.has(blockId)) {
                tileDiv.classList.add("dug");
            } else if (tile === null) {
                tileDiv.classList.add("dug");
            } else if (tile === 5) {
                tileDiv.classList.add("tile-hard");
                const health = hardBlockHealth[`${rowIndex},${colIndex}`];
                tileDiv.textContent = health;
            } else {
                tileDiv.classList.add(`tile-${tile}`);
            }
            
            boardDiv.appendChild(tileDiv);
        });
    });
    
    // Render falling blocks
    fallingBlocks.forEach(blockId => {
        const [originalRow, originalCol] = blockId.split(',').map(Number);
        const visualPos = blockVisualPositions[blockId];
        
        if (visualPos) {
            //console.log (visualPos.row + " " + visualPos.col);
            const blockDiv = document.createElement("div");
            blockDiv.classList.add("tile");
            
            const blockType = board[Math.floor(visualPos.row)][originalCol];
            if (blockType === 5) {
                blockDiv.classList.add("tile-hard");
                const health = hardBlockHealth[`${originalRow},${originalCol}`];
                blockDiv.textContent = health;
            } else {
                blockDiv.classList.add(`tile-${blockType}`);
            }
            
            blockDiv.style.position = "absolute";
            blockDiv.style.top = `${visualPos.row * 52}px`;
            blockDiv.style.left = `${visualPos.col * 50}px`;
            
            blockDiv.style.transition = 'top 5s ease-in';
            boardDiv.appendChild(blockDiv);
        }
    });
    
    // Render player
    let playerDiv = document.createElement('div');
    playerDiv.classList.add('player');
    playerDiv.style.top = `${playerVisualPosition.row * 52}px`;
    playerDiv.style.left = `${playerVisualPosition.col * 50}px`;
    
    if (playerDirection === DIRECTION.DOWN) {
        playerDiv.style.transform = 'rotate(180deg)';
    } else {
        playerDiv.style.transform = `scaleX(${playerDirection})`;
    }
    
    boardDiv.appendChild(playerDiv);
}

function handleMouseClick(event) {
    //if (isAnimating) return;

    const boardDiv = document.getElementById("game-board");
    const rect = boardDiv.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Convert click coordinates to grid positions
    const clickedCol = Math.floor(clickX / 50);
    const clickedRow = Math.floor(clickY / 52);
    
    // Only allow digging if clicked position is adjacent to player
    const { row, col } = playerPosition;
    
    if (playerDirection === DIRECTION.DOWN) {
        // For downward direction, only allow digging below
        // if (clickedCol === col && clickedRow === row + 1) {
        //     digInDirection(DIRECTION.DOWN);
        // }
        digInDirection(DIRECTION.DOWN);
    } else {
        // For left/right directions, allow digging in the facing direction
        // const targetCol = col + playerDirection;
        // if ((clickedCol === targetCol && clickedRow === row) || // Same row
        //     (clickedCol === targetCol && clickedRow === row + 1)) { // One row below
            
        // }
        digInDirection(playerDirection);
    }
}

function animateBlockFall(blockId, targetRow, row, col, blockType) {
    //isAnimating = true;
    
    function animate() {
        const visualPos = blockVisualPositions[blockId];
        if (!visualPos) return;
        
        // Update visual position
        if (visualPos.row < targetRow) {
            visualPos.row += BLOCK_FALL_SPEED;
            console.log ("falling falling falling");
            // Check for collision with player
            const playerTop = playerVisualPosition.row;
            const playerCol = playerVisualPosition.col;
            
            if (Math.floor(visualPos.row) === playerTop && col === playerCol) {
                endGameByBlockHit();
                return;
            }
            
            renderBoard();
            requestAnimationFrame(animate);
        } else {
            // Finalize position
            visualPos.row = targetRow;
            fallingBlocks.delete(blockId);
            board[targetRow][col] = blockType;
            board[row][col] = null;

            // If all blocks have finished falling
            if (fallingBlocks.size === 0) {
                console.log ("idk");
                isAnimating = false;
                checkFallingBlocks();
                
                // Check for matches
                if (blockType !== 5) { // Don't check matches for hard blocks
                    const matches = findConnectedTiles(targetRow, col, blockType);
                    if (matches.length > 1) {
                        matches.forEach(({r, c}) => {
                            board[r][c] = null;
                        });
                        setTimeout(() => {
                            checkFallingBlocks();
                        }, 100);
                    }
                }
            }
            
            renderBoard();
        }
    }
    
    requestAnimationFrame(animate);
}

// Move the player horizontally
function animatePlayerFall(targetRow) {
    // if (isAnimating) {
    //     return;
    // }
    isAnimating = true;

    function animate() {
        // Calculate new visual position
        if (playerVisualPosition.row < targetRow) {
            playerVisualPosition.row = Math.min(
                playerVisualPosition.row + PLAYER_FALL_SPEED,
                targetRow
            );
            renderBoard();
            
            // Continue animation if not at target
            if (playerVisualPosition.row < targetRow) {
                requestAnimationFrame(animate);
            } else {
                isAnimating = false;
                // Check if player reached the bottom after animation
                if (playerPosition.row >= rows - 1) {
                    endGame();
                }
            }
        } else {
            isAnimating = false;
        }
    }

    requestAnimationFrame(animate);
}

// Modified digTile function to use animation
function findConnectedTiles(r, c, color, visited = new Set()) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || 
        board[r][c] !== color || 
        visited.has(`${r},${c}`)) {
        return [];
    }

    visited.add(`${r},${c}`);
    const connectedTiles = [{r, c}];

    // Check adjacent tiles (up, down, left, right)
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    
    for (const [dr, dc] of directions) {
        const newTiles = findConnectedTiles(r + dr, c + dc, color, visited);
        connectedTiles.push(...newTiles);
    }

    return connectedTiles;
}

// Modify the digInDirection function to include falling blocks check
function digInDirection(direction) {
    //if (isAnimating) return;

    const { row, col } = playerPosition;
    
    const targetCol = col + (direction === DIRECTION.DOWN ? 0 : direction);
    const targetRow = direction === DIRECTION.DOWN ? row + 1 : row;
    
    if (targetCol < 0 || targetCol >= cols || targetRow >= rows) return;
    
    if (targetRow >= rows - 1) {
        endGame();
        return;
    }

    const targetTile = board[targetRow][targetCol];
    if (targetTile === null) return;

    let shouldFall = false;

    if (targetTile === 5) {
        // Handle hard block
        const key = `${targetRow},${targetCol}`;
        if (hardBlockHealth[key] > 1) {
            hardBlockHealth[key]--;
            renderBoard();
            return;
        } else {
            delete hardBlockHealth[key];
            board[targetRow][targetCol] = null;
            shouldFall = true;
        }
    } else {
        // Handle regular colored blocks
        const tilesToDestroy = findConnectedTiles(targetRow, targetCol, targetTile);
        console.log ("should fall1");
        if (tilesToDestroy.length > 0) {
            tilesToDestroy.forEach(({r, c}) => {
                board[r][c] = null;
            });
            console.log ("should fall");
            shouldFall = true;
        }
    }

    // Check if player needs to fall
    if (shouldFall) {
        // First check for falling blocks
        checkFallingBlocks();
        
        // Then check player fall
        let newRow = row;
        while (newRow < rows && board[newRow][col] === null) {
            newRow++;
        }
        if (newRow !== row) {
            playerPosition.row = Math.min(newRow - 1, rows - 1);
            animatePlayerFall(playerPosition.row);
        }
    }

    renderBoard();
}

function movePlayer(direction) {
    //if (isAnimating) return;
    
    if (direction !== DIRECTION.DOWN) {
        playerDirection = direction;
    }
    
    const { row, col } = playerPosition;
    const targetCol = col + (direction === DIRECTION.DOWN ? 0 : direction);
    
    if (direction !== DIRECTION.DOWN && targetCol >= 0 && targetCol < cols && board[row][targetCol] === null) {
        playerPosition.col = targetCol;
        playerVisualPosition.col = targetCol;
        
        // Check for falling blocks after player movement
        checkFallingBlocks();

        if (row + 1 < rows && board[row + 1][targetCol] === null) {
            let newRow = row + 1;
            while (newRow < rows && board[newRow][targetCol] === null) {
                newRow++;
            }
            playerPosition.row = Math.min(newRow - 1, rows - 1);
            
            animatePlayerFall(playerPosition.row);
        }
    }

    renderBoard();
}

function checkFallingBlocks() {
    if (isAnimating) return;
    
    let blocksFell = false;
    fallingBlocks.clear();
    
    // Start from second-to-last row
    for (let row = rows - 2; row >= 0; row--) {
        for (let col = 0; col < cols; col++) {
            const currentBlock = board[row][col];
            
            // Skip empty spaces
            if (currentBlock === null) continue;
            
            // Check if there's empty space below
            if (board[row + 1][col] === null) {
                // Find how far the block can fall
                let targetRow = row + 1;
                while (targetRow < rows - 1 && board[targetRow + 1][col] === null) {
                    targetRow++;
                }
                
                // Set up the falling animation
                const blockId = `${row},${col}`;
                fallingBlocks.add(blockId);
                
                // Initialize visual position if not exists
                if (!blockVisualPositions[blockId]) {
                    blockVisualPositions[blockId] = { row: row, col: col };
                }
                
                // Move the block in the game logic
                if (currentBlock === 5) {
                    // Move hard block and its health
                    const healthKey = `${row},${col}`;
                    const newHealthKey = `${targetRow},${col}`;
                    hardBlockHealth[newHealthKey] = hardBlockHealth[healthKey];
                    delete hardBlockHealth[healthKey];
                }

                animateBlockFall(blockId, targetRow, row, col, currentBlock);
                
                
                // Start animation for this block
                
                blocksFell = true;
            }
        }
    }
    
    return blocksFell;
}



// Start and record the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        document.getElementById("timer").textContent = `Time: ${(Date.now() - startTime) / 1000}s`;
    }, 100);
}

function endGame() {
    clearInterval(timerInterval);
    const timeTaken = (Date.now() - startTime) / 1000;
    alert(`Game over! You finished in ${timeTaken} seconds.`);
}

let fallTimer;
const FALL_DELAY = 100; // Fall after 2 seconds without input

document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    clearTimeout(fallTimer); // Clear any existing fall timer

    // Check if the player can jump up
    if (key === 'w' && playerPosition.row > 0 && !isAnimating) {
        isJumping = true;
        const aboveTile = board[playerPosition.row - 1][playerPosition.col];
        
        // Only jump if there's no blocking tile above
        if (aboveTile === null) {
            playerPosition.row -= 1;
            updatePlayerVisualPosition();
            //console.log ("falling down");
            
        }
        startFallTimer(); // Start the fall timer after jumping
    }

    console.log (playerPosition.row);
    
    // Check for lateral movement during a jump
    if ((key === 'a' || key === 'd') && playerPosition.row > 0 && isJumping) {
        const newCol = key === 'a' ? playerPosition.col - 1 : playerPosition.col + 1;
        
        // Ensure the player stays within bounds and there's no blocking tile
        const sideTile = board[playerPosition.row][newCol];
        //console.log (sideTile+"====");
        if (newCol >= 0 && newCol < cols && board[playerPosition.row][newCol] === null) {
            playerPosition.col = newCol;
            updatePlayerVisualPosition();
            playerPosition.col -= newCol;
            updatePlayerVisualPosition();
            console.log ("siding down");
        }
        
        startFallTimer();
        updatePlayerVisualPosition();
    }
});

function startFallTimer() {
    fallTimer = setTimeout(() => {
        fallDown();
    }, FALL_DELAY);
}

// Function to make the player fall if there's no input
function fallDown() {
    isJumping = false;
    if (playerPosition.row < rows) {
        const belowTile = board[playerPosition.row + 1][playerPosition.col];
        
        // Fall if there's no blocking tile below
        if (belowTile === null) {
            playerPosition.row += 1;
            updatePlayerVisualPosition();
            startFallTimer();// Restart the fall timer to continue falling if needed
        }
        //startFallTimer();
    }
}

// Function to update the player's position on the board
function updatePlayerVisualPosition() {
    playerVisualPosition.row = playerPosition.row;
    playerVisualPosition.col = playerPosition.col;
    renderBoard(); // Assumes you have a function to visually update the player's position
}

// Event listeners for keyboard inputs
window.onload = () => {
    initBoard();
    startTimer();
    playerVisualPosition = { ...playerPosition };
    
    document.addEventListener("keydown", (event) => {
        if (event.key === "a") {
            movePlayer(DIRECTION.LEFT);
        } else if (event.key === "d") {
            movePlayer(DIRECTION.RIGHT);
        } else if (event.key === "s") {
            playerDirection = DIRECTION.DOWN;
            renderBoard();
        }
    });

    // Add mouse click listener
    document.getElementById("game-board").addEventListener("click", handleMouseClick);
};
