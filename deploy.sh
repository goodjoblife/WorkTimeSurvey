#!/bin/bash

REV=`git describe --always`

rm -rf _public
git clone git@github.com:goodjoblife/WorkTimeSurvey.git _public -b gh-pages --depth 1

# Remove all the old build files

rm -rf _public/*

# Build done, now commit it

cp -r public/* _public
cp CNAME _public/
cd _public
git add -A .
git commit -m "regen for $REV"
git push origin gh-pages
