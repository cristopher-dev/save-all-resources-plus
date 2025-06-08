import { useEffect } from 'react';
import { processStaticResourceToStore } from '../utils/resource';
import * as staticResourceActions from '../store/staticResource';
import useStore from '../store';
import { initializeStaticResourceRecording, checkDevtoolsAvailability } from './useAppRecordingStaticResourceHelpers';

export const useAppRecordingStaticResource = () => {
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
          initializeStaticResourceRecording(dispatch, processStaticResourceToStore, staticResourceActions);
        }
      }, 500);
      return () => clearTimeout(retryTimer);
    }
    
    initializeStaticResourceRecording(dispatch, processStaticResourceToStore, staticResourceActions);
    
    return () => {
      // Solo limpiar si ya no está analizando
      if (!isAnalyzing) {
        dispatch(staticResourceActions.resetStaticResource());
      }
    };
  }, [dispatch, isAnalyzing]);
};
