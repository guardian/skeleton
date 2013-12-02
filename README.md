Configuration files for NextGen fronts
======================================

The `config.json` file in this repo determines which fronts have which article collections on them. To mirror this to S3, do the following.

Install [s3cmd](http://s3tools.org/s3cmd) (e.g. [Ubuntu](http://s3tools.org/repositories#note-deb) install notes). You will need an AWS key and secret-key before you run this:
```
s3cmd --configure
```

From the repo's root folder, check that `config.json` is valid:
```
node validate.js
```

To upload the configuration file, sync it up to S3. From the repo's root folder (replace DEV/CODE/PROD as appropriate):
```
s3cmd sync --acl-public ./frontsapi/config/ s3://aws-frontend-store/DEV/frontsapi/config/
```

Edit front pages contents
======================================

If the fronts tool is inaccesible or broken, you can edit the contents of fronts by modifying files stored on S3, as follows.

(1) Install jslint for JSON validation - a HIGHLY recommended precaution:
```
sudo npm install -g jslint
```

(2) In `config.json` file, look down the paths in the `fronts` property for the page you need to edit - then find the reference to the collection you need to edit within it. (**DO NOT** edit `config.json` - just use it to identify collections that you need to edit).

(3) Switch to a temporary working directory elsewhere, then download the live "collections":
```
s3cmd sync s3://aws-frontend-store/PROD/frontsapi/collection ./
```
(You could just download individual ones; up to you.)

Find and edit the appropriate `collection.json` file. In the example above, the file would be...
```
collection/uk/news/regular-stories/collection.json
```
...and would look something like (unimportant properties ommited):
```
{
  "live": [
    {
        "id" : "world/video/2013/oct/11/us-government-shutdown-stalemate-talks-video"
    },
    {
        "id" : "world/2013/sep/30/nsa-files-edward-snowden-gchq-whistleblower"
    }
  ]
}
```

(3) add/remove/reorder content by editing the objects in the `live' array. Then CHECK IT IS VALID JSON:
```
find ./ -name *.json | xargs jslint
```

Finally, upload the collection files:
```
s3cmd sync s3://aws-frontend-store/PROD/frontsapi/collection ./
```
(You could just upload individual files; up to you.)

**Important** be careful to throw away your local copy of these collections. These are rapidly edited, and you risk overwriting later edits by holding on to them. 