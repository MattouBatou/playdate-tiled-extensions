// Matches string that contains a "/" with any other non "/" characters before and after a "/"
// Gives you the contents of the string from the 2nd to last slash to the end of string.
// For a file path, it gives you the file and the directory it is in.

/* error */

export const getRelativePath = path => path.match(/[^\/]+\/[^\/]+$/)[0];
export const getBitmapTablePath = relPath => relPath.match(/(.+)-[^-]+-[^-]+-[^-]+$/)[1];

export const getGroupLayer = (layers, nameToMatch) => layers.find(layer => layer.isGroupLayer && layer.name === nameToMatch);
export const getGroupLayerByClass = (layers, classNameToMatch) => layers.find(layer => layer.isGroupLayer && layer.className === classNameToMatch);

export const getObjectLayer = (layers, nameToMatch) => layers.find(layer => layer.isObjectLayer && layer.name === nameToMatch);
export const getObjectLayerByClass = (layers, classNameToMatch) => layers.find(layer => layer.isObjectLayer && layer.className === classNameToMatch);

export const getObjectByName = (objects, nameToMatch) => objects.find(object => object.name === nameToMatch);
export const getObjectByClass = (objects, classNameToMatch) => objects.find(object => object.className === classNameToMatch);

export const getImageLayer = (layers, nameToMatch) => layers.find(layer => layer.isImageLayer && layer.name === nameToMatch);

export const setUniqueArrayValue = (newValue, array) => {
    if(!Array.isArray(array)) {
        error('Please pass an array as second argument to "setUniqueArrayValue"');
    }

    const doesValueExistInArray = array.find(value => newValue === value);

    if(!doesValueExistInArray){
        array.push(newValue);
    }

    return;
};

export const int32ToUint32 = (x) => x >>> 0;
export const float64toInt32 = (x) => x|0;
export const numberToUint32 = (x) => int32ToUint32(float64toInt32(x));