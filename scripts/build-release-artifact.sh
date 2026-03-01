#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

VERSION="${1:-}"
if [[ -z "$VERSION" ]]; then
  VERSION="$(node -p "require('./package.json').version")"
fi

ARTIFACT_DIR="release"
STAGING_DIR="$ARTIFACT_DIR/package"
ARTIFACT_NAME="paperless-cli-${VERSION}.tar.gz"

rm -rf "$ARTIFACT_DIR"
mkdir -p "$STAGING_DIR"

bun run build

cp dist/paperless-cli "$STAGING_DIR/"
cp README.md "$STAGING_DIR/"

if [[ -f LICENSE ]]; then
  cp LICENSE "$STAGING_DIR/"
fi

tar -czf "$ARTIFACT_DIR/$ARTIFACT_NAME" -C "$STAGING_DIR" .

if command -v sha256sum >/dev/null 2>&1; then
  sha256sum "$ARTIFACT_DIR/$ARTIFACT_NAME" > "$ARTIFACT_DIR/$ARTIFACT_NAME.sha256"
else
  shasum -a 256 "$ARTIFACT_DIR/$ARTIFACT_NAME" > "$ARTIFACT_DIR/$ARTIFACT_NAME.sha256"
fi

echo "$ARTIFACT_DIR/$ARTIFACT_NAME"
