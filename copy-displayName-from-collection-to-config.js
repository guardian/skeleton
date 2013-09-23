/*
Usage
$ node copy-displayName-from-collection-to-config.js {config_dir} {collections_dir}

e.g.
$  node copy-displayName-from-collection-to-config.js frontsapi/config/ frontsapi/collection/
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
            callback({});
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
    var filename = root + '/' + stat.name;

    fs.readFile(filename, 'utf8', function (err,data) {
        var config = parse2json(data);

        async.each(
            config,
            function(collConf, callback){
                jsonFromFile(collectionsDir + '/' + collConf.id + '/collection.json', function(collection){
                    if (typeof collConf.displayName === 'undefined' && collection.displayName) {
                        console.log('Adding: ' + collection.displayName);
                        collConf.displayName = collection.displayName;
                    }
                    callback();
                });
            },
            function(err) {
                fs.writeFile(filename, JSON.stringify(config, null, '  '), function (err) {
                    if (err) throw err;
                    console.log('Updated: ' + filename);
                });
            }
        );
    });
    next();
});

