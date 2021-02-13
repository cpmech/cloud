#!/bin/sh

staged_files=$(git diff --cached --diff-filter=d --name-only | grep  -E '\.(js|jsx|ts|tsx)$')

# skip if there are no js or ts files
if [ -z "$staged_files" ]; then
    exit 0
fi

# run type-check
npm run --silent tsc
tsc_exit_code=$?

# check the tsc exit code
if [ $tsc_exit_code -ne 0 ]; then
    echo "🥵 tsc failed"
    exit 1
else
    echo "👍 tsc"
fi

# run linter on staged files => save exit code for later
npm run --silent eslint -- $staged_files --quiet --fix
linter_exit_code=$?

# add files auto-fixed by the linter
git add $staged_files

# check linter exit code
if [ $linter_exit_code -ne 0 ]; then
    echo "🥵 lint failed"
    exit 1
else
    echo "👍 lint"
fi

# return 0-exit code
echo "🎉 all good to go"
exit 0
