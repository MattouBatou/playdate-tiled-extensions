import { getObjectLayer,  setUniqueArrayValue } from "../utils.mjs";
import { COLLECTABLE_LAYER_NAME } from "../constants.mjs";


export const getCollectables = (map) => {
    let collectableTypesInLevel = [];
    // Get collectable object positions and names.
    const collectableObjectsLayer = getObjectLayer(map.layers, COLLECTABLE_LAYER_NAME);
    if(collectableObjectsLayer) 
    {
        let entities = new Array(collectableObjectsLayer.objects.length);

        for(let collectableIndex = 0; collectableIndex < entities.length; collectableIndex++)
        {
            let collectableObject = collectableObjectsLayer.objects[collectableIndex];
            setUniqueArrayValue(collectableObject.name, collectableTypesInLevel);
            entities[collectableIndex] = {
                name: collectableObject.name,
                class: collectableObject.resolvedProperty('className'),
                x: Math.round(collectableObject.pos.x),
                y: Math.round(collectableObject.pos.y),
                width: collectableObject.width,
                height: collectableObject.height,
            }
        }

        return { entities, collectableTypesInLevel };
    }

    return null;
};