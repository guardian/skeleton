var config = require('./frontsapi/config/config.json'),

    frontsLen,
    collectionsLen,
    referencedCollections = {},
    front,
    collections,
    collection,
    output = '',
    errOutput = '';

if(config && config.fronts && config.collections) {

    frontsLen = Object.keys(config.fronts).length;
    collectionsLen = Object.keys(config.collections).length;

    console.log('Checking ' + frontsLen + ' fronts and ' + collectionsLen + ' collections...');

    output += frontsLen ? '' :      'ERROR : no fronts were found';
    output += collectionsLen ? '' : 'ERROR : no collections were found';

    for(var frontId in config.fronts) {
        front = config.fronts[frontId];
        collections = front.collections;
        if(collections instanceof Array) {
            collections.forEach(function(collectionId){
                var collection = config.collections[collectionId];
                if(typeof collection === 'object' && collection !== null) {
                    referencedCollections[collectionId] = true;
                } else {
                    errOutput += 'ERROR : front  "' + frontId + '" refers to non-existant collection "' + collectionId + '"\n';
                }
            });
        } else {
            output += 'WARN  : front  ' + front + ' has no \'collections\' array property\n';
        }
    }

    for(var collectionId in config.collections) {
        collection = config.collections[collectionId];
        if(typeof collection === 'object' && collection !== null) {
            if(!referencedCollections[collectionId]) {
                output += 'Info  : collection "' + collectionId + '" is not referenced by any front (possibly on purpose)\n';
            }
        } else {
            errOutput += 'ERROR : collection "' + collectionId + '" is malformed\n';
        }
    }

} else {
    errOutput += 'ERROR : invalid config.json!';
}

console.log(output);
console.log(errOutput || 'OK');

if (errOutput) {
    process.exit(1);
}


