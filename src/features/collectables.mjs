import { getObjectLayer } from "../utils.mjs";
import { COLLECTABLE_LAYER_NAME } from "../constants.mjs";


export const getCollectables = (map) => {
    // Get collectable object positions and names.
    const collectableObjectsLayer = getObjectLayer(map.layers, COLLECTABLE_LAYER_NAME);
    if(collectableObjectsLayer) 
    {
        let collectables = new Array(collectableObjectsLayer.objects.length);

        for(let collectableIndex = 0; collectableIndex < collectables.length; collectableIndex++)
        {
            let collectableObject = collectableObjectsLayer.objects[collectableIndex];

            collectables[collectableIndex] = {
                x: Math.round(collectableObject.pos.x),
                y: Math.round(collectableObject.pos.y),
                name: collectableObject.name
            }
        }

        return collectables;
    }

    return null;
};