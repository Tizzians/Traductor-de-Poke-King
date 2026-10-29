#!/usr/bin/env bash
# Crea el ZIP listo para subir a Chrome Web Store, Edge Add-ons o Firefox AMO
# (manifest.json queda en la raíz del ZIP).
set -euo pipefail
cd "$(dirname "$0")/../extension"
VERSION=$(grep -o '"version": *"[^"]*"' manifest.json | head -1 | sed 's/.*: *"\(.*\)"/\1/')
OUT="../pokeking-traductor-es-${VERSION}.zip"
rm -f "$OUT"
zip -r "$OUT" . -x "*.DS_Store"
echo "Creado: $(cd .. && pwd)/pokeking-traductor-es-${VERSION}.zip"
