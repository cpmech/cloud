#!/bin/bash

set -e

# (re)start services
echo
echo
echo "... (re)start services ..."
docker kill azs3_localstack 2> /dev/null || true
docker rm azs3_localstack 2> /dev/null || true
sleep 1
docker-compose up -d
sleep 1

# populate s3 bucket
echo
echo
echo "... create s3 bucket ..."
BUCKET="testing-azs3"
aws s3 mb s3://$BUCKET --endpoint-url=http://localhost:4566

# populate s3 bucket
echo
echo
echo "... populate s3 bucket ..."
INPUT="src/__integ__/data"
aws s3 cp --recursive $INPUT s3://$BUCKET/data --endpoint-url=http://localhost:4566
