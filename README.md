## aframe-heightgrid-component

A Height Grid (Terrain) component for [A-Frame](https://aframe.io). The component allows to use a gridded height field for defining a surface. The grid is aligned with the x-z plane, the heights define y coordinates.  

Chrome requires aframe > 0.2.0 for this component to function properly.

### Properties

| Property | Description | Default Value |
| -------- | ----------- | ------------- |
|    xdimension      |   number of grid points in x direction          |     2 (the minimum)          |
|    zdimension      |   number of grid points in z direction          |     2 (the minimum)        |
| xspacing | the distance between two grid points in x direction | 1 |
| zspacing | the distance between two grid points in z direction | 1 |
| heights | a list of heights (ordering below) | 0 |
| origin | the location of the first grid point | 0 0 0 |
| uvs | a list of 2d texture coordinates | empty |

The ordering of heights is from the first grid point to the last. The ordering is such that y(x, z) = heights(x + z * xdimension); eg. first the points along the x direction are assigned heights, then the z position is incremented and those points along the x direction are assigned heights.

The (local) origin of the grid can be shifted by providing the origin property. This is for special applications only. Usually it is preferrable to wrap in another entity for translation and rotation.

### Defaults

The minimum value x/zdimension is 2. x/zspacing values are unconstrained and can probably be negative.

If the heights property contains less values than the number of grid points, heights are recycled from the beginning of the list to fill in missing values. By default the heights list only has a single 0 value. Omitting a heights field therefore will produce a horizontal plane.

The default value for the uvs property is an empty list. An empty list will lead to texture coordinates which correspond directly to the x and z coordinates of the grid points, scaled to vary between 0 and 1.

### Usage

#### Browser Installation

Install and use by directly including the [browser files](dist):

```html
<head>
  <title>My A-Frame Scene</title>
  <script src="https://aframe.io/releases/0.2.0/aframe.min.js"></script>
  <!--script src="https://rawgit.com/aframevr/aframe/master/dist/aframe.min.js"></script-->
  <script src="https://rawgit.com/andreasplesch/aframe-faceset-component/master/dist/aframe-faceset-component.min.js"></script>
  <script src="https://rawgit.com/andreasplesch/aframe-heightgrid-component/master/dist/aframe-heightgrid-component.min.js"></script>
</head>

<body>
  <a-scene>
    <a-entity heightgrid="exampleProp: exampleVal"></a-entity>
  </a-scene>
</body>
```

#### NPM Installation

Install via NPM:

```bash
npm install aframe-heightgrid-component
```

Then register and use.

```js
require('aframe');
require('aframe-faceset-component');
require('aframe-heightgrid-component');
```
