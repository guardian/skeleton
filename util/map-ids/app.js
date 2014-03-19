/*
Recursively find all collection.json files below the local ./collections directory,
query ContentApi to get the internalContentCode for each item in live/draft/supporting,
replace each item's id with its internalContentCode,
overwrite the ammended collection.json file.
*/

var fs = require('fs'),
    http = require('http'),
    recurseDir = require('recursive-readdir'),

    iccPrefix = "internal-code/content/",
    tally = {};

function deepGet(obj, props) {
    props = (props + '').split(/\.+/).filter(function(str) {return str;});
    while (obj && props.length) {
      obj = obj[props.shift()];
    }
    return obj;
}

function setTally(key, doDecrement) {
    tally[key] = tally[key] || 0;
    tally[key] += doDecrement ? -1 : 1;
}

function getTally(key) {
    return tally[key];
}

function transformId(item, data, filename) {
    if (item.id.indexOf(iccPrefix) === 0) { return; }

    setTally(filename);

    http.get("http://concierge.content.guardianapis.com/" + item.id + "?show-fields=all", function(res) {
        var str = '';

        res.on('data', function(chunk) { str += chunk; });
        res.on('end', function() {
            var icc = deepGet(JSON.parse(str), 'response.content.fields.internalContentCode');

            setTally(filename, true);

            console.log("Mapped " + icc + " <- " + item.id + " (" + getTally(filename) + ")");

            if (icc) {
                item.id = iccPrefix + icc;
            }

            if (getTally(filename) === 0) {
                fs.writeFile(filename, JSON.stringify(data, null, 2), function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log("Transformed: " + filename );
                    }
                });
            }
        });
    }).on('error', function(err) {
        setTally(filename, true);
        console.log(err);
    });
}

recurseDir(__dirname + "/collection", function (err, files) {
    files.map(function(file) {
        if (!/collection\.json$/.test(file)) { return; }
        fs.readFile(file, 'utf8', function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            data = JSON.parse(data);

            [data.live, data.draft]
            .filter(function(list) { return list; })
            .forEach(function(list) {
                list.forEach(function(item) {
                    transformId(item, data, file);
                    (deepGet(item, 'meta.supporting') || []).forEach(function(item) {
                        transformId(item, data, file);
                    });
                });
            });
        });
    });
});
