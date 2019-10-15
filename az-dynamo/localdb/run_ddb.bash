#!/bin/bash

PORT=8001

docker run -d -p $PORT:8000 amazon/dynamodb-local 2> /dev/null || true
