#!/bin/sh
set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
output_dir="$project_dir/outputs"

cd "$project_dir"

if [ ! -d node_modules ]; then
  printf '%s\n' 'Dependencies are not installed. Run npm ci first.' >&2
  exit 1
fi

npm run build
mkdir -p "$output_dir"

for browser in chrome firefox; do
  source_dir="$project_dir/dist-$browser"
  archive="$output_dir/my-health-$browser.zip"

  if [ ! -d "$source_dir" ]; then
    printf 'Expected build directory was not created: %s\n' "$source_dir" >&2
    exit 1
  fi

  rm -f "$archive"
  (cd "$source_dir" && zip -qr "$archive" . -x '*.DS_Store')
  printf 'Created %s\n' "$archive"
done
