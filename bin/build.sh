#!/usr/bin/env bash

mkdir -p lib/golden-layout
cp -v node_modules/golden-layout/dist/*.js lib/golden-layout/
cp -v node_modules/golden-layout/src/css/*.css lib/golden-layout/
rm -r node_modules
