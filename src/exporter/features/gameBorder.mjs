import {
    GAME_BORDER_LAYER_NAME,
    DEFAULT_GAME_BORDER_Y
} from "../constants.mjs";

import {
    getObjectLayer
} from "../utils.mjs";

export const getGameBorder = (map) => {
    // Get game border data
    const gameBorderObjectLayer = getObjectLayer(map.layers, GAME_BORDER_LAYER_NAME);
    if(gameBorderObjectLayer) 
    {
        const gameBorderObject = gameBorderObjectLayer.objects[0];
        if(gameBorderObject) 
        {
            return gameBorderObject.pos.y;
        }
    }

    return DEFAULT_GAME_BORDER_Y;
};