# P0
- Implement all of basic tiles of `ProceduralGenerator`
- Implement all direction movement, falling, jumping of player in `PlayerController`.
- Implement all of `tileBehaviorManager`, including things like cascading and falling blocks.
- Implement all of `cameraController`, simply allowing camera to follow player movement.

# P1
- Add healing tiles in `ProceudralGenerator`
- Add healthSystem and gameLoop via `levelHandler`, decremeting health when players perform certain actions and ending the game when health is depleted.
- Implement `healthController` to keep track of health of player, referencing `levelHandler` methods when necessary.

# P2
- Add better tile assets, update render pipeline, special effects.
- Add hard blocks, which need multiple player inputs to break.
- Spice up procedural generation to not be random. Use actual perlin noise instead.
