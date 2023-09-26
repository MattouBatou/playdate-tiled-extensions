import { getBitmapTablePath, getRelativePath } from "../utils.mjs";

export const getTilesets = (map) => {
    // write tilesets data
    let lastgid = 0;
    let tilesets = new Array(map.tilesets.length);
    map.tilesets.forEach((tileset, tilesetIndex) => {
        let tSet = {
            tablePath:			getBitmapTablePath(getRelativePath(tileset.image)),
            name: 				tileset.name,
            width: 				tileset.imageWidth,
            height:				tileset.imageHeight,
            tileWidth: 			tileset.tileWidth,
            tileHeight:			tileset.tileHeight,
            tileCount:			tileset.tileCount,
            firstgid:			lastgid + 1
        };

        lastgid = tSet.tileCount;
        tilesets[tilesetIndex] = tSet;
    });

    return tilesets;
}