#!/bin/bash

node_env=$1
additional_cli_args=$2
os_type="$(uname -s)"

if [[ "$os_type" == "MINGW"* || "$os_type" == "CYGWIN"* || "$os_type" == "MSYS"* ]]; then
  is_windows_system=true
else
  is_windows_system=false
fi

# Do not delete files for development mode
# so you don't have to restart dev server for linked package on every update
[ "$node_env" != "development" ] && rm -rf dist/*
mkdir -p dist

if [ "$node_env" == "development" ] && [ ! -d "dist/node_modules" ]; then
  echo "🔧 Symlink node_modules to dist"
  cd dist
  ln -s ../node_modules ./
  cd ../
fi

cp {LICENSE,README.md,package.json,.npmignore} dist/

run_rollup_cli() {
  local cli_command=""
  local additional_cli_args=$1
  
if [ "$is_windows_system" = true ]; then
    # We use ./node_modules/rollup/dist/bin/rollup instead of just .bin executable because it doesn't work on Windows. See details here: https://stackoverflow.com/questions/56486742/getting-error-when-running-npm-start-ng-serve-syntaxerror-missing-after-ar
    cli_command="./node_modules/rollup/dist/bin/rollup"
    echo "Windows system detected, we'll use $cli_command to run Rollup CLI from bash script"
  else
    # On other systems just use .bin executable
    cli_command="./node_modules/.bin/rollup"
  fi
  
  NODE_ENV=$node_env node --max-old-space-size=8192 --abort-on-uncaught-exception $cli_command -c $additional_cli_args
}

if [[ ! -z "$CI" ]]; then
  # Generate cjs bundle only on CI, as usually you don't need this during the local development
  echo "🔄 Generating CJS bundle..."
  run_rollup_cli "--format \"cjs\""
fi

echo "🔄 Generating ESM bundle..."
run_rollup_cli "--format \"esm\" $additional_cli_args"
tsc --emitDeclarationOnly
