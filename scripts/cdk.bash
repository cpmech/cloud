#!/bin/bash

set -e

# set directory with the index*.ts files
DIR="src/az-cdk"

# check input
if [[ $# -lt 1 ]]; then
  echo
  echo "Usage:"
  echo
  echo "  ./`basename $0` GROUP[-KIND] [COMMAND] [STAGE] [OPTIONS]"
  echo
  echo "where ${DIR}/index-GROUP[-KIND].ts must exist"
  echo
  exit 1
  echo
fi

# extract input
array=(${1//-/ })
GROUP=${array[0]}
KIND=${array[1]}
COMMAND=$2
STAGE="dev"
OPTIONS=""

# set stage and options according to the optional inputs
if [[ $3 != "" ]]; then
  if [[ $3 == -* ]]; then
    OPTIONS="${@:3}"
  else
    STAGE=$3
    OPTIONS="${@:4}"
  fi
fi

# check stage name
if [[ $STAGE != "dev" && $STAGE != "pro" ]]; then
  echo
  echo "ERROR: STAGE must be either 'dev' or 'pro' (or empty => 'dev')"
  echo
  exit 1
fi

# deternine stack name pattern
STACK=""
if [[ $KIND == "sup" && $COMMAND != "bootstrap" ]]; then
  STACK="*-sup"
fi

# show input
echo
echo "======================================="
echo "  GROUP   = $GROUP"
echo "  KIND    = $KIND"
echo "  COMMAND = $COMMAND"
echo "  STAGE   = $STAGE"
echo "  OPTIONS = $OPTIONS"
echo "======================================="
echo

# declare some constants
BIN='./node_modules/.bin'
CDK=$BIN/cdk
TSNODE="$BIN/ts-node -O '{\"module\":\"commonjs\",\"resolveJsonModule\":true}'"
SUFIX=""
if [[ $KIND != "" ]]; then
  SUFIX="-$KIND"
fi
APP="$TSNODE $DIR/index-$GROUP$SUFIX.ts"

# run the CDK
export STAGE=$STAGE
rm -rf cdk.out
if [[ $COMMAND == "diff" ]]; then
  $CDK --app "$APP" $COMMAND $STACK $OPTIONS || true
else
  $CDK --app "$APP" $COMMAND $STACK $OPTIONS
fi
