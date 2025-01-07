#!/bin/bash

echo "📦 Publishing package..."
echo "📦 Running \"npm publish $1\"..."
output=$(npm publish $1 2>&1)

if [[ $output == *"You cannot publish over the previously published versions"* ]]; then
  echo "⚠️ This version was already published."
  echo "⚠️ In most cases it's ok, the version will be updated in a separate pull request"
elif [[ $output == *"npm ERR!"* ]]; then
  echo "❌ Failed to publish package because of an error: $output"
  exit 1
else
  echo "🎉 Published npm package successfully!"
  
  echo "📦 Creating a new tag..."
  export TAG=$(jq -r '.version' package.json)
  export TAG="v${TAG}"
  git tag $TAG
  git push origin $TAG
fi
