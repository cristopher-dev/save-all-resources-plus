import { useEffect, useRef } from 'react';
import { useStore } from '../store';
import * as uiActions from '../store/ui';
import * as downloadListActions from '../store/downloadList';

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
    // Si ya se completó el análisis, no hacer nada
    if (analysisCompleted) {
      return;
    }

    // Si la cantidad de recursos cambió
    if (currentResourceCount !== lastResourceCountRef.current) {
      lastResourceCountRef.current = currentResourceCount;
      stableCountRef.current = 0; // Resetear contador de estabilidad
      
      // Limpiar timeout anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Actualizar estado si hay recursos
      if (currentResourceCount > 0) {
        dispatch(uiActions.setStatus(`Detectando recursos... ${currentResourceCount} encontrados`));
      }
      
      // Establecer nuevo timeout para detectar estabilidad
      timeoutRef.current = setTimeout(() => {
        stableCountRef.current++;
        
        // Si hemos tenido estabilidad por suficiente tiempo, completar análisis
        if (stableCountRef.current >= 1 && currentResourceCount > 0) {
          console.log('[RESOURCE MONITOR]: Resources stable, completing analysis');
          
          // Agregar recursos detectados a la downloadList automáticamente
          const allResources = [...networkResource, ...staticResource];
          console.log('[RESOURCE MONITOR]: Adding', allResources.length, 'resources to download list');
          
          allResources.forEach(resource => {
            dispatch(downloadListActions.addDownloadItem({ url: resource.url }));
          });
          
          dispatch(uiActions.setAnalysisCompleted());
        }
      }, timeoutMs);
    }

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentResourceCount, analysisCompleted, dispatch, timeoutMs]);

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
    isMonitoring: !analysisCompleted && currentResourceCount > 0,
  };
};

export default useResourceAdditionMonitor;
