// Helper para lógica de temporización y estabilidad en el monitoreo de recursos

export function handleResourceStability({
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
  isAnalyzing = false
}) {
  // Solo procesar si el análisis está activo
  if (!isAnalyzing) {
    return;
  }
  
  if (currentResourceCount !== lastResourceCountRef.current) {
    lastResourceCountRef.current = currentResourceCount;
    stableCountRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentResourceCount > 0) {
      dispatch(uiActions.setStatus(`Detectando recursos... ${currentResourceCount} encontrados`));
    }    timeoutRef.current = setTimeout(() => {
      stableCountRef.current++;
      
      // Completar análisis después de timeout, independientemente del número de recursos
      console.log('[RESOURCE MONITOR]: Completing analysis after timeout');
      console.log('[RESOURCE MONITOR]: Final counts:', {
        network: networkResource.length,
        static: staticResource.length,
        total: currentResourceCount
      });
      
      // Si hay recursos detectados, agregarlos al downloadList
      if (currentResourceCount > 0) {
        const allResources = [...networkResource, ...staticResource];
        allResources.forEach(resource => {
          dispatch(downloadListActions.addDownloadItem({ url: resource.url }));
        });
        dispatch(uiActions.setStatus(`Análisis completado. ${currentResourceCount} recursos detectados.`));
      } else {
        dispatch(uiActions.setStatus('Análisis completado. No se detectaron recursos automáticamente, pero puedes intentar descargar la página actual.'));
      }
      
      // Marcar análisis como completado y detener el estado de análisis
      dispatch(uiActions.setAnalysisCompleted());
    }, Math.min(timeoutMs, 2000)); // Limitar el timeout a máximo 2 segundos
  } else {
    // Si el recuento de recursos se mantiene igual, incrementar contador de estabilidad
    stableCountRef.current++;
    
    // Si hemos estado estables por suficiente tiempo, completar el análisis
    if (stableCountRef.current >= 3) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      console.log('[RESOURCE MONITOR]: Resources have been stable, completing analysis');
      console.log('[RESOURCE MONITOR]: Final counts:', {
        network: networkResource.length,
        static: staticResource.length,
        total: currentResourceCount
      });
      
      if (currentResourceCount > 0) {
        const allResources = [...networkResource, ...staticResource];
        allResources.forEach(resource => {
          dispatch(downloadListActions.addDownloadItem({ url: resource.url }));
        });
        dispatch(uiActions.setStatus(`Análisis completado. ${currentResourceCount} recursos detectados.`));
      } else {
        dispatch(uiActions.setStatus('Análisis completado. No se detectaron recursos automáticamente, pero puedes intentar descargar la página actual.'));
      }
      
      dispatch(uiActions.setAnalysisCompleted());
    }
  }
}
