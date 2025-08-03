// Helpers de filtrado extraídos de file.js

import { getFileType, getFileExtension } from './file';

export function filterByType(resource, filters) {
  // Solo aplicar filtro si está explícitamente habilitado Y tiene restricciones
  if (filters.enableFileTypeFilter && filters.fileTypes) {
    const fileType = getFileType(resource.url, resource.mimeType);
    if (!filters.fileTypes[fileType]) {
      console.log('[FILTER]: Resource filtered by type:', fileType, resource.url);
      return false;
    }
  }
  return true;
}

export function filterBySize(resource, filters) {
  // Solo aplicar filtro si está explícitamente habilitado
  if (filters.enableSizeFilter && filters.minSize !== undefined && filters.maxSize !== undefined) {
    const getFileSize = resource.getFileSize || (() => 0);
    const fileSize = getFileSize(resource);
    const fileSizeKB = Math.round(fileSize / 1024);
    const minSize = filters.minSize || 0;
    const maxSize = filters.maxSize || Infinity;
    if (fileSizeKB < minSize || fileSizeKB > maxSize) {
      console.log('[FILTER]: Resource filtered by size:', fileSizeKB, 'KB (range:', minSize, '-', maxSize, ')', resource.url);
      return false;
    }
  }
  return true;
}

export function filterByDomain(resource, filters) {
  if (filters.excludedDomains && filters.excludedDomains.length > 0) {
    const domain = new URL(resource.url).hostname;
    if (filters.excludedDomains.some(excludedDomain => domain.includes(excludedDomain))) {
      return false;
    }
  }
  return true;
}

export function filterByExtension(resource, filters) {
  if (filters.customExtensions && filters.customExtensions.length > 0) {
    const extension = getFileExtension(resource.url);
    if (!filters.customExtensions.includes(extension)) {
      return false;
    }
  }
  return true;
}

export function applyAllFilters(resource, filters) {
  // Si no hay filtros definidos, incluir todo
  if (!filters) {
    return true;
  }
  
  const typeResult = filterByType(resource, filters);
  const sizeResult = filterBySize(resource, filters);
  const domainResult = filterByDomain(resource, filters);
  const extensionResult = filterByExtension(resource, filters);
  
  const result = typeResult && sizeResult && domainResult && extensionResult;
  
  // Log de debugging para recursos filtrados
  if (!result) {
    console.log('[FILTER]: Resource excluded:', resource.url, {
      type: typeResult,
      size: sizeResult,
      domain: domainResult,
      extension: extensionResult
    });
  }
  
  return result;
}
