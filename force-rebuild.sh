#!/bin/bash

echo "🧹 Limpiando cache y archivos antiguos..."
yarn reset

echo "🔨 Compilando extensión..."
yarn build

echo "📋 Información de build:"
echo "Versión en manifest: $(grep -o '"version": "[^"]*"' unpacked2x/manifest.json)"
echo "Fecha de compilación: $(date)"
echo "Archivos generados:"
ls -la unpacked2x/ | head -10

echo ""
echo "✅ Build completado!"
echo ""
echo "📌 Próximos pasos:"
echo "1. Ve a chrome://extensions/"
echo "2. Elimina la extensión actual"
echo "3. Carga la extensión desde: $PWD/unpacked2x/"
echo "4. Verifica que la versión sea 2.0.6"
