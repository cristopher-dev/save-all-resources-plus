import prettier from 'prettier';
import * as zip from '@zip.js/zip.js';
import { applyAllFilters } from './fileFilters';
import { downloadBlobDirectly, downloadIndividualFile as downloadIndividualFileHelper } from './fileDownload';

// Función helper para generar nombre de archivo único basado en el origen
export const generateOriginFilename = (origin, originIndex = 0, totalOrigins = 1) => {
  try {
    const url = new URL(origin);
    let hostname = url.hostname.replace(/([^A-Za-z0-9.])/g, '_');
    
    // Solo agregar sufijo si hay múltiples orígenes
    if (totalOrigins > 1) {
      hostname += `_${originIndex + 1}`;
    }
    
    return hostname + '.zip';
  } catch (error) {
    console.error('[FILENAME]: Error generating filename for origin:', origin, error);
    return totalOrigins > 1 ? `resources_${originIndex + 1}.zip` : 'resources.zip';
  }
};

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

export const downloadZipFile = (toDownload, options, eachDoneCallback, callback, customFilename = null) => {
  try {
    const blobWrite = new zip.BlobWriter('application/zip');
    const zipWriter = new zip.ZipWriter(blobWrite);
    
    // Verificar que tenemos elementos para descargar
    if (!toDownload || toDownload.length === 0) {
      console.warn('[DOWNLOAD ZIP]: No items to download');
      if (callback) callback();
      return;
    }
    
    console.log('[DOWNLOAD ZIP]: Starting download of', toDownload.length, 'items');
    
    // Wrapper para el callback que asegura que se ejecute una sola vez
    let callbackExecuted = false;
    const safeCallback = () => {
      if (!callbackExecuted) {
        callbackExecuted = true;
        if (callback) {
          callback();
        }
      }
    };
    
    // Timeout de seguridad para la operación ZIP
    const zipTimeout = setTimeout(() => {
      console.error('[DOWNLOAD ZIP]: Operation timeout');
      safeCallback();
    }, 45000); // 45 segundos
    
    const wrappedCallback = () => {
      clearTimeout(zipTimeout);
      safeCallback();
    };
    
    addItemsToZipWriter(
      zipWriter,
      toDownload,
      options,
      eachDoneCallback,
      downloadCompleteZip.bind(this, zipWriter, blobWrite, wrappedCallback, customFilename)
    );
    
  } catch (error) {
    console.error('[DOWNLOAD ZIP]: Error initializing ZIP download:', error);
    if (callback) callback();
  }
};

// Create a reader of the content for zip
export const getContentRead = (item) => {
  console.log('[ZIP]: Creating content reader for:', item.url, 'Encoding:', item.encoding, 'Content type:', typeof item.content);
  
  if (item.encoding === 'base64') {
    const content = item.content || 'data:text/plain;base64,' + btoa('No Content: ' + item.url);
    if (!content.startsWith('data:')) {
      // Si no es un data URL, crear uno
      const mimeType = item.mimeType || 'application/octet-stream';
      const dataUrl = `data:${mimeType};base64,${content}`;
      return new zip.Data64URIReader(dataUrl);
    }
    return new zip.Data64URIReader(content);
  }
  if (item.content instanceof Blob) {
    console.log('[ZIP]: Using BlobReader for Blob content, size:', item.content.size);
    return new zip.BlobReader(item.content);
  }
  
  const textContent = item.content || 'No Content: ' + item.url;
  console.log('[ZIP]: Using TextReader for content, length:', textContent.length);
  return new zip.TextReader(textContent);
};

function prepareZipItemContent(item, options) {
  // Beautify aquí
  if (options?.beautifyFile && !item.encoding && !!item.content) {
    try {
      const fileExt = item.saveAs?.name?.match(/\.([0-9a-z]+)(?:[\?#]|$)/);
      switch (fileExt ? fileExt[1] : '') {
        case 'js':
          item.content = prettier.format(item.content, { parser: 'babel' });
          break;
        case 'json':
          item.content = prettier.format(item.content, { parser: 'json' });
          break;
        case 'html':
          item.content = prettier.format(item.content, { parser: 'html' });
          break;
        case 'css':
          item.content = prettier.format(item.content, { parser: 'css' });
          break;
      }
    } catch (err) {
      // No romper si falla el formateo
    }
  }
  // Validar base64
  if (item.encoding === 'base64') {
    try {
      atob(item.content);
    } catch (err) {
      try {
        item.content = btoa(item.content);
      } catch (err) {
        item.encoding = null;
      }
    }
  }
  return getContentRead(item);
}

export const addItemsToZipWriter = (zipWriter, items, options, eachDoneCallback, callback) => {
  const item = items[0];
  const rest = items.slice(1);
  if (item) {
    try {
      const resolvedContent = prepareZipItemContent(item, options);
      const isNoContent = !item.content;
      const ignoreNoContentFile = !!options?.ignoreNoContentFile;
      if (isNoContent && ignoreNoContentFile) {
        eachDoneCallback(item, true);
        addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
      } else {
        const hasSize = resolvedContent.size > 0 || resolvedContent['blobReader']?.size > 0;
        if (hasSize) {
          // Agregar timeout específico para cada elemento
          const itemTimeout = setTimeout(() => {
            console.error('[ZIP ITEM]: Timeout adding item:', item.url);
            eachDoneCallback(item, false);
            addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
          }, 10000); // 10 segundos por item
          
          zipWriter.add(item.saveAs.path, resolvedContent).then(() => {
            clearTimeout(itemTimeout);
            eachDoneCallback(item, true);
            addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
          }).catch((error) => {
            clearTimeout(itemTimeout);
            console.error('[ZIP ITEM]: Error adding item to zip:', item.url, error);
            eachDoneCallback(item, false);
            addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
          });
        } else {
          console.warn('[ZIP ITEM]: Item has no size, skipping:', item.url);
          eachDoneCallback(item, false);
          addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
        }
      }
    } catch (error) {
      console.error('[ZIP ITEM]: Error preparing item content:', item.url, error);
      eachDoneCallback(item, false);
      addItemsToZipWriter(zipWriter, rest, options, eachDoneCallback, callback);
    }
  } else {
    callback();
  }
  return rest;
};

export const downloadCompleteZip = (zipWriter, blobWriter, callback, customFilename = null) => {
  zipWriter.close();
  blobWriter.getData().then((blob) => {
    // Si se proporciona un nombre personalizado, usarlo directamente
    if (customFilename) {
      console.log('[DOWNLOAD]: Using custom filename:', customFilename);
      downloadBlobDirectly(blob, customFilename);
      callback();
      return;
    }
    
    // Verificar si el contexto de DevTools está disponible
    try {
      if (chrome?.devtools?.inspectedWindow?.tabId && chrome?.tabs?.get) {
        chrome.tabs.get(chrome.devtools.inspectedWindow.tabId, function (tab) {
          if (chrome.runtime.lastError) {
            console.error('[DOWNLOAD]: Error getting tab info:', chrome.runtime.lastError.message);
            // Usar nombre genérico si hay error
            downloadBlobDirectly(blob, 'resources.zip');
          } else {
            try {
              let url = new URL(tab.url);
              let filename = url.hostname ? url.hostname.replace(/([^A-Za-z0-9.])/g, '_') : 'resources';
              downloadBlobDirectly(blob, filename + '.zip');
            } catch (urlError) {
              console.error('[DOWNLOAD]: Error parsing URL:', urlError);
              downloadBlobDirectly(blob, 'resources.zip');
            }
          }
          callback();
        });
      } else {
        console.warn('[DOWNLOAD]: DevTools context not available, using fallback download');
        downloadBlobDirectly(blob, 'resources.zip');
        callback();
      }
    } catch (error) {
      console.error('[DOWNLOAD]: Error in downloadCompleteZip:', error);
      downloadBlobDirectly(blob, 'resources.zip');
      callback();
    }
  }).catch((error) => {
    console.error('[DOWNLOAD]: Error getting blob data:', error);
    callback();
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

// Reemplazar lógica de filtrado en applyAdvancedFilters
export const applyAdvancedFilters = (resources, filters) => {
  if (!filters) return resources;
  return resources.filter(resource => applyAllFilters(resource, filters));
};

// Función para descargar un archivo individual
export const downloadIndividualFile = downloadIndividualFileHelper;

// Función para descargar múltiples archivos individuales
export const downloadMultipleIndividualFiles = async (resources, options = {}, progressCallback = null) => {
  const results = [];
  const total = resources.length;
  
  for (let i = 0; i < resources.length; i++) {
    const resource = resources[i];
    const result = await downloadIndividualFile(resource, options);
    results.push(result);
    
    if (progressCallback) {
      progressCallback({
        current: i + 1,
        total,
        percentage: Math.round((i + 1) / total * 100),
        resource,
        result
      });
    }
    
    // Pausa entre descargas para evitar bloqueos del navegador
    if (i < resources.length - 1) {
      await new Promise(resolve => setTimeout(resolve, options.delay || 200));
    }
  }
  
  return results;
};

// Función para agrupar recursos por tipo
export const groupResourcesByType = (resources) => {
  const groups = {};
  
  resources.forEach(resource => {
    const type = getFileType(resource.url, resource.mimeType);
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(resource);
  });
  
  return groups;
};

// Función para crear ZIP por grupo
export const downloadResourcesByGroups = async (resources, options = {}, progressCallback = null) => {
  const groups = groupResourcesByType(resources);
  const groupKeys = Object.keys(groups);
  const results = [];
  
  for (let i = 0; i < groupKeys.length; i++) {
    const groupType = groupKeys[i];
    const groupResources = groups[groupType];
    
    if (groupResources.length === 0) continue;
    
    try {
      const filteredResources = applyAdvancedFilters(groupResources, options.advancedFilters);
      const toDownload = resolveDuplicatedResources(filteredResources);
      
      if (toDownload.length > 0) {
        await new Promise((resolve) => {
          const blobWrite = new zip.BlobWriter('application/zip');
          const zipWriter = new zip.ZipWriter(blobWrite);
          
          addItemsToZipWriter(
            zipWriter,
            toDownload,
            options,
            (item, isDone) => {
              // Callback para cada archivo procesado
            },
            () => {
              zipWriter.close();
              blobWrite.getData().then((blob) => {
                // Descargar el ZIP del grupo
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${groupType}-resources.zip`;
                a.click();
                URL.revokeObjectURL(url);
                
                results.push({
                  group: groupType,
                  count: toDownload.length,
                  success: true
                });
                
                resolve();
              });
            }
          );
        });
      }
    } catch (error) {
      console.error(`Error creating ZIP for group ${groupType}:`, error);
      results.push({
        group: groupType,
        count: groupResources.length,
        success: false,
        error: error.message
      });
    }
    
    if (progressCallback) {
      progressCallback({
        current: i + 1,
        total: groupKeys.length,
        percentage: Math.round((i + 1) / groupKeys.length * 100),
        group: groupType,
        results
      });
    }
    
    // Pausa entre grupos
    if (i < groupKeys.length - 1) {
      await new Promise(resolve => setTimeout(resolve, options.delay || 500));
    }
  }
  
  return results;
};

// Función para exportar recursos con diferentes opciones
export const exportResources = async (resources, exportOptions = {}, progressCallback = null) => {
  const {
    mode = 'global', // 'global', 'individual', 'groups'
    format = 'zip',
    filters = {},
    beautifyFile = false,
    ignoreNoContentFile = true,
    separateByDomain = false,
    delay = 200
  } = exportOptions;
  
  const filteredResources = applyAdvancedFilters(resources, filters);
  
  switch (mode) {
    case 'individual':
      return await downloadMultipleIndividualFiles(
        filteredResources, 
        { delay, beautifyFile, ignoreNoContentFile }, 
        progressCallback
      );
      
    case 'groups':
      return await downloadResourcesByGroups(
        filteredResources,
        { delay, beautifyFile, ignoreNoContentFile, advancedFilters: filters },
        progressCallback
      );
      
    case 'global':
    default:
      return new Promise((resolve) => {
        const toDownload = resolveDuplicatedResources(filteredResources);
        downloadZipFile(
          toDownload,
          { ignoreNoContentFile, beautifyFile },
          (item, isDone) => {
            if (progressCallback) {
              const processed = toDownload.length - toDownload.indexOf(item);
              progressCallback({
                current: processed,
                total: toDownload.length,
                percentage: Math.round(processed / toDownload.length * 100),
                item,
                isDone
              });
            }
          },
          () => {
            resolve({ success: true, count: toDownload.length });
          }
        );
      });
  }
};
