import { useEffect } from 'react';
import { processStaticResourceToStore } from '../utils/resource';
import * as staticResourceActions from '../store/staticResource';
import useStore from '../store';

// Función para verificar la disponibilidad de chrome.devtools
const checkDevtoolsAvailability = () => {
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
};

export const useAppRecordingStaticResource = () => {
  const { dispatch } = useStore();
  useEffect(() => {
    // Verificar que el contexto de DevTools esté disponible
    if (!checkDevtoolsAvailability()) {
      console.warn('[STATIC RESOURCE]: chrome.devtools.inspectedWindow not available, retrying...');
      
      // Reintentar después de un pequeño delay
      const retryTimer = setTimeout(() => {
        if (checkDevtoolsAvailability()) {
          console.log('[STATIC RESOURCE]: chrome.devtools.inspectedWindow now available');
          initializeStaticResourceRecording();
        } else {
          console.error('[STATIC RESOURCE]: chrome.devtools.inspectedWindow still not available after retry');
        }
      }, 500);
      
      return () => clearTimeout(retryTimer);
    }
    
    initializeStaticResourceRecording();
    
    function initializeStaticResourceRecording() {
      try {
        console.log('[STATIC RESOURCE]: Initializing static resource recording...');
        
        //Get all resources that were already cached
        chrome.devtools.inspectedWindow.getResources((resources) => {
          console.log('[STATIC RESOURCE]: getResources callback called, count:', resources?.length || 0);
          console.log('[STATIC RESOURCE]: Raw resources:', resources);
          
          if (resources && resources.length) {
            console.log('[STATIC RESOURCE]: Processing', resources.length, 'static resources');
            resources.forEach((res, index) => {
              console.log(`[STATIC RESOURCE]: Processing resource ${index + 1}:`, res.url, res.type);
              processStaticResourceToStore(dispatch, res);
            });
          } else {
            console.log('[STATIC RESOURCE]: No static resources found');
          }
        });

        //This can be used for identifying when ever a new resource is added
        chrome.devtools.inspectedWindow.onResourceAdded.addListener((res) => {
          console.log('[STATIC RESOURCE]: New resource added:', res.url, res.type);
          processStaticResourceToStore(dispatch, res);
        });

        //This can be used to detect when ever a resource code is changed/updated
        chrome.devtools.inspectedWindow.onResourceContentCommitted.addListener((res) => {
          console.log('[STATIC RESOURCE]: Resource content committed:', res.url, res.type);
          processStaticResourceToStore(dispatch, res);
        });
      } catch (error) {
        console.error('[STATIC RESOURCE]: Error initializing static resource recording:', error);
      }
    }

    return () => {
      dispatch(staticResourceActions.resetStaticResource());
    };
  }, [dispatch]);
};
