#!/bin/bash

PORT=8008

docker run -d -p $PORT:8000 amazon/dynamodb-local 2> /dev/null || true
