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
      type: 'vec3',
			default: { x: 0, y: 0, z: 0 } },
		xdimension: {
			default: 2 },
		zdimension: {
			default: 2 },
		xspacing: {
			default: 1 },
		zspacing: {
			default: 1 },
		heights: {
			default: [0],
			parse: function (value) { return parseNumbers (value) } ,
			//stringify: function (value) { return value.toString() }
		},
    yscale: {
      default: 1.0 },
    uvs: { // texture coordinates as list 
      default: [],
      parse: function (value) { return parseVec2s (value) } ,
      stringify: function (data) {
        return data.map( function stringify (data) {
          if (typeof data !== 'object') { return data; }
          return [data.x, data.y].join(' ');
        }).join(',');
      }
    },
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
    var origin = data.origin;
    var xdimension = Math.max(2, data.xdimension);
    var zdimension = Math.max(2, data.zdimension);
    var xspacing = data.xspacing;
    var zspacing = data.zspacing;
    var yscale = data.yscale;
    var h = data.heights;
    var uvs = data.uvs;
    //var h = h.length ? h : [0];
    
    //vertices
    var vts = [];
    for (var z = 0; z < zdimension; z++) {
      for (var x = 0; x < xdimension; x++) {
        vts.push( new THREE.Vector3 (
          origin.x + x * xspacing,
          origin.y + yscale * h[(x + z * xdimension)%h.length],
          origin.z + z * zspacing ) ); 
      }
    }
    //faces
    var faces = [];
    for (var z = 0; z < zdimension-1; z++) {
      for (var x = 0; x < xdimension-1; x++) {
        var i = x + z * xdimension;
	//alternate diagonal
	if ( (x+z)%2 == 0 ) {
	  faces.push( new THREE.Face3( i, i + 1 + xdimension, i + 1 ) );
	  faces.push( new THREE.Face3( i, i + xdimension,  i + 1 + xdimension) );
	}
	else {
	  faces.push( new THREE.Face3( i, i + xdimension, i + 1 ) );
	  faces.push( new THREE.Face3( i + xdimension,  i + 1 + xdimension, i + 1) );
	}
      }
    }
    //uvs
    var _uvs = uvs.map(function copy (uv) {return uv});
    if (_uvs.length == 0) {
      //default aligned with x,z
      for (var z = 0; z < zdimension; z++) {
        for (var x = 0; x < xdimension; x++) {
          _uvs.push(new THREE.Vector2( x/(xdimension-1), z/(zdimension-1) ));
        }
      }
    }
    el.setAttribute('faceset', { triangles: faces, vertices: vts, uvs: _uvs } );
    
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () { this.el.removeAttribute('faceset'); }

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

function parseVec2s (value) {
  if (typeof value === 'object') {return value} // perhaps also check value.isArray
  var mc = value.match(/([+\-0-9eE\.]+)/g);
  var vecs = [];
  //var vec = {};
  for (var i=0, n=mc?mc.length:0; i<n; i+=2) {
    //vec = new THREE.Vector2(+mc[i+0], +mc[i+1]);
    vecs.push( new THREE.Vector2(+mc[i+0], +mc[i+1]) );
  }
  return vecs;
}