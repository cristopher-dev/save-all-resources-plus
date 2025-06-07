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
        console.log('[NETWORK RESOURCE]: Initializing network resource recording...');
        
        //Get all HARs that were already captured
        chrome.devtools.network.getHAR((logInfo) => {
          console.log('[NETWORK RESOURCE]: getHAR callback called');
          console.log('[NETWORK RESOURCE]: HAR entries count:', logInfo?.entries?.length || 0);
          console.log('[NETWORK RESOURCE]: HAR log info:', logInfo);
          
          if (logInfo && logInfo.entries && logInfo.entries.length) {
            console.log('[NETWORK RESOURCE]: Processing', logInfo.entries.length, 'network requests');
            logInfo.entries.forEach((req, index) => {
              console.log(`[NETWORK RESOURCE]: Processing request ${index + 1}:`, req.request?.url);
              processNetworkResourceToStore(dispatch, req);
            });
          } else {
            console.log('[NETWORK RESOURCE]: No network requests found in HAR');
          }
        });

        //This can be used for detecting when a request is finished
        chrome.devtools.network.onRequestFinished.addListener((req) => {
          console.log('[NETWORK RESOURCE]: New request finished:', req.request?.url);
          processNetworkResourceToStore(dispatch, req);
        });
      } catch (error) {
        console.error('[NETWORK RESOURCE]: Error initializing network resource recording:', error);
      }
    }

    return () => {
      dispatch(networkResourceActions.resetNetworkResource());
    };
  }, [dispatch]);
};
