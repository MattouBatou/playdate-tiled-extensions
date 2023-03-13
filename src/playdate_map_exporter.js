
/// <reference types="@mapeditor/tiled-api" />

/*
 * playdate-map-exporter.js
 *
 * This extension adds the 'playdate map format' type to the Export As menu,
 * which can be used to generate .json map data compatible with MattouBatou's Playdate games
 */

/* global tiled, FileInfo, TextFile */

// Matches string that contains a "/" with any other non "/" characters before and after a "/"
// Gives you the contents of the string from the 2nd to last slash to the end of string.
// For a file path, it gives you the file and the directory it is in.
const getRelativePath = path => path.match(/[^\/]+\/[^\/]+$/)[0];

tiled.registerMapFormat("playdate", {
	name: "playdate map format",
	extension: "json",

	write: (map, fileName) => {
		let file = new TextFile(fileName, TextFile.WriteOnly);

		let exportJson = {
			name: 					map.className,
			width: 					map.width,
			height: 				map.height,
			tileWidth:  			map.tileWidth,
			tileHeight: 			map.tileHeight,
			tilesetsLength:			map.tilesets.length,
			tilesets:				[],
			tilemapLayersLength:	map.layers.filter(layer => !layer.isTileLayer).length,
			tilemapLayers:			[],
		};

		// write tilesets data
		let lastgid = 0;
		map.tilesets.forEach(tileset => {
			let tSet = {
				imagePath: 			getRelativePath(tileset.image),
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