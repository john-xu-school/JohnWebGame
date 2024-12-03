# Classes
## `CameraController`

Attached to MainCamera object in game.

`PlayerController pc`
On `update()`, changes the position of the camera the code is attached to the position of the player according to the playerController instance `pc`.

## `HealthController`

Attached to playerController object in game.

On `update()`, checks to see if health is less than or equal to zero. In the case that health reaches 0, ends the game by calling `endGame()`

`decHealth()` decrements the health of the player by `2`.

## `PlayerController`

## `ProceduralGenerator`

## `TileBehaviorManager`

