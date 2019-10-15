#!/bin/bash

set -e

PREFIX='TEST_AZDB'
TABLEKEYS='USERS'
PORT=8001

echo
echo "usage:"
echo "     ./`basename $0` [CLOUD]"
echo "where:"
echo "    CLOUD = [yes,no]  (default = no)"
echo

CLOUD="no"
if [[ "$#" -eq 1 ]]; then
  if [[ "$1" == "yes" ]]; then
    CLOUD="yes"
  fi
fi

echo
echo "running with:"
echo "   CLOUD = $CLOUD"
echo

ENDPOINT=http://localhost:$PORT

COMMAND="--endpoint-url $ENDPOINT"
if [[ "$CLOUD" == "yes" ]]; then
  COMMAND=""
fi

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo
  echo
  echo "... listing table '$table'"
  aws dynamodb scan --table-name $table $COMMAND || true
done
