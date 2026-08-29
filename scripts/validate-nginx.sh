#!/bin/sh
set -eu

IMAGE=${1:-ckconflux-react:nginx-validation}

if [ "$#" -eq 0 ]; then
  docker build -t "$IMAGE" .
fi

container=$(docker run --rm -d -p 127.0.0.1::80 "$IMAGE")
cleanup() {
  docker rm -f "$container" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

port=$(docker port "$container" 80/tcp | sed -n '1s/.*://p')
base_url="http://127.0.0.1:$port"

assert_status() {
  path=$1
  expected=$2
  actual=$(curl -sS -o /dev/null -w '%{http_code}' "$base_url$path")
  test "$actual" = "$expected" || {
    echo "Expected $path to return $expected, got $actual" >&2
    exit 1
  }
}

assert_redirect() {
  path=$1
  expected_location=$2
  headers=$(curl -sS -D - -o /dev/null "$base_url$path")
  echo "$headers" | tr -d '\r' | grep -q '^HTTP/1.1 308 '
  echo "$headers" | tr -d '\r' | grep -Fqx "Location: $base_url$expected_location"
}

assert_status / 200
assert_status /help 200
assert_status /privacy 200
assert_redirect '/help.html?from=validation' '/help?from=validation'
assert_redirect /privacy.html /privacy
assert_redirect /index.html /
assert_status /does-not-exist 404
assert_status /404.html 404

curl -fsS "$base_url/help" | grep -q '<title>Help | CK Conflux</title>'
curl -fsS "$base_url/privacy" | grep -q '<title>Privacy Policy | CK Conflux</title>'

echo "nginx route validation passed"
