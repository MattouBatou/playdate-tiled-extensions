import { getGroupLayer, getObjectLayer, getObjectLayerByClass, getObjectByClass, getGroupLayerByClass } from "../utils.mjs";
import { 
    SCREENLOCKS_GROUP_NAME,
    SCREEN_LAYER_NAME,
    SCREEN_OBJECT_CLASS_NAME,
    ENEMY_LAYER_CLASS_NAME,
    WAVE_CLASS_NAME,
} from "../constants.mjs";

/* global tiled, log */

export const getScreenLocks = (map) => {
    // Get screen groups
    const screenLockGroupLayer = getGroupLayer(map.layers, SCREENLOCKS_GROUP_NAME);
    
    if(screenLockGroupLayer) {
        let screenLocks = new Array(screenLockGroupLayer.layers.length);

        for(let screenLockLayersIndex = 0; screenLockLayersIndex < screenLocks.length; screenLockLayersIndex++) 
        {
            // For some reason, the screenGroup layers are backwards in screenLockGroupLayer.layers array.
            // We flipped the index for now to start from the last layer and work backwards so that the result
            // and the layers from tiled do not end up in the same order (backwards loop won't solve this).
            const screenGroupLayer = screenLockGroupLayer.layerAt((screenLocks.length - 1) - screenLockLayersIndex);
            const waveGroupLayer = getGroupLayerByClass(screenGroupLayer.layers, WAVE_CLASS_NAME);
            const enemyObjectsLayer = getObjectLayerByClass(waveGroupLayer.layers, ENEMY_LAYER_CLASS_NAME);

            const screenObjectLayer = getObjectLayer(screenGroupLayer.layers, SCREEN_LAYER_NAME);
            const screenObject = getObjectByClass(screenObjectLayer.objects, SCREEN_OBJECT_CLASS_NAME);

            let screenGroup = {
                name: screenGroupLayer.name,
                class: screenGroupLayer.className,
                wavesLength: waveGroupLayer.layers.length,
                screen: {
                    name: screenObject.name,
                    class: screenObject.className,
                    x: screenObject.x + screenObject.width/2,
                    y: screenObject.y + screenObject.height/2,
                    width: screenObject.width,
                    height: screenObject.height
                },
                waves: getWavesData(waveGroupLayer)
            };

            screenLocks[screenLockLayersIndex] = screenGroup;
        }

        return screenLocks;
    }

    return null;
}

export const getWavesData = (waveGroupLayer) =>
{
    if(waveGroupLayer)
    {
        let waves = new Array(waveGroupLayer.layers.length);
        for(let waveIndex = 0; waveIndex < waves.length; waveIndex++)
        {
            let waveObjectLayer = waveGroupLayer.layerAt((waves.length - 1) - waveIndex);

            waves[waveIndex] = {
                name: waveObjectLayer.name,
                class: waveObjectLayer.className,
                waveEnemiesLength: waveObjectLayer.objects.length,
                waveEnemies: getEnemyData(waveObjectLayer),
                unlockType: waveObjectLayer.property("unlockType"),
                unlockValue: waveObjectLayer.property("unlockValue")
            };
        }
        
        return waves;
    }

    return null;
};

export const getEnemyData = (enemyObjectsLayer) =>
{
    // Get enemy object positions and names 
    if(enemyObjectsLayer) 
    {
        let enemies = new Array(enemyObjectsLayer.objects.length);
        for(let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++)
        {
            let enemyObject = enemyObjectsLayer.objectAt((enemies.length - 1) - enemyIndex);

            // engageOrder is not used in game. We use it to sort the array of enemies by the engage order
            // so that game logic can just spawn entities in array order.
            enemies[enemyIndex] = {
                engageOrder: enemyObject.property("engageOrder"),
                name: enemyObject.name,
                class: enemyObject.className,
                enemyType: enemyObject.property("enemyType"),
                x: Math.round(enemyObject.pos.x),
                y: Math.round(enemyObject.pos.y)
            };
        }

        enemies.sort((a, b) => (a.engageOrder && b.engageOrder) ? a.engageOrder - b.engageOrder : 0);

        return enemies;
    }

    return null;
};