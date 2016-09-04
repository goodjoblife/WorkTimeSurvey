#!/bin/bash

REV=`git describe --always`

rm -rf public
git clone git@github.com:goodjoblife/WorkTimeSurvey.git public -b gh-pages --depth 1

# Remove all the old build files

rm -rf public/* public/.gitignore
cp CNAME public/

# Build the page into public

npm install
npm run build

# Build done, now commit it

cd public
git add -A .
git commit -m "regen for $REV"
git push origin gh-pages
