#!/bin/bash

set -e

echo ">>> copy git pre-commit hook <<<"
cp ./zscripts/git-pre-commit.sh ./.git/hooks/pre-commit
chmod +x ./.git/hooks/pre-commit
