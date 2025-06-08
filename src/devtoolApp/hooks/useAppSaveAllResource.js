import { useCallback, useEffect, useRef } from 'react';
import * as uiActions from '../store/ui';
import { downloadZipFile, resolveDuplicatedResources, applyAdvancedFilters, generateOriginFilename } from '../utils/file';
import { logResourceByUrl } from '../utils/resource';
import { resetNetworkResource } from '../store/networkResource';
import { resetStaticResource } from '../store/staticResource';
import useStore from '../store';
import { waitForTabLoad, filterResourcesForDownload } from './useAppSaveAllResourceHelpers';

export const useAppSaveAllResource = () => {
  const { state, dispatch } = useStore();
  const { networkResource, staticResource } = state;
  const networkResourceRef = useRef(networkResource);
  const staticResourceRef = useRef(staticResource);
  const {
    downloadList,
    option: { ignoreNoContentFile, beautifyFile, advancedFilters },
    ui: { tab, selectedResources = {} },
  } = state;

  const handleOnSave = useCallback(async () => {
    // Verificar que el contexto de DevTools esté disponible antes de proceder
    if (!chrome?.devtools?.inspectedWindow?.tabId) {
      console.error('[SAVE ALL]: DevTools context not available - tabId missing');
      dispatch(uiActions.setStatus('Error: Contexto de DevTools no disponible'));
      return;
    }
    if (!chrome?.tabs?.update) {
      console.error('[SAVE ALL]: Chrome tabs API not available');
      dispatch(uiActions.setStatus('Error: API de pestañas no disponible'));
      return;
    }

    // Log de debug para verificar recursos disponibles
    console.log('[SAVE ALL]: Available resources before download:', {
      networkResources: networkResource?.length || 0,
      staticResources: staticResource?.length || 0,
      downloadListLength: downloadList.length,
      selectedResources: Object.keys(selectedResources).length,
    });

    console.log('[SAVE ALL]: Starting save operation with tabId:', chrome.devtools.inspectedWindow.tabId);
    dispatch(uiActions.setIsSaving(true)); // Timeout de seguridad para resetear isSaving en caso de que algo falle
    const safetyTimeout = setTimeout(() => {
      console.warn('[SAVE ALL]: Safety timeout reached, resetting isSaving state');
      dispatch(uiActions.setIsSaving(false));
      dispatch(uiActions.setStatus('Operación de guardado interrumpida por timeout'));
    }, 60000); // 60 segundos

    try {
      const hasSelectedItems = Object.values(selectedResources).some((isSelected) => isSelected);

      if (hasSelectedItems) {
        // Cuando hay recursos seleccionados, descargar solo los seleccionados UNA SOLA VEZ
        console.log('[SAVE ALL]: Downloading selected resources only');
        dispatch(uiActions.setSavingIndex(0));

        await new Promise(async (resolve, reject) => {
          let downloadCompleted = false;

          const downloadTimeout = setTimeout(() => {
            if (!downloadCompleted) {
              console.error('[SAVE ALL]: Download timeout for selected resources');
              dispatch(uiActions.setStatus(`Timeout en descarga de recursos seleccionados`));
              resolve();
            }
          }, 30000);

          try {
            const allResources = [...(networkResource || []), ...(staticResource || [])];

            const toDownload = filterResourcesForDownload(
              allResources,
              advancedFilters,
              resolveDuplicatedResources,
              selectedResources,
              hasSelectedItems
            );

            console.log('[SAVE ALL]: Selected resources to download:', {
              allResourcesCount: allResources.length,
              toDownloadCount: toDownload.length,
              selectedResourcesUrls: toDownload.map((r) => r.url),
            });

            if (toDownload.length) {
              downloadZipFile(
                toDownload,
                { ignoreNoContentFile, beautifyFile },
                (item, isDone) => {
                  dispatch(uiActions.setStatus(`Compressed: ${item.url} Processed: ${isDone}`));
                },
                () => {
                  downloadCompleted = true;
                  clearTimeout(downloadTimeout);
                  toDownload.forEach((resource) => {
                    logResourceByUrl(dispatch, resource.url, [resource]);
                  });
                  resolve();
                }
              );
            } else {
              downloadCompleted = true;
              clearTimeout(downloadTimeout);
              resolve();
            }
          } catch (error) {
            downloadCompleted = true;
            clearTimeout(downloadTimeout);
            console.error('[SAVE ALL]: Error in download process:', error);
            dispatch(uiActions.setStatus('Error en descarga de recursos: ' + error.message));
            resolve();
          }
        });      } else {
        // Cuando NO hay recursos seleccionados, descargar todos los recursos juntos
        console.log('[SAVE ALL]: Downloading all resources in a single ZIP');

        await new Promise(async (resolve, reject) => {
          let downloadCompleted = false;

          const downloadTimeout = setTimeout(() => {
            if (!downloadCompleted) {
              console.error('[SAVE ALL]: Download timeout for all resources');
              dispatch(uiActions.setStatus(`Timeout en descarga de todos los recursos`));
              resolve();
            }
          }, 30000);

          try {
            const allResources = [...(networkResource || []), ...(staticResource || [])];

            const toDownload = filterResourcesForDownload(
              allResources,
              advancedFilters,
              resolveDuplicatedResources,
              selectedResources,
              hasSelectedItems
            );

            if (toDownload.length > 0) {
              downloadZipFile(
                toDownload,
                { ignoreNoContentFile, beautifyFile },
                (item, isDone) => {
                  dispatch(uiActions.setStatus(`Compressed: ${item.url} Processed: ${isDone}`));
                },
                () => {
                  downloadCompleted = true;
                  clearTimeout(downloadTimeout);
                  logResourceByUrl(dispatch, tab?.url || 'all-resources', toDownload);
                  resolve();
                }
              );
            } else {
              downloadCompleted = true;
              clearTimeout(downloadTimeout);
              resolve();
            }
          } catch (error) {
            downloadCompleted = true;
            clearTimeout(downloadTimeout);
            console.error('[SAVE ALL]: Error in download process:', error);
            dispatch(uiActions.setStatus('Error en descarga de recursos: ' + error.message));
            resolve();
          }
        });

        /* CÓDIGO ANTERIOR COMENTADO - Descarga por orígenes separados
        // Cuando NO hay recursos seleccionados, descargar todos por sitio/URL
        console.log('[SAVE ALL]: Downloading all resources by site');
          // Pre-analizar downloadList para obtener orígenes únicos y sus representantes
        const uniqueOriginsMap = new Map();
        downloadList.forEach((item, index) => {
          try {
            const origin = new URL(item.url).origin;
            if (!uniqueOriginsMap.has(origin)) {
              uniqueOriginsMap.set(origin, { item, index });
            }
          } catch (error) {
            console.warn('[SAVE ALL]: Error parsing URL in pre-analysis:', item.url);
          }
        });
        
        const uniqueOrigins = Array.from(uniqueOriginsMap.entries());
        console.log('[SAVE ALL]: Found', uniqueOrigins.length, 'unique origins to process from', downloadList.length, 'items');
        
        // Conjunto para rastrear orígenes ya procesados
        const processedOrigins = new Set();
        
        for (let originIndex = 0; originIndex < uniqueOrigins.length; originIndex++) {
          const [downloadItemOrigin, { item: downloadItem, index: originalIndex }] = uniqueOrigins[originIndex];
          
          // Verificar si este origen ya fue procesado
          if (processedOrigins.has(downloadItemOrigin)) {
            console.log('[SAVE ALL]: Origen ya procesado, saltando:', downloadItemOrigin);
            continue;
          }
          
          console.log('[SAVE ALL]: Processing origin', originIndex + 1, 'of', uniqueOrigins.length, ':', downloadItemOrigin);
          dispatch(uiActions.setSavingIndex(originalIndex));
          
          // Marcar este origen como procesado
          processedOrigins.add(downloadItemOrigin);
          
          await new Promise(async (resolve, reject) => {
            let loaded = true;
            let downloadCompleted = false;
            
            const downloadTimeout = setTimeout(() => {
              if (!downloadCompleted) {
                console.error('[SAVE ALL]: Download timeout for item:', downloadItem.url);
                dispatch(uiActions.setStatus(`Timeout en descarga: ${downloadItem.url}`));
                resolve();
              }
            }, 30000);
              try {
              if (originalIndex > 0 || tab?.url !== downloadItem.url) {
                loaded = await waitForTabLoad(chrome.devtools.inspectedWindow.tabId, downloadItem, dispatch, uiActions, tab);
              }
              
              const allResources = [
                ...(networkResource || []),
                ...(staticResource || []),
              ];
                // Filtrar recursos solo para la URL específica del downloadItem
              const resourcesForThisUrl = allResources.filter(resource => {
                try {
                  const resourceOrigin = new URL(resource.url).origin;
                  return resourceOrigin === downloadItemOrigin;
                } catch (error) {
                  console.warn('[SAVE ALL]: Error comparing URLs:', resource.url, downloadItem.url, error);
                  return false;
                }
              });
              
              const toDownload = filterResourcesForDownload(
                resourcesForThisUrl,
                advancedFilters,
                resolveDuplicatedResources,
                selectedResources,
                hasSelectedItems
              );              console.log('[SAVE ALL]: Resources to download for site:', {
                allResourcesCount: allResources.length,
                resourcesForThisUrlCount: resourcesForThisUrl.length,
                toDownloadCount: toDownload.length,
                downloadItemUrl: downloadItem.url,
                downloadItemOrigin: downloadItemOrigin,
                originIndex: originIndex + 1,
                totalOrigins: uniqueOrigins.length
              });
                // Solo proceder si hay recursos para descargar específicos de este origen
              if (loaded && toDownload.length > 0) {
                // Generar nombre único para este origen
                const customFilename = generateOriginFilename(downloadItemOrigin, originIndex, uniqueOrigins.length);
                console.log('[SAVE ALL]: Generated filename for origin:', downloadItemOrigin, '->', customFilename);
                
                downloadZipFile(
                  toDownload,
                  { ignoreNoContentFile, beautifyFile },
                  (item, isDone) => {
                    dispatch(uiActions.setStatus(`Compressed: ${item.url} Processed: ${isDone}`));
                  },
                  () => {
                    downloadCompleted = true;
                    clearTimeout(downloadTimeout);
                    logResourceByUrl(dispatch, downloadItem.url, toDownload);
                    resolve();
                  },
                  customFilename // Pasar el nombre personalizado
                );
              } else {
                downloadCompleted = true;
                clearTimeout(downloadTimeout);
                resolve();
              }            } catch (error) {
              downloadCompleted = true;
              clearTimeout(downloadTimeout);
              console.error('[SAVE ALL]: Error in download process:', error);
              dispatch(uiActions.setStatus('Error en descarga de recursos: ' + error.message));
              resolve();
            }
          });
            // Pequeña pausa entre procesamiento de orígenes para evitar saturación
          await new Promise(res => setTimeout(res, 100));
        }
        
        console.log('[SAVE ALL]: Finished processing all unique origins. Total processed:', processedOrigins.size);
        */
      }

      clearTimeout(safetyTimeout);
      dispatch(uiActions.setStatus('Listo para escanear...'));
      dispatch(uiActions.setIsSaving(false));
      dispatch(uiActions.setAnalysisCompleted());
    } catch (error) {
      clearTimeout(safetyTimeout);
      console.error('[SAVE ALL]: Critical error during save operation:', error);
      dispatch(uiActions.setStatus('Error durante el guardado: ' + error.message));
      dispatch(uiActions.setIsSaving(false));
    }
  }, [
    downloadList,
    advancedFilters,
    ignoreNoContentFile,
    beautifyFile,
    dispatch,
    tab,
    selectedResources,
    networkResource,
    staticResource,
  ]);

  useEffect(() => {
    networkResourceRef.current = networkResource;
  }, [networkResource]);

  useEffect(() => {
    staticResourceRef.current = staticResource;
  }, [staticResource]);

  return { handleOnSave };
};
