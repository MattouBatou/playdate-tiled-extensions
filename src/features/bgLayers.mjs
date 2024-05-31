import { getGroupLayer, getRelativePath } from "../utils.mjs";
import { 
    BG_LAYERS_NAME
} from "../constants.mjs";

/* global tiled, log, error */

export const getBgLayers = (map) => {
    // Get bgLayers groups
    const bgGroupLayer = getGroupLayer(map.layers, BG_LAYERS_NAME);

    if(bgGroupLayer && bgGroupLayer.layers.length > 0) {
        let bgImageLayers = new Array(bgGroupLayer.layers.length);

        for(let bgLayersIndex = 0; bgLayersIndex < bgImageLayers.length; bgLayersIndex++) 
        {
            let bgImage = bgGroupLayer.layerAt(bgLayersIndex);

            if(!bgImage) continue;    
            
            let path = `tilemaps/${getRelativePath(bgImage.imageSource.toString())}`;
            
            // splitting path from file extension to add onto the path.
            let splitPath = path.split('.');
            let fillPath = `${splitPath[0]}_outlined.${splitPath[1]}`

            bgImageLayers[bgLayersIndex] = {
                path,
                fillPath,
                y: bgImage.offset.y,
                width: bgImage.image.width,
                height: bgImage.image.height,
            }
        }

        return bgImageLayers;
    }

    return null;
}