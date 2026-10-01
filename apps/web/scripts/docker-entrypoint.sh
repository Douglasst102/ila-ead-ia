#!/bin/sh
set -e

. ./scripts/npm-sync.sh

exec "$@"
