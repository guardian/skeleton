Configuration files for NextGen fronts
======================================

To mirror these to S3, use [s3cmd](http://s3tools.org/s3cmd). For instance from the repo's root folder, do one of:

```
s3cmd sync --exclude '.git/*' --exclude 'README.md' ./ s3://aws-frontend-store/DEV/
s3cmd sync --exclude '.git/*' --exclude 'README.md' ./ s3://aws-frontend-store/CODE/
s3cmd sync --exclude '.git/*' --exclude 'README.md' ./ s3://aws-frontend-store/PROD/
```
