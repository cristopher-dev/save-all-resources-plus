import { useCallback, useEffect, useRef } from 'react';
import * as uiActions from '../store/ui';
import { resetNetworkResource } from '../store/networkResource';
import { resetStaticResource } from '../store/staticResource';
import useStore from '../store';

export const useAppAnalysis = () => {
  const { state, dispatch } = useStore();
  const { networkResource, staticResource } = state;
  const networkResourceRef = useRef(networkResource);
  const staticResourceRef = useRef(staticResource);
  const analysisAbortRef = useRef(false);
  const {
    downloadList,
    ui: { tab, isAnalyzing },
  } = state;  const handleStartAnalysis = useCallback(async () => {
    // Verificar que el contexto de DevTools esté disponible antes de proceder
    if (!chrome?.devtools?.inspectedWindow?.tabId) {
      console.error('[ANALYSIS]: DevTools context not available - tabId missing');
      dispatch(uiActions.setStatus('Error: Contexto de DevTools no disponible'));
      return;
    }

    console.log('[ANALYSIS]: Starting analysis operation with tabId:', chrome.devtools.inspectedWindow.tabId);
    
    // Reset abort flag
    analysisAbortRef.current = false;
    
    // Start analysis
    dispatch(uiActions.startAnalysis());
    
    try {
      // Clear previous resources
      dispatch(resetNetworkResource());
      dispatch(resetStaticResource());
      
      // Phase 1: Initial analysis of the current page
      dispatch(uiActions.setStatus('Starting resource analysis...'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 2: Detectar recursos de red
      dispatch(uiActions.setStatus('Detecting network resources...'));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 3: Analizar recursos estáticos
      dispatch(uiActions.setStatus('Analyzing static resources...'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 4: Procesamiento de dependencias
      dispatch(uiActions.setStatus('Processing dependencies...'));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Si hay elementos en downloadList, procesarlos también
      if (downloadList.length > 0) {
        for (let i = 0; i < downloadList.length; i++) {
          if (analysisAbortRef.current) {
            dispatch(uiActions.stopAnalysis());
            return;
          }
          
          const downloadItem = downloadList[i];
          dispatch(uiActions.setStatus(`Analyzing page: ${downloadItem.url} (${i + 1}/${downloadList.length})`));
          
          // Simular análisis por página
          await new Promise(resolve => setTimeout(resolve, 800));
        }
      }
      
      if (!analysisAbortRef.current) {
        // Completar análisis
        dispatch(uiActions.setAnalysisCompleted());
        dispatch(uiActions.setStatus('Análisis completado. Recursos listos para guardar.'));
      }
      
    } catch (error) {
      console.error('[ANALYSIS]: Error during analysis:', error);
      dispatch(uiActions.setStatus('Error durante el análisis: ' + error.message));
      dispatch(uiActions.stopAnalysis());
    }
  }, [state, dispatch, downloadList]);
  const handleStopAnalysis = useCallback(() => {
    analysisAbortRef.current = true;
    dispatch(uiActions.stopAnalysis());
  }, [dispatch]);

  useEffect(() => {
    networkResourceRef.current = networkResource;
  }, [networkResource]);
  
  useEffect(() => {
    staticResourceRef.current = staticResource;
  }, [staticResource]);

  return { 
    handleStartAnalysis, 
    handleStopAnalysis,
    isAnalyzing 
  };
};
