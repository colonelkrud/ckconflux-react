#!/usr/bin/env bash
set -euo pipefail

CHART_PATH="charts/ckconflux-react"
RENDER_DIR=".tmp/helm-rendered"

mkdir -p "$RENDER_DIR"

helm lint "$CHART_PATH"
helm template ckconflux-react "$CHART_PATH" > "$RENDER_DIR/all.yaml"
kubeconform -strict -summary -ignore-missing-schemas "$RENDER_DIR/all.yaml"
