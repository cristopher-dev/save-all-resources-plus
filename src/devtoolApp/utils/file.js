import prettier from 'prettier';
import * as zip from '@zip.js/zip.js';

export const resolveDuplicatedResources = (resourceList = []) => {
  const resolvedListByKey = {};
  const result = [];
  const resourceListUniqByUrl = Object.values(
    resourceList.reduce(
      (list, res) => ({
        ...list,
        ...(!list[res.url] || !list[res.url].content || res.content
          ? {
              [res.url]: res,
            }
          : {}),
      }),
      {}
    )
  );
  resourceListUniqByUrl
    .filter((r) => r && r.saveAs && r.saveAs.path && r.saveAs.name)
    .sort((rA, rB) => rA.saveAs.path.localeCompare(rB.saveAs.path))
    .forEach((r) => {
      resolvedListByKey[r.saveAs.path] = (resolvedListByKey[r.saveAs.path] || []).concat([r]);
    });
  Object.values(resolvedListByKey).forEach((rGroup) => {
    result.push(
      ...(rGroup.length < 2
        ? rGroup
        : rGroup.map((r, rIndex) =>
            rIndex === 0
              ? r
              : {
                  ...r,
                  saveAs: {
                    ...r.saveAs,
                    name: r.saveAs.name.replace(/(\.)(?!.*\.)/g, ` (${rIndex}).`),
                    path: r.saveAs.path.replace(/(\.)(?!.*\.)/g, ` (${rIndex}).`),
                  },
                }
          ))
    );
  });
  return result;
};

export const downloadZipFile = (toDownload, options, eachDoneCallback, callback) => {
  const blobWrite = new zip.BlobWriter('application/zip');
  const zipWriter = new zip.ZipWriter(blobWrite);
  addItemsToZipWriter(
    zipWriter,
    toDownload,
    options,
    eachDoneCallback,
    downloadCompleteZip.bind(this, zipWriter, blobWrite, callback)
  );
};

// Create a reader of the content for zip
export const getContentRead = (item) => {
  if (item.encoding === 'base64') {
    return new zip.Data64URIReader(item.content || 'No Content: ' + item.url);
  }
  if (item.content instanceof Blob) {
    return new zip.BlobReader(item.content);
  }
  return new zip.TextReader(item.content || 'No Content: ' + item.url);
};

export const addItemsToZipWriter = (zipWriter, items, options, eachDoneCallback, callback) => {
  const item = items[0];
  const rest = items.slice(1);

  // if item exist so add it to zip
  if (item) {
    // Beautify here
    if (options?.beautifyFile && !item.encoding && !!item.content) {
      try {
        const fileExt = item.saveAs?.name?.match(/\.([0-9a-z]+)(?:[\?#]|$)/);
        switch (fileExt ? fileExt[1] : '') {
          case 'js': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'babel' });
            break;
          }
          case 'json': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'json' });
            break;
          }
          case 'html': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'html' });
            break;
          }
          case 'css': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'css' });
            break;
          }
        }
      } catch (err) {
        console.log('[DEVTOOL]', 'Cannot format file', item, err);
      }
    }

    // Check whether base64 encoding is valid
    if (item.encoding === 'base64') {
      // Try to decode first
      try {
        atob(item.content);
      } catch (err) {
        console.log('[DEVTOOL]', item.url, ' is not base64 encoding, try to encode to base64.');
        try {
          item.content = btoa(item.content);
        } catch (err) {
          console.log('[DEVTOOL]', item.url, ' failed to encode to base64, fallback to text.');
          item.encoding = null;
        }
      }
    }

    // Create a reader of the content for zip
    const resolvedContent = getContentRead(item);

    // Item has no content
    const isNoContent = !item.content;
    const ignoreNoContentFile = !!options?.ignoreNoContentFile;
    if (isNoContent && ignoreNoContentFile) {
      // Exclude file as no content
      console.log('[DEVTOOL]', 'EXCLUDED: ', item.url);
      eachDoneCallback(item, true);
      // To the next item
      addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
    } else {
      // Make sure the file has some byte otherwise no import to avoid corrupted zip
      if (resolvedContent.size > 0 || resolvedContent['blobReader']?.size > 0) {
        zipWriter.add(item.saveAs.path, resolvedContent).finally(() => {
          eachDoneCallback(item, true);
          addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
        });
      } else {
        // If no size, exclude the item
        console.log('[DEVTOOL]', 'EXCLUDED: ', item.url);
        eachDoneCallback(item, false);
        // To the next item
        addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
      }
    }
  } else {
    // Callback when all done
    callback();
  }
  return rest;
};

export const downloadCompleteZip = (zipWriter, blobWriter, callback) => {
  zipWriter.close();
  blobWriter.getData().then((blob) => {
    chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, function (tab) {
      let url = new URL(tab.url);
      let filename = url.hostname ? url.hostname.replace(/([^A-Za-z0-9.])/g, '_') : 'all';
      let a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename + '.zip';
      a.click();
      callback();
    });
  });
};

// Funciones de filtrado avanzado
export const getFileSize = (item) => {
  if (!item.content) return 0;
  
  if (item.content instanceof Blob) {
    return item.content.size;
  }
  
  if (item.encoding === 'base64') {
    try {
      const decoded = atob(item.content);
      return new Blob([decoded]).size;
    } catch (e) {
      return item.content.length;
    }
  }
  
  return new Blob([item.content]).size;
};

export const getFileExtension = (url) => {
  if (!url) return '';
  const match = url.match(/\.([a-zA-Z0-9]+)(?:\?|#|$)/);
  return match ? match[1].toLowerCase() : '';
};

export const getFileDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return '';
  }
};

// Función para obtener el tipo de archivo basado en URL y MIME type
export const getFileType = (url, mimeType) => {
  const extension = getFileExtension(url);
  
  if (mimeType) {
    if (mimeType.startsWith('image/')) return 'images';
    if (mimeType.includes('css')) return 'css';
    if (mimeType.includes('javascript')) return 'javascript';
    if (mimeType.includes('font')) return 'fonts';
    if (mimeType.includes('text/') || mimeType.includes('application/json')) return 'documents';
  }
  
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico', 'bmp'];
  const cssExts = ['css'];
  const jsExts = ['js', 'mjs', 'jsx', 'ts', 'tsx'];
  const fontExts = ['woff', 'woff2', 'ttf', 'otf', 'eot'];
  const docExts = ['html', 'htm', 'xml', 'json', 'txt', 'md'];
  
  if (imageExts.includes(extension)) return 'images';
  if (cssExts.includes(extension)) return 'css';
  if (jsExts.includes(extension)) return 'javascript';
  if (fontExts.includes(extension)) return 'fonts';
  if (docExts.includes(extension)) return 'documents';
  
  return 'other';
};

// Función para aplicar filtros avanzados
export const applyAdvancedFilters = (resources, filters) => {
  if (!filters) return resources;
  
  return resources.filter(resource => {
    const fileType = getFileType(resource.url, resource.mimeType);
    const fileSize = getFileSize(resource);
    const fileSizeKB = Math.round(fileSize / 1024);
    const domain = new URL(resource.url).hostname;
    const extension = getFileExtension(resource.url);
    
    // Filtro por tipo de archivo
    if (filters.enableFileTypeFilter && filters.fileTypes) {
      if (!filters.fileTypes[fileType]) {
        return false;
      }
    }
    
    // Filtro por tamaño
    if (filters.enableSizeFilter) {
      const minSize = filters.minSize || 0;
      const maxSize = filters.maxSize || Infinity;
      if (fileSizeKB < minSize || fileSizeKB > maxSize) {
        return false;
      }
    }
    
    // Filtro por dominios excluidos
    if (filters.excludedDomains && filters.excludedDomains.length > 0) {
      if (filters.excludedDomains.some(excludedDomain => domain.includes(excludedDomain))) {
        return false;
      }
    }
    
    // Filtro por extensiones personalizadas
    if (filters.customExtensions && filters.customExtensions.length > 0) {
      if (!filters.customExtensions.includes(extension)) {
        return false;
      }
    }
    
    return true;
  });
};
