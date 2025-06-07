import { useCallback, useEffect, useRef } from 'react';
import * as uiActions from '../store/ui';
import { downloadZipFile, resolveDuplicatedResources, applyAdvancedFilters } from '../utils/file';
import { logResourceByUrl } from '../utils/resource';
import { resetNetworkResource } from '../store/networkResource';
import { resetStaticResource } from '../store/staticResource';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../store/ui';
import useStore from '../store';

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

    console.log('[SAVE ALL]: Starting save operation with tabId:', chrome.devtools.inspectedWindow.tabId);
    dispatch(uiActions.setIsSaving(true));
    
    try {
    for (let i = 0; i < downloadList.length; i++) {
      const downloadItem = downloadList[i];
      const hasSelectedItems = Object.values(selectedResources).some(isSelected => isSelected);
      if (hasSelectedItems && !selectedResources[downloadItem.url]) {
        console.log(`[SAVE ALL]: Skipping ${downloadItem.url} - not selected`);
        continue;
      }

      dispatch(uiActions.setSavingIndex(i));
      await new Promise(async (resolve) => {
        let loaded = true;
        try {
          if (i > 0 || tab?.url !== downloadItem.url) {
            loaded = await new Promise((r) => {
              const tabChangeHandler = (tabId, changeInfo) => {
                try {
                  if (tabId !== chrome.devtools.inspectedWindow.tabId || !changeInfo || !changeInfo.status) {
                    return;
                  }
                  if (changeInfo.status === 'loading') {
                    return;
                  }
                  if (changeInfo.status === 'complete') {
                    setTimeout(() => {
                      r(true);
                    }, 2000);
                  } else {
                    r(false);
                  }
                  chrome.tabs.onUpdated.removeListener(tabChangeHandler);
                } catch (error) {
                  console.error('[SAVE ALL]: Error in tab change handler:', error);
                  dispatch(uiActions.setStatus('Error en cambio de pestaña: ' + error.message));
                  r(false);
                  chrome.tabs.onUpdated.removeListener(tabChangeHandler);
                }
              };
              try {
                chrome.tabs.onUpdated.addListener(tabChangeHandler);
                setTimeout(function () {
                  dispatch(uiActions.setTab({ url: downloadItem.url }));
                  chrome.tabs.update(chrome.devtools.inspectedWindow.tabId, { url: downloadItem.url });
                }, 500);
              } catch (error) {
                console.error('[SAVE ALL]: Error setting up tab change:', error);
                dispatch(uiActions.setStatus('Error preparando cambio de pestaña: ' + error.message));
                r(false);
              }
            });
          }
          const allResources = [
            ...(networkResourceRef.current || []),
            ...(staticResourceRef.current || []),
          ];
          const filteredResources = applyAdvancedFilters(allResources, advancedFilters);
          let toDownload = resolveDuplicatedResources(filteredResources);
          if (hasSelectedItems) {
            toDownload = toDownload.filter(resource => selectedResources[resource.url]);
            console.log(`[SAVE ALL]: Filtered resources for ${downloadItem.url}:`, toDownload.length);
          } else {
            console.log(`[SAVE ALL]: No specific selections, downloading all resources for ${downloadItem.url}:`, toDownload.length);
          }
          if (loaded && toDownload.length) {
            downloadZipFile(
              toDownload,
              { ignoreNoContentFile, beautifyFile },
              (item, isDone) => {
                dispatch(uiActions.setStatus(`Compressed: ${item.url} Processed: ${isDone}`));
              },
              () => {
                logResourceByUrl(dispatch, downloadItem.url, toDownload);
                if (i + 1 !== downloadList.length) {
                  dispatch(resetNetworkResource());
                  dispatch(resetStaticResource());
                }
                resolve();
              }
            );
          } else {
            resolve();
          }
        } catch (error) {
          console.error('[SAVE ALL]: Error en descarga de recursos:', error);
          dispatch(uiActions.setStatus('Error en descarga de recursos: ' + error.message));
          resolve();
        }
      });
      // Pausa para evitar bloqueo de UI en descargas masivas
      await new Promise(res => setTimeout(res, 50));
    }
    dispatch(uiActions.setStatus(UI_INITIAL_STATE.status));
    dispatch(uiActions.setIsSaving(false));
    dispatch(uiActions.setAnalysisCompleted());
    } catch (error) {
      console.error('[SAVE ALL]: Error during save operation:', error);
      dispatch(uiActions.setStatus('Error durante el guardado: ' + error.message));
      dispatch(uiActions.setIsSaving(false));
    }
  }, [state, dispatch, tab, selectedResources]);

  useEffect(() => {
    networkResourceRef.current = networkResource;
  }, [networkResource]);

  useEffect(() => {
    staticResourceRef.current = staticResource;
  }, [staticResource]);

  return { handleOnSave };
};
