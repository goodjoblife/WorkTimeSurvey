#!/bin/bash

REV=`git describe --always`

rm -rf _public
git clone git@github.com:goodjoblife/WorkTimeSurvey.git _public -b gh-pages-migrate --depth 1

# Remove all the old build files

rm -rf _public/*

# Build done, now commit it

cp -r public/* _public
cp CNAME _public/
# patch for the facebook og image
mkdir -p _public/img
cp src/img/common/og-image_1200-630.png _public/img/
cd _public
git add -A .
git commit -m "regen for $REV"
git push origin gh-pages-migrate
