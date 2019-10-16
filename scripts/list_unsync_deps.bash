#!/bin/bash

PKGS=`find . -type d -name "@cpmech" -not -path "./.git/*" -not -path "./node_modules/*" | awk -F"/" '{print $2}'`

for p in $PKGS; do
  deps=`ls ./$p/node_modules/@cpmech`
  echo
  echo
  echo "$p needs syncing:"
  for d in $deps; do
    echo "  "$d
    echo "    $oldVer => $newVer"
  done
done
