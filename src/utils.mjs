// Matches string that contains a "/" with any other non "/" characters before and after a "/"
// Gives you the contents of the string from the 2nd to last slash to the end of string.
// For a file path, it gives you the file and the directory it is in.
export const getRelativePath = path => path.match(/[^\/]+\/[^\/]+$/)[0];
export const getBitmapTablePath = relPath => relPath.match(/(.+)-[^-]+-[^-]+-[^-]+$/)[1];

export const getGroupLayer = (layers, nameToMatch) => layers.find(layer => layer.isGroupLayer && layer.name === nameToMatch);
export const getGroupLayerByClass = (layers, classNameToMatch) => layers.find(layer => layer.isGroupLayer && layer.className === classNameToMatch);
export const getObjectLayer = (layers, nameToMatch) => layers.find(layer => layer.isObjectLayer && layer.name === nameToMatch);
export const getObjectLayerByClass = (layers, classNameToMatch) => layers.find(layer => layer.isObjectLayer && layer.className === classNameToMatch);
export const getObjectByName = (objects, nameToMatch) => objects.find(object => object.name === nameToMatch);
export const getObjectByClass = (objects, classNameToMatch) => objects.find(object => object.className === classNameToMatch);