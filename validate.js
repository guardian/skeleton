/*
If a collection has a displayName, and a config hasn't, copy it into the config

Usage
$ node copy-displayName-from-collection-to-config.js {config_dir} {collections_dir}

e.g.
$ node copy-displayName-from-collection-to-config.js frontsapi/config/ frontsapi/collection/
*/

var fs = require('fs'),
    config = require('./frontsapi/config/config.json'),

    frontsLen,
    collectionsLen,
    referencedCollections = {},
    front,
    collections,
    collection,
    output = '';

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
                    output += 'ERROR : front  "' + frontId + '" refers to non-existant collection "' + collectionId + '"\n';
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
            output += 'ERROR : collection "' + collectionId + '" is malformed\n';
        }
    }

} else {
    output += 'ERROR : invalid config.json!';
}

console.log(output || 'OK');
