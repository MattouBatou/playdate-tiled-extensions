import {  
    getObjectLayer,
    setUniqueArrayValue,
    getRelativePath
} from "../utils.mjs";

import { MAP_DETAILS_LAYER_NAME } from "../constants.mjs";

export const getMapDetails = (map) =>
    {
        const mapDetailsObjectLayer = getObjectLayer(map.layers, MAP_DETAILS_LAYER_NAME);

        // Get Tile object positions, ids and filenames
        if(mapDetailsObjectLayer) 
        {
            if(mapDetailsObjectLayer.objects.length <= 0) {
                error(`No mapDetails objects have been added to the mapDetailsObjectLayer: ${mapDetailsObjectLayer.name}`);
            }
    
            let tileObjects = new Array(mapDetailsObjectLayer.objects.length);
            let tileObjectImages = [];
            for(let tileObjectIndex = 0; tileObjectIndex < tileObjects.length; tileObjectIndex++)
            {
                let tileObject = mapDetailsObjectLayer.objectAt(tileObjectIndex);
                let tileObjectImagePath = `tilemaps/assets/${getRelativePath(tileObject.tile.imageFileName)}`;
                setUniqueArrayValue(tileObjectImagePath, tileObjectImages);
    
    
                // engageOrder is not used in game. We use it to sort the array of enemies by the engage order
                // so that game logic can just spawn entities in array order.
                tileObjects[tileObjectIndex] = {
                    path: tileObjectImagePath,
                    x: Math.round(tileObject.pos.x),
                    y: Math.round(tileObject.pos.y),
                    width: tileObject.width,
                    height: tileObject.height,
                };
            }

            tileObjectImages.sort();

            for(let tileObjectIndex = 0; tileObjectIndex < tileObjects.length; tileObjectIndex++)
            {
                let tileObject = tileObjects[tileObjectIndex];

                tileObject.id = tileObjectImages.indexOf(tileObject.path);
                delete tileObject.path;
            }

            return { tileObjectImages, tileObjects };
        }
    
        return null;
    };