#!/bin/bash

echo "🔄 Running ESLint..."

FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep -E "\.(js|jsx|ts|tsx)$")

if [ "$FILES" = "" ]; then
    echo "No JavaScript/TypeScript files to check"
    exit 0
fi

npm run lint $FILES

if [ $? -ne 0 ]; then
    echo "❌ ESLint found errors. Please fix them and try committing again"
    exit 1
fi

echo "✅ ESLint checks passed"
exit 0