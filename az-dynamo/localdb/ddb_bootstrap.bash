#!/bin/bash

PREFIX='TEST-AZDYN'
PORT=8008
ENDPOINT=http://localhost:$PORT
SAMPLES='localdb/samples'

CLOUD="no"
if [[ "$#" -eq 1 ]]; then
  if [[ "$1" == "yes" ]]; then
    CLOUD="yes"
  fi
fi

COMMAND="--endpoint-url $ENDPOINT"
if [[ "$CLOUD" == "yes" ]]; then
  COMMAND=""
fi

table=$PREFIX-USERS

echo "... deleting table ..."
aws dynamodb delete-table --table-name $table $COMMAND >/dev/null || true

echo "... waiting for deletion of table ..."
aws dynamodb wait table-not-exists --table-name $table $COMMAND || true

echo "... creating table ..."
aws dynamodb create-table --cli-input-json file://$SAMPLES/USERS-table.json $COMMAND >/dev/null

echo "... waiting for creation of table ..."
aws dynamodb wait table-exists --table-name $table $COMMAND

echo "... put items in table ..."
aws dynamodb batch-write-item --request-items file://$SAMPLES/USERS-data-1.json $COMMAND >/dev/null
aws dynamodb batch-write-item --request-items file://$SAMPLES/USERS-data-2.json $COMMAND >/dev/null

# echo "... scanning table ..."
# aws dynamodb scan --table-name $table --return-consumed-capacity TOTAL $COMMAND || true
