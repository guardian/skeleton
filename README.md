Configuration files for NextGen fronts
======================================

The files in this repo (each called `config.json`) determine which fronts have which article collections on them. To mirror these to S3, do the following.

Install jslint for JSON validation - a HIGHLY recommended precaution:
```
sudo npm install -g jslint
```

Install [s3cmd](http://s3tools.org/s3cmd) (e.g. [Ubuntu](http://s3tools.org/repositories#note-deb) install notes). You will need an AWS key and secret-key before you run this:
```
s3cmd --configure
```

From the repo's root folder, check the json is valid:
```
find ./ -name *.json | xargs jslint
```

To upload the configuration files, sync them up to S3. From the repo's root folder (replace DEV/CODE/PROD as appropriate):
```
s3cmd sync --acl-public ./frontsapi/config/ s3://aws-frontend-store/DEV/frontsapi/config/
```

Edit front pages contents
======================================
If the fronts tool is inaccesible or broken, you can edit the contents of fronts by modifying files stored on S3, as follows.

(1) For the particular page you want to edit, first find the relevant `config.json` file - in this repo. For instance:
```
\uk       -->  frontsapi/config/uk/config.json
\uk\sport -->  frontsapi/config/uk/sport/config.json
etc...
```
**DO NOT** edit his file! Just look in it, to identify the specific collection you need to edit. For example if you need to edit Top Stories, the collection you need to edit is 'uk/news/regular-stories', as indicated by:
```
...
{
  "roleName": "Top stories",
  "id": "uk/news/regular-stories"
}
...etc.
```

(2) Switch to a temporary working directory elsewhere, then download the live "collections":
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

That's it. Wait a minute or two for the fronts application to rebuild your page.
