import { numberToUint32 } from "../utils.mjs";
/* global tiled, log */

export const getTilemapLayers = (map, tilesets) => {
    // write layers data

    let tilemapLayers = [];
    map.layers.forEach(layer => {

        if(!layer.isTileLayer) return;

        let tilemap = [];

        for(let y = 0; y < layer.height; y++) 
        {
            for(let x = 0; x < layer.width; x++)
            {
                const tile = layer.tileAt(x,y);
                // ensure flag is unsigned 32 bit int
                const flags = layer.flagsAt(x,y) << 28 >>> 0; // convert to unsigned int
                
                // find parsed tileset tile belongs to
                if(tile) 
                {
                    let parsedTileset = tilesets.find((tileset) => tile.tileset.name === tileset.name);
                    const globalTileId = parsedTileset.firstgid + tile.id;
                    // combining big endian flags with the globalTileId;
                    const globalTileIdWithFlags = (globalTileId | flags) >>> 0; // convert to unsigned int

                    tilemap.push(globalTileIdWithFlags);
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

        tilemapLayers.push(tileLayer);
    });

    return tilemapLayers;
}