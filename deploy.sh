#!/bin/bash

REV=`git describe --always`

rm -rf public
git clone git@github.com:goodjoblife/WorkTimeSurvey.git public -b dev-gh-pages --depth 1

# Remove all the old build files

rm -rf public/* public/.gitignore
cp CNAME public/

# Build the page into public

cp -r bower_components css font-awesome fonts img js *.html public

# Build done, now commit it

cd public
git add -A .
git commit -m "regen for $REV"
git push origin dev-gh-pages
