/// <reference types="@mapeditor/tiled-api" />

import { getImageLayer, getRelativePath } from "./utils.mjs";

import { getPlayerSpawnPoint } from "./features/playerSpawnPoint.mjs";
import { getGameBorder } from "./features/gameBorder.mjs";
import { getCollectables } from "./features/collectables.mjs";
import { getScreenLocks } from "./features/screenLock.mjs";
import { getTilesets } from "./features/tilesets.mjs";
import { getTilemapLayers } from "./features/tilemapLayers.mjs";
import { getBgLayers } from "./features/bgLayers.mjs";
import { getMapDetails } from "./features/mapDetails.mjs"

/*
 * playdate-map-exporter.js
 *
 * This extension adds the 'playdate map format' type to the Export As menu,
 * which can be used to generate .json map data compatible with MattouBatou's Playdate games
 */

/* global tiled, FileInfo, TextFile, log */

tiled.registerMapFormat("playdate", {
	name: "playdate map format",
	extension: "json",

	write: (map, fileName) => {
		let file = new TextFile(fileName, TextFile.WriteOnly);
		
		const playerSpawnStartPos = getPlayerSpawnPoint(map);
		const gameBorder = getGameBorder(map);
		const bgLayers	 = getBgLayers(map);
		const collectables = getCollectables(map);
		const screenLocks = getScreenLocks(map);
		const tilesets = getTilesets(map);
		const tilemapLayers = getTilemapLayers(map, tilesets);
		const mapDetails = getMapDetails(map);

		// Default data
		let exportJson = {
			name: 							map.className,
			width: 							map.width,
			height: 						map.height,
			tileWidth:  					map.tileWidth,
			tileHeight: 					map.tileHeight,
			bgLayersLength:					bgLayers.length,
			bgLayers,
			skyPath:						`tilemaps/${getRelativePath(getImageLayer(map.layers, 'sky').imageSource.toString())}`,
			enemyTypesInLevelLength:		screenLocks.enemyTypesInLevel.length,
			enemyTypesInLevel:				screenLocks.enemyTypesInLevel,
			playerSpawnStartPos:			playerSpawnStartPos,
			gameBorder:						gameBorder,
			collectablesLength:				collectables.entities.length,
			collectables:					collectables.entities,
			collectableTypesInLevelLength:  collectables.collectableTypesInLevel.length,
			collectableTypesInLevel:		collectables.collectableTypesInLevel,
			screenLocksLength:				screenLocks.screenLocks.length,
			screenLocks:					screenLocks.screenLocks,
			tilesetsLength:					tilesets.length,
			tilesets:						tilesets,
			tilemapLayersLength:			map.layers.filter(layer => layer.isTileLayer).length,
			tilemapLayers:					tilemapLayers,
			mapDetailsImagesLength:			mapDetails.tileObjectImages.length,
			mapDetailsObjectImages:			mapDetails.tileObjectImages,
			mapDetailsLength:				mapDetails.tileObjects.length,
			mapDetails:						mapDetails.tileObjects,
			mapDetailsBitmapPath:			mapDetails.tileObjectImages[0].slice(0, mapDetails.tileObjectImages[0].length - 12)
		};

		file.write(JSON.stringify(exportJson, null, 2));
		file.commit();
	},
});