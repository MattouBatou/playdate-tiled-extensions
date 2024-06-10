import { 
    getGroupLayer, 
    getObjectLayer, 
    getObjectLayerByClass, 
    getObjectByClass, 
    getGroupLayerByClass, 
    setUniqueArrayValue,
    getObjectPropValue
} from "../utils.mjs";
import { 
    SCREENLOCKS_GROUP_NAME,
    SCREEN_LAYER_NAME,
    SCREEN_OBJECT_CLASS_NAME,
    ENEMY_LAYER_CLASS_NAME,
    WAVE_CLASS_NAME,
    FREE_SPAWN_CLASS_NAME
} from "../constants.mjs";

/* global tiled, log, error */

export const getScreenLocks = (map) => {
    // Get screen groups
    const screenLockGroupLayer = getGroupLayer(map.layers, SCREENLOCKS_GROUP_NAME);
    let enemyTypesInLevel = [];
    
    if(screenLockGroupLayer) {
        let screenLocks = new Array(screenLockGroupLayer.layers.length);

        for(let screenLockLayersIndex = 0; screenLockLayersIndex < screenLocks.length; screenLockLayersIndex++) 
        {
            // For some reason, the screenGroup layers are backwards in screenLockGroupLayer.layers array.
            // We flipped the index for now to start from the last layer and work backwards so that the result
            // and the layers from tiled do not end up in the same order (backwards loop won't solve this).
            const screenGroupLayer = screenLockGroupLayer.layerAt((screenLocks.length - 1) - screenLockLayersIndex);

            const freeSpawnsObjectsLayer = getObjectLayerByClass(screenGroupLayer.layers, FREE_SPAWN_CLASS_NAME);

            const screenObjectLayer = getObjectLayer(screenGroupLayer.layers, SCREEN_LAYER_NAME);
            const screenObject = getObjectByClass(screenObjectLayer.objects, SCREEN_OBJECT_CLASS_NAME);

            const waveGroupLayer = getGroupLayerByClass(screenGroupLayer.layers, WAVE_CLASS_NAME);
            const enemyObjectsLayer = getObjectLayerByClass(waveGroupLayer.layers, ENEMY_LAYER_CLASS_NAME);

            if(!freeSpawnsObjectsLayer) { 
                error("No freeSpawns object layer was added to screenLockGroupLayer! (i.e. screenLockXX folder group)");
            }
            if(!screenObjectLayer) { 
                error("No screen object layer has been added to screenLocksGroupLayer! (i.e. screenLockXX folder group)");
            }
            if(!screenObject) { 
                error("No screen object was not added to screen object layer!");
            }
            if(!waveGroupLayer) { 
                error("No waveGroupLayer was added to screenLockGroupLayer! (i.e. screenLockXX folder group)");
            }
            if(!enemyObjectsLayer) { 
                error("No enemy objects layer was added to waveGroupLayer. There must be at least 1 enemy objects layer for at least 1 wave!");
            }

            let screenGroup = {
                name: screenGroupLayer.name,
                class: screenGroupLayer.className,
                wavesLength: waveGroupLayer.layers.length,
                spawnAhead: screenGroupLayer.property('spawnAhead') == true ? 1 : 0,
                freeSpawnsLength: freeSpawnsObjectsLayer.objects.length,
                freeSpawns: getEnemyData(freeSpawnsObjectsLayer, enemyTypesInLevel),
                screen: {
                    name: screenObject.name,
                    class: screenObject.className,
                    x: screenObject.x + screenObject.width/2,
                    y: screenObject.y + screenObject.height/2,
                    width: screenObject.width,
                    height: screenObject.height,
                },
                waves: getWavesData(waveGroupLayer, enemyTypesInLevel),
            };

            screenLocks[screenLockLayersIndex] = screenGroup;
        }

        return { enemyTypesInLevel, screenLocks };
    }

    return null;
}

export const getWavesData = (waveGroupLayer, enemyTypesInLevel) =>
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
                waveEnemies: getEnemyData(waveObjectLayer, enemyTypesInLevel),
                unlockType: waveObjectLayer.property("unlockType"),
                unlockValue: waveObjectLayer.property("unlockValue")
            };
        }
        
        return waves;
    }

    return null;
};

export const getEnemyData = (enemyObjectsLayer, enemyTypesInLevel) =>
{
    // Get enemy object positions and names 
    if(enemyObjectsLayer) 
    {
        if(enemyObjectsLayer.objects.length <= 0) {
            error(`No enemy objects have been added to the enemyObjectsLayer: ${enemyObjectsLayer.name}`);
        }

        let enemies = new Array(enemyObjectsLayer.objects.length);
        for(let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++)
        {
            let enemyObject = enemyObjectsLayer.objectAt((enemies.length - 1) - enemyIndex);
            setUniqueArrayValue(enemyObject.resolvedProperty('type').value, enemyTypesInLevel);

            // engageOrder is not used in game. We use it to sort the array of enemies by the engage order
            // so that game logic can just spawn entities in array order.
            enemies[enemyIndex] = {
                engageOrder: enemyObject.property("engageOrder"),
                name: getObjectPropValue(enemyObject, 'type'),
                class: enemyObject.resolvedProperty('className'),
                typeId: enemyObject.resolvedProperty('type').value,
                x: Math.round(enemyObject.pos.x),
                y: Math.round(enemyObject.pos.y),
                width: enemyObject.width,
                height: enemyObject.height,
            };
        }

        enemies.sort((a, b) => (a.engageOrder && b.engageOrder) ? a.engageOrder - b.engageOrder : 0);

        return enemies;
    }

    return null;
};