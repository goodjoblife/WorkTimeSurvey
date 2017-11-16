#!/bin/bash

set -x

git config --global user.email "findyourgoodjob@gmail.com"
git config --global user.name "goodjob team (via CI)"

rm -rf _public
git clone git@github.com:goodjoblife/WorkTimeSurvey.git _public -b gh-pages --depth 1

# Remove all the old build files

rm -rf _public/*
cp -r public/* _public
# patch for the facebook og image
mkdir -p _public/img
cp src/img/common/og-image_1200-630.png _public/img/

mkdir -p _public/share
mv _public/index.html _public/share/time-and-salary

cd _public
git add -A .
git commit -m "regen for ${CIRCLE_SHA1}"
git push origin gh-pages
