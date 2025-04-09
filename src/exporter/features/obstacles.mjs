import { getObjectLayer,  setUniqueArrayValue, getObjectPropValue } from "../utils.mjs";
import { OBSTACLE_LAYER_NAME } from "../constants.mjs";

// global tiled, log

export const getObstacles = (map) => {
    let obstacleTypesInLevel = [];
    // Get obstacle object positions and names.
    const obstacleObjectsLayer = getObjectLayer(map.layers, OBSTACLE_LAYER_NAME);
    if(obstacleObjectsLayer) 
    {
        let entities = new Array(obstacleObjectsLayer.objects.length);

        for(let obstacleIndex = 0; obstacleIndex < entities.length; obstacleIndex++)
        {
            let obstacleObject = obstacleObjectsLayer.objects[obstacleIndex];
            setUniqueArrayValue(obstacleObject.resolvedProperty('type').value, obstacleTypesInLevel);
            entities[obstacleIndex] = {
                name: getObjectPropValue(obstacleObject, 'type'),
                typeId: obstacleObject.resolvedProperty('type').value,
                class: obstacleObject.resolvedProperty('className'),
                shouldSpawnItem: obstacleObject.resolvedProperty('shouldSpawnItem') === true ? 1 : 0,
                item: obstacleObject.resolvedProperty('item').value,
                x: Math.round(obstacleObject.pos.x),
                y: Math.round(obstacleObject.pos.y),
                width: obstacleObject.width,
                height: obstacleObject.height,
            }
        }

        return { entities, obstacleTypesInLevel };
    }

    return null;
};