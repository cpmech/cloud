#!/bin/bash

npm adduser

cd az-cdk && npm publish && cd ..
cd az-cdk-crl && npm publish && cd ..
cd az-cognito && npm publish && cd ..
cd az-dynamo && npm publish && cd ..
cd az-lambda && npm publish && cd ..
cd az-s3 && npm publish && cd ..
cd az-senqs && npm publish && cd ..
cd basic && npm publish && cd ..
cd basic-sys && npm publish && cd ..
cd envars && npm publish && cd ..
cd httpcodes && npm publish && cd ..
cd js2ts && npm publish && cd ..
cd lang-query-graph && npm publish && cd ..
cd rnd && npm publish && cd ..
cd util && npm publish && cd ..
