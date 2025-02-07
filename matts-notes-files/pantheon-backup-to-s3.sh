#!/bin/sh

# pantheon-backup-to-s3.sh
# Script to backup Pantheon sites and copy to Amazon s3 bucket
#
# Requirements:
#   - Pantheon terminus cli
#   - Valid terminus machine token
#   - Amazon aws cli
#   - s3 cli access and user configured


# The amazon S3 bucket to save the backups to (must already exist)
S3BUCKET="learning-services-media.brightcove.com"
# Optionally specify bucket region
#S3BUCKETREGION=""
# The Pantheon terminus user (email address)
TERMINUSUSER="mboles@brightcove.com"
# Site names to backup (e.g. 'site-one site-two')
SITENAMES="My-D8-Composer-Site"
# Site environments to backup (any combination of dev, test and live)
SITEENVS="Live"
# Elements of backup to be downloaded.
ELEMENTS="code files db"
# Local backup directory (must exist, requires trailing slash)
BACKUPDIR="/"
# Add a date and unique string to the filename
BACKUPDATE=$(date +%Y%m%d%s)
# This sets the proper file extension
EXTENSION="tar.gz"

# connect to terminus
terminus auth:login --email $TERMINUSUSER

# iterate through sites to backup
for thissite in $SITENAMES; do
  # iterate through current site environments
  for thisenv in $SITEENVS; do
    # create backup
    terminus backup:create $thissite.$thisenv

    # iterate through backup elements
    for element in $ELEMENTS; do
      # download current site backups
      terminus backup:get --element=$element --to=$BACKUPDIR$thissite.$thisenv.$element.$BACKUPDATE.$EXTENSION $thissite.$thisenv
    done
  done
done
echo $BACKUPDIR

# sync the local backup directory to aws s3
if [ -z "${S3BUCKETREGION}" ]; then
    aws s3 sync $BACKUPDIR s3://$S3BUCKET
else
  aws s3 sync $BACKUPDIR s3://$S3BUCKET --region $S3BUCKETREGION

fi