// Helper para inicialización y reintentos de grabación de recursos de red

export function initializeNetworkResourceRecording(dispatch, processNetworkResourceToStore, networkResourceActions) {
  try {
    console.log('[NETWORK RESOURCE]: Initializing network resource recording...');
    chrome.devtools.network.getHAR((logInfo) => {
      if (logInfo && logInfo.entries && logInfo.entries.length) {
        logInfo.entries.forEach((req) => {
          processNetworkResourceToStore(dispatch, req);
        });
      }
    });
    chrome.devtools.network.onRequestFinished.addListener((req) => {
      processNetworkResourceToStore(dispatch, req);
    });
  } catch (error) {
    console.error('[NETWORK RESOURCE]: Error initializing network resource recording:', error);
  }
}

export function checkDevtoolsAvailability() {
  try {
    return (
      typeof chrome !== 'undefined' &&
      chrome.devtools &&
      chrome.devtools.network &&
      typeof chrome.devtools.network.getHAR === 'function'
    );
  } catch (error) {
    return false;
  }
}
