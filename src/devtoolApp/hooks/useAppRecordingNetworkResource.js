import { useEffect } from 'react';
import { processNetworkResourceToStore } from '../utils/resource';
import * as networkResourceActions from '../store/networkResource';
import useStore from '../store';
import { initializeNetworkResourceRecording, checkDevtoolsAvailability } from './useAppRecordingNetworkResourceHelpers';

export const useAppRecordingNetworkResource = () => {
  const { state, dispatch } = useStore();
  const { ui: { isAnalyzing } } = state;
  
  useEffect(() => {
    // Solo inicializar la grabación si el análisis está activo
    if (!isAnalyzing) {
      return;
    }
    
    if (!checkDevtoolsAvailability()) {
      const retryTimer = setTimeout(() => {
        if (checkDevtoolsAvailability() && isAnalyzing) {
          initializeNetworkResourceRecording(dispatch, processNetworkResourceToStore, networkResourceActions);
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    
    initializeNetworkResourceRecording(dispatch, processNetworkResourceToStore, networkResourceActions);
    
    return () => {
      // Solo limpiar si ya no está analizando
      if (!isAnalyzing) {
        dispatch(networkResourceActions.resetNetworkResource());
      }
    };
  }, [dispatch, isAnalyzing]);
};
