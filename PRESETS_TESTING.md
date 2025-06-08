# 📋 Guía de Pruebas - Presets de Configuración

## Funcionalidades Implementadas

### ✅ Presets Predeterminados
- **🖼️ Solo Imágenes**: Filtra solo archivos de imagen (jpg, png, gif, etc.)
- **⚡ Código y Estilos**: Incluye CSS, JavaScript y documentos, excluye imágenes
- **🚫 Sin Terceros**: Excluye dominios de CDN conocidos (jsdelivr, unpkg, cdnjs, etc.)
- **📏 Archivos Pequeños**: Filtra archivos menores a 100KB

### ✅ Funcionalidades de Usuario
1. **Aplicar Presets**: Click en el botón de descarga para aplicar configuración
2. **Crear Presets Personalizados**: Configurar filtros y guardar con nombre personalizado
3. **Eliminar Presets**: Eliminar presets personalizados (no predeterminados)
4. **Exportar/Importar**: Backup y restauración de presets personalizados
5. **Feedback Visual**: Animaciones y mensajes de estado

### ✅ Mejoras Técnicas
- **Compatibilidad con Store**: Ajustado para usar la estructura actual del store
- **Persistencia Local**: Presets guardados en localStorage
- **Validación**: Manejo de errores en import/export
- **UI Mejorada**: Iconos, animaciones y tooltips

## Cómo Probar

### 1. Aplicar un Preset Predeterminado
1. Abrir DevTools en una página web
2. Ir a la pestaña "Resources Saver"
3. Buscar la sección "📋 Presets de Configuración"
4. Click en el botón de descarga (⬇️) de cualquier preset
5. Verificar que los filtros se actualicen en las secciones correspondientes

### 2. Crear un Preset Personalizado
1. Configurar manualmente los filtros avanzados
2. Escribir un nombre en el campo de texto del preset
3. Click en el botón guardar (💾)
4. Verificar que aparece en la lista

### 3. Exportar/Importar Presets
1. Click en el botón exportar (📤) para descargar archivo JSON
2. Click en el botón importar (📥) para seleccionar archivo
3. Verificar que los presets se cargan correctamente

## Estructura del Store Utilizada

```javascript
option: {
  filterByFileType: boolean,
  includeImages: boolean,
  includeStylesheets: boolean,
  includeScripts: boolean,
  includeFonts: boolean,
  includeDocuments: boolean,
  filterBySize: boolean,
  minFileSize: number,
  maxFileSize: number,
  excludeDomains: array,
  customFileExtensions: array
}
```

## Posibles Problemas y Soluciones

### Problema: Los presets no se aplican
**Solución**: Verificar que las acciones del store están correctamente definidas en `optionActions`

### Problema: Los presets no se guardan
**Solución**: Verificar que localStorage tiene permisos y espacio disponible

### Problema: Error al importar
**Solución**: Verificar que el archivo JSON tiene el formato correcto

## Próximas Mejoras
- [ ] Validación de presets antes de aplicar
- [ ] Presets predeterminados adicionales para casos específicos
- [ ] Vista previa de lo que incluye cada preset
- [ ] Duplicar presets existentes
- [ ] Categorización de presets personalizados
