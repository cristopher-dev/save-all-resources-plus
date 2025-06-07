// Helper para inicialización y reintentos de grabación de recursos estáticos

export function initializeStaticResourceRecording(dispatch, processStaticResourceToStore, staticResourceActions) {
  try {
    chrome.devtools.inspectedWindow.getResources((resources) => {
      if (resources && resources.length) {
        resources.forEach((res) => {
          processStaticResourceToStore(dispatch, res);
        });
      }
    });
    chrome.devtools.inspectedWindow.onResourceAdded.addListener((res) => {
      processStaticResourceToStore(dispatch, res);
    });
    chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener((res) => {
      processStaticResourceToStore(dispatch, res);
    });
  } catch (error) {
    console.error('[STATIC RESOURCE]: Error initializing static resource recording:', error);
  }
}

export function checkDevtoolsAvailability() {
  try {
    return (
      typeof chrome !== 'undefined' &&
      chrome.devtools &&
      chrome.devtools.inspectedWindow &&
      typeof chrome.devtools.inspectedWindow.getResources === 'function'
    );
  } catch (error) {
    return false;
  }
}
