import React, { useCallback } from 'react';
import { Toggle } from '../../Toggle';
import { OptionSectionWrapper } from './styles';
import * as optionActions from 'devtoolApp/store/option';
import * as uiActions from 'devtoolApp/store/ui';
import useStore from 'devtoolApp/store';
import Button from '../../Button';
import { useAppSaveAllResource } from 'devtoolApp/hooks/useAppSaveAllResource';
import { FaDownload, FaPlay, FaStop } from 'react-icons/fa';

export const OptionSection = () => {
  const { handleOnSave } = useAppSaveAllResource();
  const {
    dispatch,
    state: {
      option: { ignoreNoContentFile, beautifyFile },
      ui: { isSaving, selectedResources = {}, analysisCompleted },
      downloadList,
    },
  } = useStore();

  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const hasSelections = selectedCount > 0;

  const handleIgnoreNoContentFile = useCallback((willIgnore) => {
    dispatch(optionActions.setIgnoreNoContentFile(willIgnore));
  }, []);

  const handleBeautifyFile = useCallback((willBeautify) => {
    dispatch(optionActions.setBeautifyFile(willBeautify));
  }, [dispatch]);

  const handleDownloadSelected = useCallback(async (event) => {
    event.stopPropagation();
    if (hasSelections) {
      console.log(`[DOWNLOAD]: Starting download of ${selectedCount} selected resources`);
    } else {
      console.log('[DOWNLOAD]: No specific selection, downloading all resources');
    }
    await handleOnSave();
  }, [handleOnSave, hasSelections, selectedCount]);

  const handleStopDownload = useCallback((event) => {
    event.stopPropagation();
    dispatch(uiActions.setIsSaving(false));
    dispatch(uiActions.setStatus('Descarga cancelada por el usuario'));
  }, [dispatch]);

  return (
    <OptionSectionWrapper>
      <Toggle noInteraction={isSaving} isToggled={ignoreNoContentFile} onToggle={handleIgnoreNoContentFile}>
        Ignore "No Content" files
      </Toggle>
      <Toggle noInteraction={isSaving} isToggled={beautifyFile} onToggle={handleBeautifyFile}>
        Beautify HTML, CSS, JS, JSON files
      </Toggle>
      
      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        {!isSaving ? (
          <Button 
            color="primary" 
            onClick={handleDownloadSelected}
            disabled={downloadList.length === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaDownload />
            {hasSelections 
              ? `Descargar Seleccionados (${selectedCount})` 
              : 'Descargar Todo'
            }
          </Button>
        ) : (
          <Button 
            color="danger" 
            onClick={handleStopDownload}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <FaStop />
            Cancelar Descarga
          </Button>
        )}
        
        {analysisCompleted && (
          <div style={{ fontSize: '12px', color: '#28a745' }}>
            ✅ Análisis completado
          </div>
        )}
      </div>
    </OptionSectionWrapper>
  );
};

export default OptionSection;
