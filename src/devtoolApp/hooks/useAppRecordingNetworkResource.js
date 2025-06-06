import { useEffect } from 'react';
import { processNetworkResourceToStore } from '../utils/resource';
import * as networkResourceActions from '../store/networkResource';
import useStore from '../store';

// Función para verificar la disponibilidad de chrome.devtools
const checkDevtoolsAvailability = () => {
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
};

export const useAppRecordingNetworkResource = () => {
  const { dispatch } = useStore();
  useEffect(() => {
    // Verificar que el contexto de DevTools esté disponible
    if (!checkDevtoolsAvailability()) {
      console.warn('[NETWORK RESOURCE]: chrome.devtools.network not available, retrying...');
      
      // Reintentar después de un pequeño delay
      const retryTimer = setTimeout(() => {
        if (checkDevtoolsAvailability()) {
          console.log('[NETWORK RESOURCE]: chrome.devtools.network now available');
          initializeNetworkResourceRecording();
        } else {
          console.error('[NETWORK RESOURCE]: chrome.devtools.network still not available after retry');
        }
      }, 500);
      
      return () => clearTimeout(retryTimer);
    }
    
    initializeNetworkResourceRecording();
    
    function initializeNetworkResourceRecording() {
      try {
        //Get all HARs that were already captured
        chrome.devtools.network.getHAR((logInfo) => {
          if (logInfo && logInfo.entries && logInfo.entries.length) {
            logInfo.entries.forEach((req) => processNetworkResourceToStore(dispatch, req));
          }
        });

        //This can be used for detecting when a request is finished
        chrome.devtools.network.onRequestFinished.addListener((req) => processNetworkResourceToStore(dispatch, req));
      } catch (error) {
        console.error('[NETWORK RESOURCE]: Error initializing network resource recording:', error);
      }
    }

    return () => {
      dispatch(networkResourceActions.resetNetworkResource());
    };
  }, [dispatch]);
};
