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
                let tile = layer.tileAt(x,y);

                // find parsed tileset tile belongs to
                if(tile) 
                {
                    let parsedTileset = tilesets.find((tileset) => tile.tileset.name === tileset.name);
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

        tilemapLayers.push(tileLayer);
    });

    return tilemapLayers;
}