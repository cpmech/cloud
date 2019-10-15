#!/bin/bash

set -e

if [ "$#" -lt 2 ]; then
	echo
	echo "Usage:"
	echo "        $0 {az-cdk,basic,js2ts,...} COMMAND"
	echo
	exit 1
fi

pkg=$1
shift
yarn workspace @cpmech/$pkg $@