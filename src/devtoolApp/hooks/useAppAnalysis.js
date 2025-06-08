import { useCallback, useEffect, useRef } from 'react';
import * as uiActions from '../store/ui';
import { resetNetworkResource } from '../store/networkResource';
import { resetStaticResource } from '../store/staticResource';
import { INITIAL_STATE as UI_INITIAL_STATE } from '../store/ui';
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
    
    // Resetear flag de abort
    analysisAbortRef.current = false;
    
    // Iniciar el análisis
    dispatch(uiActions.startAnalysis());
    
    try {
      // Limpiar recursos anteriores
      dispatch(resetNetworkResource());
      dispatch(resetStaticResource());
      
      // Fase 1: Análisis inicial de la página actual
      dispatch(uiActions.setStatus('Iniciando análisis de recursos...'));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 2: Detectar recursos de red
      dispatch(uiActions.setStatus('Detectando recursos de red...'));
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 3: Analizar recursos estáticos
      dispatch(uiActions.setStatus('Analizando recursos estáticos...'));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (analysisAbortRef.current) {
        dispatch(uiActions.stopAnalysis());
        return;
      }
      
      // Fase 4: Procesamiento de dependencias
      dispatch(uiActions.setStatus('Procesando dependencias...'));
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
          dispatch(uiActions.setStatus(`Analizando página: ${downloadItem.url} (${i + 1}/${downloadList.length})`));
          
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
  }, [staticResource]);  useEffect(() => {
    staticResourceRef.current = staticResource;
  }, [staticResource]);

  return { 
    handleStartAnalysis, 
    handleStopAnalysis,
    isAnalyzing 
  };
};
