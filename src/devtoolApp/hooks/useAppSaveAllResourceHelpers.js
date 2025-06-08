// Helpers para useAppSaveAllResource

import { applyAdvancedFilters } from '../utils/file';

export function waitForTabLoad(tabId, downloadItem, dispatch, uiActions, tab) {
  return new Promise((resolve) => {
    try {
      // Verificar si la URL ya es la misma que la actual para evitar navegación innecesaria
      if (tab && tab.url === downloadItem.url) {
        console.log('[WAIT_FOR_TAB_LOAD]: URL ya coincide, no es necesario navegar:', downloadItem.url);
        dispatch(uiActions.setTab({ url: downloadItem.url }));
        setTimeout(() => resolve(true), 100); // Resolver rápidamente sin navegación
        return;
      }

      const tabChangeHandler = (changedTabId, changeInfo) => {
        try {
          if (changedTabId !== tabId || !changeInfo || !changeInfo.status) return;
          if (changeInfo.status === 'loading') return;
          if (changeInfo.status === 'complete') {
            setTimeout(() => resolve(true), 2000);
          } else {
            resolve(false);
          }
          chrome.tabs.onUpdated.removeListener(tabChangeHandler);
        } catch (error) {
          dispatch(uiActions.setStatus('Error en cambio de pestaña: ' + error.message));
          resolve(false);
          chrome.tabs.onUpdated.removeListener(tabChangeHandler);
        }
      };
      
      // Solo navegar si es absolutamente necesario
      console.log('[WAIT_FOR_TAB_LOAD]: Navegación evitada - manteniendo en el sitio actual');
      dispatch(uiActions.setTab({ url: downloadItem.url }));
      // Comentado para evitar cambio de URL: chrome.tabs.update(tabId, { url: downloadItem.url });
      
      // Resolver inmediatamente sin esperar navegación
      setTimeout(() => resolve(true), 100);
      
    } catch (error) {
      dispatch(uiActions.setStatus('Error preparando cambio de pestaña: ' + error.message));
      resolve(false);
    }
  });
}

export function filterResourcesForDownload(allResources, advancedFilters, resolveDuplicatedResources, selectedResources, hasSelectedItems) {
  const filteredResources = applyAdvancedFilters(allResources, advancedFilters);
  let toDownload = resolveDuplicatedResources(filteredResources);
  if (hasSelectedItems) {
    toDownload = toDownload.filter(resource => selectedResources[resource.url]);
  }
  return toDownload;
}
