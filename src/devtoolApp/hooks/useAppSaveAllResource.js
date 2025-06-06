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
    ui: { tab },
  } = state;

  // Se espera que selectedResources venga del estado global o como prop
  const selectedResources = state.ui?.selectedResources || {}; 

  const handleOnSave = useCallback(async () => {
    // Verificar que el contexto de DevTools esté disponible antes de proceder
    if (!chrome?.devtools?.inspectedWindow?.tabId || !chrome?.tabs?.update) {
      console.error('[SAVE ALL]: DevTools context not available, cannot proceed with save operation');
      return;
    }

    dispatch(uiActions.setIsSaving(true));
    for (let i = 0; i < downloadList.length; i++) {
      const downloadItem = downloadList[i];

      // Si hay recursos seleccionados y el item actual no está seleccionado, saltarlo
      const hasSelectedItems = Object.values(selectedResources).some(isSelected => isSelected);
      if (hasSelectedItems && !selectedResources[downloadItem.url]) {
        continue;
      }

      dispatch(uiActions.setSavingIndex(i));
      await new Promise(async (resolve) => {
        let loaded = true;
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

        // Filtrar `toDownload` basado en `selectedResources` si hay selecciones
        if (hasSelectedItems) {
          toDownload = toDownload.filter(resource => selectedResources[resource.url]);
        }

        console.log(toDownload.filter(t => typeof t?.content !== 'string' && !!t?.content?.then));
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
        }
      });
    }
    dispatch(uiActions.setStatus(UI_INITIAL_STATE.status));
    dispatch(uiActions.setIsSaving(false));
    dispatch(uiActions.setAnalysisCompleted()); // Indicar que el análisis (y guardado) ha terminado
  }, [state, dispatch, tab, selectedResources]);

  useEffect(() => {
    networkResourceRef.current = networkResource;
  }, [networkResource]);

  useEffect(() => {
    staticResourceRef.current = staticResource;
  }, [staticResource]);

  return { handleOnSave };
};
