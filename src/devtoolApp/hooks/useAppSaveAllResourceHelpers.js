// Helpers para useAppSaveAllResource

export function waitForTabLoad(tabId, downloadItem, dispatch, uiActions, tab) {
  return new Promise((resolve) => {
    try {
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
      chrome.tabs.onUpdated.addListener(tabChangeHandler);
      setTimeout(function () {
        dispatch(uiActions.setTab({ url: downloadItem.url }));
        chrome.tabs.update(tabId, { url: downloadItem.url });
      }, 500);
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
