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

wait_for_nginx() {
  attempts=0
  while ! curl -sS -o /dev/null "$base_url/" 2>/dev/null; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 30 ]; then
      echo "nginx did not become ready at $base_url" >&2
      docker logs "$container" >&2 || true
      exit 1
    fi
    sleep 0.2
  done
}

assert_status() {
  path=$1
  expected=$2
  actual=$(curl -sS -o /dev/null -w '%{http_code}' "$base_url$path")
  if [ "$actual" != "$expected" ]; then
    echo "Expected $path to return $expected, got $actual" >&2
    exit 1
  fi
}

assert_redirect() {
  path=$1
  expected_location=$2
  headers=$(curl -sS -D - -o /dev/null "$base_url$path")
  status=$(printf '%s\n' "$headers" | tr -d '\r' | sed -n '1s#^HTTP/[0-9.]* \([0-9][0-9][0-9]\).*$#\1#p')
  location=$(printf '%s\n' "$headers" | tr -d '\r' | sed -n 's/^Location: //p' | head -n 1)

  if [ "$status" != "308" ]; then
    echo "Expected $path to return 308, got ${status:-unknown}" >&2
    printf '%s\n' "$headers" >&2
    exit 1
  fi

  if [ "$location" != "$expected_location" ]; then
    echo "Expected $path Location to be $expected_location, got ${location:-missing}" >&2
    printf '%s\n' "$headers" >&2
    exit 1
  fi
}

assert_title() {
  path=$1
  expected=$2
  body=$(curl -fsS "$base_url$path")
  if ! printf '%s\n' "$body" | grep -Fq "<title>$expected</title>"; then
    echo "Expected $path title to be '$expected'" >&2
    exit 1
  fi
}

wait_for_nginx
assert_status / 200
assert_status /help 200
assert_status /join 200
assert_status /privacy 200
assert_redirect '/help.html?from=validation' '/help?from=validation'
assert_redirect '/index.html?from=validation' '/?from=validation'
assert_redirect /privacy.html /privacy
assert_redirect /index.html /
assert_status /does-not-exist 404
assert_status /404.html 404
assert_title /help 'Help | CK Conflux'
assert_title /join 'Join CK Conflux | CK Conflux'
assert_title /privacy 'Privacy Policy | CK Conflux'

echo "nginx route validation passed"
