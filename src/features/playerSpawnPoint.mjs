import { 
    PLAYER_SPAWN_POINT_LAYER_NAME,
    FIRST_PLAYER_SPAWN_POINT_NAME,
    DEFAULT_PLAYER_SPAWN_START_POINT
} from "../constants.mjs";

import {
    getObjectLayer,
    getFirstObjectMatchingPropValue
} from "../utils.mjs";

// global tiled, log

// Set spawn position from map data if it exists
export const getPlayerSpawnPoint = (map) => {
    const playerSpawnPointsObjectLayer = getObjectLayer(map.layers, PLAYER_SPAWN_POINT_LAYER_NAME);
    if(playerSpawnPointsObjectLayer) 
    {
        const firstPlayerSpawnObject = getFirstObjectMatchingPropValue(playerSpawnPointsObjectLayer.objects, 'spawnId', FIRST_PLAYER_SPAWN_POINT_NAME);
        if(firstPlayerSpawnObject) return firstPlayerSpawnObject.pos;
    }

    return DEFAULT_PLAYER_SPAWN_START_POINT;
}