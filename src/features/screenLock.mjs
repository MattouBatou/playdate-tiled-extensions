import { getGroupLayer, getObjectLayer, getObjectByClass } from "../utils.mjs";
import { 
    SCREENLOCKS_GROUP_NAME,
    SCREEN_LAYER_NAME,
    SCREEN_OBJECT_CLASS_NAME,
    ENEMY_LAYER_NAME,
} from "../constants.mjs";

export const getScreenLocks = (map) => {
    // Get screen groups
    const screenLockGroupLayer = getGroupLayer(map.layers, SCREENLOCKS_GROUP_NAME);
    
    if(screenLockGroupLayer) {
        let screenLocks = new Array(screenLockGroupLayer.layers.length);
        // Currently we spawn all enemies on the level on level load. 
        // With screenlocks, we will spawn enemies as the player progresses through the level.
        // tempEnemyData is just to support the placeholder spawning until the logic for spawning with screenlocks features is implemented.
        let tempEnemyData = {
            enemiesLength: 0,
            enemies: []
        };

        for(let screenLockLayersIndex = 0; screenLockLayersIndex < screenLocks.length; screenLockLayersIndex++) 
        {
            // For some reason, the screenGroup layers are backwads in screenLockGroupLayer.layers array.
            // We flipped the index for now to start from the last layer and work backwards so that the result
            // and the layers from tiled do not end up in the same order (backwards loop won't solve this).
            let screenGroupLayer = screenLockGroupLayer.layers[(screenLocks.length-1)-screenLockLayersIndex];
            const enemyObjectsLayer = getObjectLayer(screenGroupLayer.layers, ENEMY_LAYER_NAME);
            const screenObjectLayer = getObjectLayer(screenGroupLayer.layers, SCREEN_LAYER_NAME);
            const screenObject = getObjectByClass(screenObjectLayer.objects, SCREEN_OBJECT_CLASS_NAME);

            let screenGroup = {
                enemiesLength: enemyObjectsLayer.objects.length,
                enemies: null,
                screen: {
                    x: screenObject.x + screenObject.width/2,
                    y: screenObject.y + screenObject.height/2,
                    name: screenObject.name,
                    unlockType: screenObjectLayer.property("unlockType"),
                    unlockValue: screenObjectLayer.property("unlockValue")
                }
            };

            screenGroup.enemies = getEnemyData(enemyObjectsLayer);

            screenLocks[screenLockLayersIndex] = screenGroup;
            
            tempEnemyData.enemiesLength += enemyObjectsLayer.objects.length;
            tempEnemyData.enemies.push(...getEnemyData(enemyObjectsLayer));
        }

        return {
            screenLocks,
            tempEnemyData
        };
    }

    return null;
}

export const getEnemyData = (enemyObjectsLayer) =>
{
    // Get enemy object positions and names 
    if(enemyObjectsLayer) 
    {
        let enemies = new Array(enemyObjectsLayer.objects.length);
        for(let enemyIndex = 0; enemyIndex < enemies.length; enemyIndex++)
        {
            let enemyObject = enemyObjectsLayer.objects[enemyIndex];

            enemies[enemyIndex] = {
                x: Math.round(enemyObject.pos.x),
                y: Math.round(enemyObject.pos.y),
                name: enemyObject.name
            };
        }

        return enemies;
    }

    return null;
};