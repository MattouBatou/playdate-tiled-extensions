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
const GAME_BORDER_LAYER_NAME 			= "border";
const COLLECTABLE_LAYER_NAME			= "collectables";
const COLLECTABLE_CLASS_NAME			= "collectable";
const ENEMY_LAYER_NAME					= "enemies";
const ENEMY_CLASS_NAME					= "enemy";


// 		default values
const DEFAULT_PLAYER_SPAWN_START_POINT 	= { x: 200, y: 120};
const DEFAULT_GAME_BORDER_Y				= 120;

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
			gameBorder:				DEFAULT_GAME_BORDER_Y,
			collectablesLength:		getObjectLayer(map.layers, COLLECTABLE_LAYER_NAME).objects.length,
			collectables:			[],
			enemiesLength:			getObjectLayer(map.layers, ENEMY_LAYER_NAME).objects.length,
			enemies:				[],
			tilesetsLength:			map.tilesets.length,
			tilesets:				[],
			tilemapLayersLength:	map.layers.filter(layer => layer.isTileLayer).length,
			tilemapLayers:			[]
		};

		// Set spawn position from map data if it exists
		const playerSpawnPointsObjectLayer = getObjectLayer(map.layers, PLAYER_SPAWN_POINT_LAYER_NAME);
		if(playerSpawnPointsObjectLayer) 
		{
			const firstPlayerSpawnObject = getObject(playerSpawnPointsObjectLayer.objects, FIRST_PLAYER_SPAWN_POINT_NAME);
			exportJson.playerSpawnStartPos = firstPlayerSpawnObject ? firstPlayerSpawnObject.pos : exportJson.playerSpawnStartPos;
		}

		// Get game border polygon object data if it exists
		const gameBorderObjectLayer = getObjectLayer(map.layers, GAME_BORDER_LAYER_NAME);
		if(gameBorderObjectLayer) 
		{
			const gameBorderObject = gameBorderObjectLayer.objects[0];
			if(gameBorderObject) 
			{
				exportJson.gameBorder = gameBorderObject.pos.y;
			} 
			else
				throw new Error(`No walkable area is defined for map: ${map.className}`);
		}

		// Get collectable object positions and names 
		const collectableObjectsLayer = getObjectLayer(map.layers, COLLECTABLE_LAYER_NAME);
		if(collectableObjectsLayer) 
		{
			for(let collectableIndex = 0; collectableIndex < collectableObjectsLayer.objects.length; collectableIndex++)
			{
				let collectableObject = collectableObjectsLayer.objects[collectableIndex];

				exportJson.collectables.push(
					{
						x: Math.round(collectableObject.pos.x),
						y: Math.round(collectableObject.pos.y),
						name: collectableObject.name
					}
				);
			}
		}

		// Get enemy object positions and names 
		const enemyObjectsLayer = getObjectLayer(map.layers, ENEMY_LAYER_NAME);
		if(enemyObjectsLayer) 
		{
			for(let enemyIndex = 0; enemyIndex < enemyObjectsLayer.objects.length; enemyIndex++)
			{
				let enemyObject = enemyObjectsLayer.objects[enemyIndex];

				exportJson.enemies.push(
					{
						x: Math.round(enemyObject.pos.x),
						y: Math.round(enemyObject.pos.y),
						name: enemyObject.name
					}
				);
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

			for(let y = 0; y < layer.height; y++) 
			{
				for(let x = 0; x < layer.width; x++)
				{
					let tile = layer.tileAt(x,y);

					// find parsed tileset tile belongs to
					if(tile) 
					{
						let parsedTileset = exportJson.tilesets.find((tileset) => tile.tileset.name === tileset.name);
						tilemap.push(parsedTileset.firstgid + tile.id);
					} else 
					{
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