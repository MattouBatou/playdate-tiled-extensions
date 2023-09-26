/// <reference types="@mapeditor/tiled-api" />

import { getPlayerSpawnPoint } from "./features/playerSpawnPoint.mjs";
import { getGameBorder } from "./features/gameBorder.mjs";
import { getCollectables } from "./features/collectables.mjs";
import { getScreenLocks } from "./features/screenLock.mjs";
import { getTilesets } from "./features/tilesets.mjs";
import { getTilemapLayers } from "./features/tilemapLayers.mjs";

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
		const collectables = getCollectables(map);
		const screenLocks = getScreenLocks(map);
		const tilesets = getTilesets(map);
		const tilemapLayers = getTilemapLayers(map, tilesets);

		// Default data
		let exportJson = {
			name: 					map.className,
			width: 					map.width,
			height: 				map.height,
			tileWidth:  			map.tileWidth,
			tileHeight: 			map.tileHeight,
			playerSpawnStartPos:	playerSpawnStartPos,
			gameBorder:				gameBorder,
			collectablesLength:		collectables.length,
			collectables:			collectables,
			screenLocksLength:		screenLocks.screenLocks.length,
			screenLocks:			screenLocks.screenLocks,
			enemiesLength:			screenLocks.tempEnemyData.enemiesLength,
			enemies:				screenLocks.tempEnemyData.enemies,
			tilesetsLength:			map.tilesets.length,
			tilesets:				tilesets,
			tilemapLayersLength:	map.layers.filter(layer => layer.isTileLayer).length,
			tilemapLayers:			tilemapLayers
		};

		file.write(JSON.stringify(exportJson, null, 2));
		file.commit();
	},
});