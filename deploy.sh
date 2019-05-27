#!/bin/bash
set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add
  npm run build
  rsync -rq --delete --rsync-path="mkdir -p serverEducation && rsync" \
  $TRAVIS_BUILD_DIR travis@104.248.167.41:serverEducation
  pm2 start ecosystem.config.js--only GRAPHQL_GRIFFOULEDUCATION
else
  echo "Not deploying, since this branch isn't master."
fi