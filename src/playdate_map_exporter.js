/// <reference types="@mapeditor/tiled-api" />

/*
 * playdate-map-exporter.js
 *
 * This extension adds the 'playdate map format' type to the Export As menu,
 * which can be used to generate .json map data compatible with MattouBatou's Playdate games
 */

/* global tiled, FileInfo, TextFile */

/// CONSTANTS
//		names
const PLAYER_SPAWN_POINT_LAYER_NAME 	= "player_spawn_points";
const FIRST_PLAYER_SPAWN_POINT_NAME 	= "player_sp_0";
const WALKABLE_AREA_LAYER_NAME 			= "walkable";
const WALKABLE_AREA_NAME				= "walkable_area";

// 		default values
const DEFAULT_PLAYER_SPAWN_START_POINT 	= { x: 200, y: 120};
const DEFAULT_WALKABLE_AREA_DATA		= { x: 0, y: 0, area: [] };

// Matches string that contains a "/" with any other non "/" characters before and after a "/"
// Gives you the contents of the string from the 2nd to last slash to the end of string.
// For a file path, it gives you the file and the directory it is in.
const getRelativePath = path => path.match(/[^\/]+\/[^\/]+$/)[0];

const getBitmapTablePath = relPath => relPath.match(/(.+)-[^-]+-[^-]+-[^-]+$/)[1];

const getObjectLayer = (layers, nameToMatch) => layers.find(layer => layer.isObjectLayer && layer.name === nameToMatch);
const getObject = (objects, nameToMatch) => objects.find(object => object.name === nameToMatch);

tiled.registerMapFormat("playdate", {
	name: "playdate map format",
	extension: "json",

	write: (map, fileName) => {
		let file = new TextFile(fileName, TextFile.WriteOnly);

		debugger;

		// Default data
		let exportJson = {
			name: 					map.className,
			width: 					map.width,
			height: 				map.height,
			tileWidth:  			map.tileWidth,
			tileHeight: 			map.tileHeight,
			playerSpawnStartPos:	DEFAULT_PLAYER_SPAWN_START_POINT,
			walkableArea:			DEFAULT_WALKABLE_AREA_DATA,
			tilesetsLength:			map.tilesets.length,
			tilesets:				[],
			tilemapLayersLength:	map.layers.filter(layer => layer.isTileLayer).length,
			tilemapLayers:			[]
		};

		// Set spawn position from map data if it exists
		const playerSpawnPointsObjectLayer = getObjectLayer(map.layers, PLAYER_SPAWN_POINT_LAYER_NAME);
		if(playerSpawnPointsObjectLayer) {
			const firstPlayerSpawnObject = getObject(playerSpawnPointsObjectLayer.objects, FIRST_PLAYER_SPAWN_POINT_NAME);
			exportJson.playerSpawnStartPos = firstPlayerSpawnObject ? firstPlayerSpawnObject.pos : exportJson.playerSpawnStartPos;
		}

		// Get walkable area polygon object data if it exists
		const walkableAreaObjectLayer = getObjectLayer(map.layers, WALKABLE_AREA_LAYER_NAME);
		if(walkableAreaObjectLayer) {
			const walkableAreaObject = getObject(walkableAreaObjectLayer.objects, WALKABLE_AREA_NAME);
			if(walkableAreaObject) {
				exportJson.walkableArea = {
					x: walkableAreaObject.pos.x,
					y: walkableAreaObject.pos.y,
					areaLength: walkableAreaObject.polygon.length,
					area: walkableAreaObject.polygon
				};
			}
		}

		// write tilesets data
		let lastgid = 0;
		map.tilesets.forEach(tileset => {
			let tSet = {
				tablePath:			getBitmapTablePath(getRelativePath(tileset.image)),
				name: 				tileset.name,
				width: 				tileset.imageWidth,
				height:				tileset.imageHeight,
				tileWidth: 			tileset.tileWidth,
				tileHeight:			tileset.tileHeight,
				tileCount:			tileset.tileCount,
				firstgid:			lastgid + 1
			};

			lastgid = tSet.tileCount;
			exportJson.tilesets.push(tSet);
		})

		// write layers data
		map.layers.forEach(layer => {

			if(!layer.isTileLayer) return;

			let tilemap = [];

			for(let y = 0; y < layer.height; y++) {
				for(let x = 0; x < layer.width; x++) {
					let tile = layer.tileAt(x,y);

					// find parsed tileset tile belongs to
					if(tile) {
						let parsedTileset = exportJson.tilesets.find((tileset) => tile.tileset.name === tileset.name);
						tilemap.push(parsedTileset.firstgid + tile.id);
					} else {
						tilemap.push(0);
					}
				}
			}

			let tileLayer = {
				name: 				layer.name,
				className:			layer.className,
				width: 				layer.width,
				height:				layer.height,
				mapLength:			tilemap.length,
				map: 				JSON.parse(JSON.stringify(tilemap)),
			};

			exportJson.tilemapLayers.push(tileLayer);
		})

		file.write(JSON.stringify(exportJson, null, 2));
		file.commit();
	},
});