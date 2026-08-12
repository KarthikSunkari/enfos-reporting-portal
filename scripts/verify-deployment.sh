#!/usr/bin/env sh
set -eu

FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"
BACKEND_URL="${BACKEND_URL:-http://localhost:8080}"
MAX_ATTEMPTS="${MAX_ATTEMPTS:-30}"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT INT TERM

wait_for_url() {
  name="$1"
  url="$2"
  attempt=1

  while [ "$attempt" -le "$MAX_ATTEMPTS" ]; do
    if curl --fail --silent --show-error --output /dev/null "$url"; then
      printf '%s is ready\n' "$name"
      return 0
    fi

    attempt=$((attempt + 1))
    sleep 2
  done

  printf '%s did not become ready: %s\n' "$name" "$url" >&2
  return 1
}

assert_contains() {
  file="$1"
  expected="$2"

  if ! grep -Fqi "$expected" "$file"; then
    printf 'Expected %s to contain: %s\n' "$file" "$expected" >&2
    return 1
  fi
}

wait_for_url "Backend" "$BACKEND_URL/actuator/health"
wait_for_url "Frontend" "$FRONTEND_URL/healthz"

curl --fail --silent --show-error "$BACKEND_URL/actuator/health" > "$tmp_dir/backend-health.json"
assert_contains "$tmp_dir/backend-health.json" '"status":"UP"'

curl --fail --silent --show-error "$FRONTEND_URL/api/reports" > "$tmp_dir/reports.json"
assert_contains "$tmp_dir/reports.json" '"id":"users"'
assert_contains "$tmp_dir/reports.json" '"id":"departments"'
assert_contains "$tmp_dir/reports.json" '"id":"projects"'

for report in users departments projects; do
  curl --fail --silent --show-error "$FRONTEND_URL/api/reports/$report" > "$tmp_dir/$report.json"
  assert_contains "$tmp_dir/$report.json" 'Id"'

  curl --fail --silent --show-error --output "$tmp_dir/$report.html" \
    "$FRONTEND_URL/reports/$report"
  assert_contains "$tmp_dir/$report.html" '<div id="root"></div>'
done

curl --fail --silent --show-error --head "$FRONTEND_URL/" > "$tmp_dir/headers.txt"
assert_contains "$tmp_dir/headers.txt" 'Content-Security-Policy:'
assert_contains "$tmp_dir/headers.txt" 'X-Content-Type-Options: nosniff'
assert_contains "$tmp_dir/headers.txt" 'X-Frame-Options: DENY'
assert_contains "$tmp_dir/headers.txt" 'Permissions-Policy:'

printf 'Deployment verification passed\n'
