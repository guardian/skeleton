Configuration files for NextGen fronts
======================================

To mirror these to S3, use [s3cmd](http://s3tools.org/s3cmd). For instance from the repo's root folder, do one of:

```
s3cmd sync ./frontsapi/ s3://aws-frontend-store/DEV/frontsapi/
s3cmd sync ./frontsapi/ s3://aws-frontend-store/CODE/frontsapi/
s3cmd sync ./frontsapi/ s3://aws-frontend-store/PROD/frontsapi/
```
