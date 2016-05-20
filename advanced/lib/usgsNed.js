/*global define, module */
(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(function () {
			return (root.usgsNed = factory());
		});
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like enviroments that support module.exports,
		// like Node.
		module.exports = factory();
	} else {
		// Browser globals
		root.usgsNed = factory();
	}
}(this, function () {
	"use strict";

	/*
	 {
		"USGS_Elevation_Point_Query_Service": {
			"Elevation_Query": {
				"x": -122.9009843371,
				"y": 46.973556842123,
				"Data_Source": "NED 1\/3 arc-second",
				"Elevation": 200.480279,
				"Units": "Feet"
			}
		}
	}
	 */

	/**
	 * @external {ArcGisFeature}
	 * @see {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Feature_object/02r3000000n8000000/ Feature}
	 */

	/**
	 * @external {GeoJsonFeature}
	 * @see {@link http://geojson.org/geojson-spec.html#feature-objects Feature Objects}
	 */

	/**
	 * An object that represents the results of a query to the USGS Elevation service.
	 * @param {Object} json
	 * @member {Number} x
	 * @member {Number} y 
	 * @member {string} dataSource
	 * @member {Number} elevation 
	 * @member {string} units - Measurement unit of elevation: "Feet" or "Meters".
	 */
	function ElevationQueryResult(json) {
		var resultObj;
		if (!json) {
			throw new TypeError("The 'json' parameter cannot be null or undefined.");
		}
		if (json.USGS_Elevation_Point_Query_Service && json.USGS_Elevation_Point_Query_Service.Elevation_Query) {
			resultObj = json.USGS_Elevation_Point_Query_Service.Elevation_Query;
		} else {
			throw new TypeError("The 'json' parameter object did not have expected properties.");
		}
		this.x = resultObj.x;
		this.y = resultObj.y;
		this.dataSource = resultObj.Data_Source;
		this.elevation = resultObj.Elevation;
		this.units = resultObj.Units;
	}

	/**
	 * Returns an {ArcGisFeature} equivalent of this object.
	 * @returns {ArcGisFeature}
	 */
	ElevationQueryResult.prototype.toArcGisFeature = function () {
		var point, feature;
		point = {
			x: this.x,
			y: this.y,
			z: this.elevation,
			spatialReference: {
				wkid: 4326
			}
		};
		feature = {
			geometry: point,
			attributes: {
				elevationUnits: this.units,
				dataSource: this.dataSource
			}
		};

		return feature;
	};

	/**
	 * Creates a GeoJSON feature equivalent to this object.
	 * @returns {GeoJsonFeature}
	 */
	ElevationQueryResult.prototype.toGeoJson = function () {
		var geometry, feature;
		geometry = {
			type: "Point",
			coordinates: [this.x, this.y, this.elevation]
		};
		feature = {
			type: "Feature",
			geometry: geometry,
			properties: {
				elevationUnits: this.units,
				dataSource: this.dataSource
			}
		};

		return feature;
	};

	var exports = {};

	/**
	 * @typedef NedElevationInfo
	 * @property {number} x
	 * @property {number} y
	 * @property {string} Data_Source
	 * @property {number} Elevation
	 * @property {string} Units - 'Feet' or 'Meters'
	 */

	/**
	 * Converts an object into a query string
	 * @returns {string}
	 */
	function objectToQueryString(/**{Object}*/ o) {
		var output = [], v;
		for (var name in o) {
			if (o.hasOwnProperty(name)) {
				v = o[name];
				if (typeof v === "object") {
					v = JSON.stringify(v);
				}
				output.push([name, v].map(encodeURIComponent).join("="));
			}
		}
		return output.join("&");
	}

	/**
	 * Creates a request to the USGS NED point service
	 * @param {number} x
	 * @param {number} y
	 * @param {string} [units='Feet']
	 * @returns {Promise<NedElevationInfo>}
	 */
	exports.getElevation = function (x, y, units) {
		return new Promise(function (resolve, reject) {
			var baseUrl = "http://ned.usgs.gov/epqs/pqs.php";
			var params = {
				x: x,
				y: y,
				units: units || "Feet",
				output: "json"
			};
			var request = new XMLHttpRequest();
			request.open("get", [baseUrl, objectToQueryString(params)].join("?"));
			request.onload = function () {
        if (request.status === 200) {
          /*
          {
            "USGS_Elevation_Point_Query_Service": {
              "Elevation_Query": {
                "x": -123,
                "y": 45,
                "Data_Source": "NED 1/3 arc-second",
                "Elevation": 177.965854,
                "Units": "Feet"
              }
            }
          }
           */
          var response = JSON.parse(this.responseText);
          resolve(response.USGS_Elevation_Point_Query_Service.Elevation_Query);
        }
        else { reject(request.statusText); }
			};
			request.onerror = function (e) {
				reject(e);
			};
			request.send();
		});
	};

	exports.ElevationQueryResult = ElevationQueryResult;

	return exports;
}));