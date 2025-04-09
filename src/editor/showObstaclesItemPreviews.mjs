/// <reference types="@mapeditor/tiled-api" />

import { getObjectLayer, getObjectPropValue } from "../exporter/utils.mjs";
import { OBSTACLE_LAYER_NAME, OBSTACLE_ITEM_PREVIEWS_LAYER_NAME } from "../exporter/constants.mjs";


/*
 * Show Obstacle Item Previews
 *
 * Shows item preview images over obstacles if the obstacle contains an item.
 * This is for easy viewing when designing levels of what items will spawn from obstacles.
 */

/* global tiled, FileInfo, TextFile, log */
tiled.assetAboutToBeSaved.connect(function(map) 
{
    if(map.isTileMap)
    {
        const obstaclesLayer = getObjectLayer(map.layers, OBSTACLE_LAYER_NAME);
        const obstacleItemPreviewsLayer = getObjectLayer(map.layers, OBSTACLE_ITEM_PREVIEWS_LAYER_NAME);

        if(!obstaclesLayer) return;
        if(!obstacleItemPreviewsLayer) return;

        // Completely clear the objectItemPreviewsLayer every time and rebuild the preview objects
        // from scratch to avoid duplication of preview items.
        if(obstacleItemPreviewsLayer.objects.length)
        {
            let obstacleItems = [];
            const obstacleItemPreviewsLen = obstacleItemPreviewsLayer.objectCount;
            for(let obstacleItemPreviewIndex = 0; obstacleItemPreviewIndex < obstacleItemPreviewsLen; obstacleItemPreviewIndex++)
            {
                obstacleItems.push(obstacleItemPreviewsLayer.objectAt(obstacleItemPreviewIndex));
            }

            for(let obstacleItemPreviewIndex = 0; obstacleItemPreviewIndex < obstacleItemPreviewsLen; obstacleItemPreviewIndex++)
            {
                const obstacleItemPreview = obstacleItems[obstacleItemPreviewIndex];
                obstacleItemPreviewsLayer.removeObject(obstacleItemPreview);
            }

            obstacleItems = null;
        }

        const itemPreviewsTileset = map.tilesets.find(tileset => tileset.name === 'itemPreviews');

        // loop through all obstacle objects and read the 'item' custom property.
        // create a tile for the collectable that the obstacle will spawn when destroyed and add it to the preview obstacleItemPreviews layer.
        obstaclesLayer.objects.forEach(obstacle => {
            const shouldSpawnItem = getObjectPropValue(obstacle, 'shouldSpawnItem');
            
            if(shouldSpawnItem)
            {
                const obstacleItemValue = obstacle.resolvedProperty('item').value + 1;
                const obj = new MapObject(getObjectPropValue(obstacle, 'item'));

                obj.tile = itemPreviewsTileset.findTile(obstacleItemValue);
                obj.width = obj.tile.width;
                obj.height = obj.tile.height;
                obj.x = obstacle.x + (obstacle.width/2);
                obj.y = obstacle.y - obstacle.height + 5;
                obstacleItemPreviewsLayer.addObject(obj);
            }
        });
    }
});
