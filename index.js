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
			parse: function (value) { return parseNumbers (value) } ,
			//stringify: function (value) { return value.toString() }
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
  update: function (oldData) {
    var el = this.el;
    var data = this.data;
    var xdimension = data.xdimension;
    var zdimension = data.zdimension;
    var xspacing = data.xspacing;
    var zspacing = data.zspacing;
    
    var h = data.heights;
    var h = h.length ? h:[0];
    
    //vertices
    var vts = [];
    for (var z = 0; z < zdimension; z++) {
      for (var x = 0; x < xdimension; x++) {
        vts.push( new THREE.Vector3 (
          x * xspacing, h[(x + z * xdimension)%h.length)], z * zspacing ) ); 
      }
    }
    
    el.setAttribute('faceset', { triangles: faces, vertices: vts } );
    
  },

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

function parseNumbers (value) {
	if (typeof value === 'object') {return value}
	var mc = value.match(/([+\-0-9eE\.]+)/g);
	var numbers = [];
	//var vec = {};
	for (var i=0, n=mc?mc.length:0; i<n; i++) {
		//vec = new THREE.Vector2(+mc[i+0], +mc[i+1]);
		numbers.push( parseFloat( mc[i], 10 ) );
	}
	return numbers;
}

