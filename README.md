Configuration files for NextGen fronts
======================================

To mirror these to S3, use [s3cmd](http://s3tools.org/s3cmd). For instance from the repo's root folder, do something like:

```
# check jason is valid
find ./ -name *.json | xargs jslint
 
# sync up to s3
s3cmd sync --acl-public ./frontsapi/ s3://aws-frontend-store/DEV/frontsapi/
```
