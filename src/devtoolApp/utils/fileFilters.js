// Helpers de filtrado extraídos de file.js

import { getFileType, getFileExtension } from './file';

export function filterByType(resource, filters) {
  if (filters.enableFileTypeFilter && filters.fileTypes) {
    const fileType = getFileType(resource.url, resource.mimeType);
    if (!filters.fileTypes[fileType]) {
      return false;
    }
  }
  return true;
}

export function filterBySize(resource, filters) {
  if (filters.enableSizeFilter) {
    const getFileSize = resource.getFileSize || (() => 0);
    const fileSize = getFileSize(resource);
    const fileSizeKB = Math.round(fileSize / 1024);
    const minSize = filters.minSize || 0;
    const maxSize = filters.maxSize || Infinity;
    if (fileSizeKB < minSize || fileSizeKB > maxSize) {
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
  return (
    filterByType(resource, filters) &&
    filterBySize(resource, filters) &&
    filterByDomain(resource, filters) &&
    filterByExtension(resource, filters)
  );
}
