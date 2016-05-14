if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

/**
 * Height Grid (Terrain) component for A-Frame.
 */
AFRAME.registerComponent('heightgrid', {
  schema: { 
		dependencies: ['faceset'],		
    origin: { 
			default: { x: 0, y: 0, z: 0 } },
		xdimension: {
			default: 0 },
		zdimension: {
			default: 0 },
		xspacing: {
			default: 1 },
		zspacing: {
			default: 1 },
		heights: {
			default: [],
			parse: function (value) { return parseFloats (value) } ,
			stringify: function (value) { return stringifyFloats (value) }
		}
	}, 

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () { },

  /**
   * Called when component is attached and when component data changes.
   * Generally modifies the entity based on the data.
   */
  update: function (oldData) { },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { },

  /**
   * Called on each scene tick.
   */
  // tick: function (t) { },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () { },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () { },
});
