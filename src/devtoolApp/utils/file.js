import prettier from 'prettier';
import htmlParser from 'prettier/parser-html';
import babelParser from 'prettier/parser-babel';
import postCssParser from 'prettier/parser-postcss';
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
            item.content = prettier.format(item.content, { parser: 'babel', plugins: [babelParser] });
            break;
          }
          case 'json': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'json', plugins: [babelParser] });
            break;
          }
          case 'html': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'html', plugins: [htmlParser, babelParser, postCssParser] });
            break;
          }
          case 'css': {
            console.log('[DEVTOOL]', item.saveAs?.name, ' will be beautified!');
            item.content = prettier.format(item.content, { parser: 'css', plugins: [postCssParser] });
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

export const getFileType = (url, mimeType = '') => {
  const extension = getFileExtension(url);
  const mime = mimeType.toLowerCase();
  
  // Imágenes
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension) ||
      mime.startsWith('image/')) {
    return 'images';
  }
  
  // CSS
  if (extension === 'css' || mime.includes('css')) {
    return 'css';
  }
  
  // JavaScript
  if (['js', 'jsx', 'ts', 'tsx', 'mjs'].includes(extension) || 
      mime.includes('javascript') || mime.includes('ecmascript')) {
    return 'javascript';
  }
  
  // Fuentes
  if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension) ||
      mime.includes('font')) {
    return 'fonts';
  }
  
  // Documentos
  if (['html', 'htm', 'xml', 'json', 'txt', 'md', 'pdf'].includes(extension) ||
      mime.includes('html') || mime.includes('xml') || mime.includes('json') || mime.includes('text')) {
    return 'documents';
  }
  
  return 'other';
};

export const applyAdvancedFilters = (resources, advancedFilters) => {
  if (!advancedFilters) return resources;
  
  return resources.filter(resource => {
    const fileSize = getFileSize(resource);
    const fileSizeKB = Math.round(fileSize / 1024);
    const fileExtension = getFileExtension(resource.url);
    const fileDomain = getFileDomain(resource.url);
    const fileType = getFileType(resource.url, resource.mimeType);
    
    // Filtrar por tipo de archivo
    if (advancedFilters.enableFileTypeFilter && advancedFilters.fileTypes) {
      const enabledTypes = Object.keys(advancedFilters.fileTypes).filter(
        type => advancedFilters.fileTypes[type]
      );
      if (enabledTypes.length > 0 && !enabledTypes.includes(fileType)) {
        return false;
      }
    }
    
    // Filtrar por tamaño
    if (advancedFilters.enableSizeFilter) {
      if (advancedFilters.minSize && fileSizeKB < advancedFilters.minSize) {
        return false;
      }
      if (advancedFilters.maxSize && fileSizeKB > advancedFilters.maxSize) {
        return false;
      }
    }
    
    // Filtrar dominios excluidos
    if (advancedFilters.excludedDomains && advancedFilters.excludedDomains.length > 0) {
      if (advancedFilters.excludedDomains.includes(fileDomain)) {
        return false;
      }
    }
    
    // Filtrar extensiones personalizadas (solo incluir estas)
    if (advancedFilters.customExtensions && advancedFilters.customExtensions.length > 0) {
      if (!advancedFilters.customExtensions.includes(fileExtension)) {
        return false;
      }
    }
    
    return true;
  });
};
