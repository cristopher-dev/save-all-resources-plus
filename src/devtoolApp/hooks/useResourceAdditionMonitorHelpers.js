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
  downloadListActions
}) {
  if (currentResourceCount !== lastResourceCountRef.current) {
    lastResourceCountRef.current = currentResourceCount;
    stableCountRef.current = 0;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentResourceCount > 0) {
      dispatch(uiActions.setStatus(`Detectando recursos... ${currentResourceCount} encontrados`));
    }
    timeoutRef.current = setTimeout(() => {
      stableCountRef.current++;
      if (stableCountRef.current >= 1 && currentResourceCount > 0) {
        const allResources = [...networkResource, ...staticResource];
        allResources.forEach(resource => {
          dispatch(downloadListActions.addDownloadItem({ url: resource.url }));
        });
        dispatch(uiActions.setAnalysisCompleted());
      }
    }, timeoutMs);
  }
}
