import propertyTypes from "./propertytypes.mjs";

/* global tiled, log, error */
const getCustomPropertyType = nameToFind => propertyTypes.find(propDef => propDef.name === nameToFind);

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

// Function to retrieve custom property values such as a string value from a custom enum property type.
export const getObjectPropValue = (object, propName) =>
{
    // check if the resolved property is a custom property first.
    // check that a resolvedProperty exists (property that is either defined directly on the object or in the template).
    const resolvedProperty = object.resolvedProperty(propName);

    // no property of propName exists so move on to check the next element in the .find loop.
    if(!resolvedProperty) return false;

    // we have a resolved property, now check to see if it is a custom property. Only custom properties will have a type name.
    const customProperty = getCustomPropertyType(resolvedProperty.typeName);

    // if the resolved property is not a custom property
    if(!customProperty) return resolvedProperty;

    if(customProperty.type === 'enum')
    {
        return customProperty.values[resolvedProperty.value];
    }
    else if(customProperty.type === 'class')
    {
        return false;
    }
    
};

// Function to retrieve an object that matches the given property and property value.
export const getFirstObjectMatchingPropValue = (objects, propNameToCheck, valueToMatch) => objects.find(object => 
{
    const propValue = getObjectPropValue(object, propNameToCheck);

    if(!propValue) return false;

    return propValue === valueToMatch;
});


export const getObjectByClass = (objects, classNameToMatch) => objects.find(object => object.className === classNameToMatch);

export const getImageLayer = (layers, nameToMatch) => layers.find(layer => layer.isImageLayer && layer.name === nameToMatch);

export const setUniqueArrayValue = (newValue, array) => {
    if(!Array.isArray(array)) {
        error('Please pass an array as second argument to "setUniqueArrayValue"');
    }

    const doesValueExistInArray = array.find(value => newValue === value);

    if(doesValueExistInArray || doesValueExistInArray === null || doesValueExistInArray === 0){
        return;
    }

    array.push(newValue);
};

export const int32ToUint32 = (x) => x >>> 0;
export const float64toInt32 = (x) => x|0;
export const numberToUint32 = (x) => int32ToUint32(float64toInt32(x));