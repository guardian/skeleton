/*
If a collection has a displayName, and a config hasn't, copy it into the config

Usage
$ node copy-displayName-from-collection-to-config.js {config_dir} {collections_dir}

e.g.
$ node copy-displayName-from-collection-to-config.js frontsapi/config/ frontsapi/collection/
*/

var async  = require('async'),
    fs     = require('fs'),
    walk   = require('walk'),

    configsDir = process.argv[2],
    collectionsDir = process.argv[3],
    walker = walk.walk(configsDir, { followLinks: false });

function jsonFromFile(filename, callback) {
    fs.readFile(filename, 'utf8', function (err,data) {
        if (err) {
            callback(false);
        } else {
            callback(parse2json(data));
        }
    });
}

function parse2json(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
}

walker.on('file', function(root, stat, next) {
    var configFile = root + '/' + stat.name;

    fs.readFile(configFile, 'utf8', function (err,data) {
        var config = parse2json(data);

        async.each(
            config,
            function(collConf, callback){
                var colectionFile = collectionsDir + '/' + collConf.id + '/collection.json';

                jsonFromFile(colectionFile, function(collection){
                    if (collection) {
                        if (typeof collConf.displayName === 'undefined' && collection.displayName) {
                            console.log('Moving: ' + collection.displayName);
                            collConf.displayName = collection.displayName;
                        }

                        collection.displayName = undefined;

                        fs.writeFile(colectionFile, JSON.stringify(collection, null, '  '), function (err) {
                            if (err) throw err;
                            console.log('Updated collection: ' + colectionFile);
                        });
                    }
                    callback();
                });
            },
            function(err) {
                fs.writeFile(configFile, JSON.stringify(config, null, '  '), function (err) {
                    if (err) throw err;
                    console.log('Updated config: ' + configFile);
                });
            }
        );
    });
    next();
});

