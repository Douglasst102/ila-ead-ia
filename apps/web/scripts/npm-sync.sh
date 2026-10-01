#!/bin/sh
# CON-009 — preferir lockfile (npm ci) em dev container
if [ -f package-lock.json ]; then
  echo "[web entrypoint] npm ci (package-lock.json, --ignore-scripts)..."
  npm ci --no-audit --no-fund --ignore-scripts || npm install --no-audit --no-fund --ignore-scripts
else
  echo "[web entrypoint] npm install (sem lockfile, --ignore-scripts)..."
  npm install --no-audit --no-fund --ignore-scripts
fi
