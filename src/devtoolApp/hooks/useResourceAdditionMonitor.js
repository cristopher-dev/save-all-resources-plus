import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import * as uiActions from '../store/ui';
import * as downloadListActions from '../store/downloadList';
import { handleResourceStability } from './useResourceAdditionMonitorHelpers';

/**
 * Hook para monitorear la adición de recursos y detectar cuando se completa
 * Se considera completa cuando no se han agregado nuevos recursos por un tiempo determinado
 */
export const useResourceAdditionMonitor = (timeoutMs = 3000) => {
  const { state, dispatch } = useStore();
  const { networkResource, staticResource, ui } = state;
  const { isAnalyzing, analysisCompleted } = ui;
  
  const timeoutRef = useRef(null);
  const lastResourceCountRef = useRef(0);
  const stableCountRef = useRef(0); // Contador para recursos estables
  const currentResourceCount = networkResource.length + staticResource.length;

  useEffect(() => {
    // Solo actuar si ya se completó el análisis O si el análisis está activo
    if (analysisCompleted || !isAnalyzing) {
      return;
    }

    handleResourceStability({
      currentResourceCount,
      lastResourceCountRef,
      stableCountRef,
      timeoutRef,
      timeoutMs,
      networkResource,
      staticResource,
      dispatch,
      uiActions,
      downloadListActions,
      isAnalyzing
    });
    
    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentResourceCount, analysisCompleted, isAnalyzing, dispatch, timeoutMs, networkResource, staticResource]);

  // Función para reiniciar el monitoreo
  const resetMonitoring = () => {
    lastResourceCountRef.current = 0;
    stableCountRef.current = 0;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch(uiActions.setStatus('Reiniciando detección de recursos...'));
  };

  return {
    currentResourceCount,
    resetMonitoring,
    isMonitoring: isAnalyzing && currentResourceCount > 0,
  };
};

export default useResourceAdditionMonitor;
