#!/bin/bash

PKGS=`find . -type d -name "@cpmech" -not -path "./.git/*" -not -path "./node_modules/*" | awk -F"/" '{print $2}'`

for p in $PKGS; do
  deps=`ls ./$p/node_modules/@cpmech`
  echo
  echo
  echo "$p needs syncing:"
  for d in $deps; do
    dd="@cpmech/$d"
    oldVer=`jq -r ".dependencies.\"$dd\"" ./$p/package.json`
    newVer=`jq -r '.version' ./$d/package.json`
    echo "  "$d
    echo "    $oldVer => $newVer"
    jq ".dependencies.\"$dd\"=\$v" --arg v "$newVer" ./$p/package.json > tmp.$$.json && mv -f tmp.$$.json ./$p/package.json
  done
done

yarn install