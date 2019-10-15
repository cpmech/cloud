#!/bin/bash

set -e

PREFIX='TEST_AZDB'
TABLEKEYS='USERS PARAMS'
PORT=8001

# echo
# echo "usage:"
# echo "     ./`basename $0` [CLOUD]"
# echo "where:"
# echo "    CLOUD = [yes,no]  (default = no)"
# echo

CLOUD="no"
if [[ "$#" -eq 1 ]]; then
  if [[ "$1" == "yes" ]]; then
    CLOUD="yes"
  fi
fi

# echo
# echo "running with:"
# echo "   CLOUD = $CLOUD"
# echo

ENDPOINT=http://localhost:$PORT
SAMPLES='localdb/samples'

COMMAND="--endpoint-url $ENDPOINT"
if [[ "$CLOUD" == "yes" ]]; then
  COMMAND=""
fi

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo "... deleting table '$table'"
  aws dynamodb delete-table --table-name $table $COMMAND >/dev/null || true
done

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo "... waiting for deletion of '$table' to complete"
  aws dynamodb wait table-not-exists --table-name $table $COMMAND || true
done

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo "... creating table '$table'"
  aws dynamodb create-table --cli-input-json file://$SAMPLES/$key-table.json $COMMAND >/dev/null
done

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo "... waiting for creation of '$table' to complete"
  aws dynamodb wait table-exists --table-name $table $COMMAND
done

for key in $TABLEKEYS; do
  table="${PREFIX}_${key}"
  echo "... put items in table '$table'"
  aws dynamodb batch-write-item --request-items file://$SAMPLES/$key-data.json $COMMAND >/dev/null
done

# for key in $TABLEKEYS; do
#   table="${PREFIX}_${key}"
#   echo
#   echo
#   echo "... wait then show items in table '$table'"
#   sleep 2
#   aws dynamodb scan --table-name $table $COMMAND
# done
