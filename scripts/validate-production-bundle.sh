#!/bin/sh
set -eu

IMAGE=${1:?Usage: scripts/validate-production-bundle.sh IMAGE}
bundle_dir=$(mktemp -d)
container=$(docker create "$IMAGE")

cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
  rm -rf "$bundle_dir"
}
trap cleanup EXIT INT TERM

if ! docker cp "$container:/usr/share/nginx/html/assets/." "$bundle_dir"; then
  echo "Unable to read /usr/share/nginx/html/assets from image $IMAGE" >&2
  exit 1
fi

js_files=$(find "$bundle_dir" -type f -name '*.js')
if [ -z "$js_files" ]; then
  echo "No JavaScript bundle found in image $IMAGE" >&2
  exit 1
fi

# React 18 retains these license-banner module names in Vite's minified output.
# Requiring the production modules and rejecting the development modules checks
# the deployed artifact itself, independent of its content-hashed filename.
if ! grep -RlF 'react.production.min.js' $js_files >/dev/null || \
   ! grep -RlF 'react-dom.production.min.js' $js_files >/dev/null; then
  echo "Production React and ReactDOM modules were not found in image $IMAGE" >&2
  echo "The Docker build may not have run with NODE_ENV=production." >&2
  exit 1
fi

development_markers='react\.development\.js|react-dom\.development\.js|react-jsx-dev-runtime\.development\.js|React DevTools|jsxDEV'
if grep -RniE "$development_markers" $js_files; then
  echo "Development-only React code was found in image $IMAGE" >&2
  echo "Build the application with NODE_ENV=production before copying dist into nginx." >&2
  exit 1
fi

echo "production React bundle validation passed"
