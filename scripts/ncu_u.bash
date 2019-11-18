#!/bin/bash

set -e

PKS=`cat package.json | jq -r '.workspaces | .[]'`
HERE=`pwd`

for p in $PKS; do
  echo "######################### $p"
  cd $p
  ncu -u
  cd $HERE
done