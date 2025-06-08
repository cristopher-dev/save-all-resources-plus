import React, { useState, useMemo, useCallback } from 'react';
import { useStore } from 'devtoolApp/store';
import { 
  downloadZipFile, 
  resolveDuplicatedResources, 
  applyAdvancedFilters
} from '../../../utils/file';
import { 
  FaDownload, 
  FaFileArchive,
  FaSpinner
} from 'react-icons/fa';
import {
  ExportContainer,
  ExportHeader,
  ExportTitle,
  ExportContent,
  ExportActions,
  ActionButton,
  ProgressContainer,
  ProgressBar,
  ProgressText
} from './styles';

const ExportOptions = () => {
  const { state } = useStore();
  const { networkResource = [], staticResource = [], option } = state;
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Combinar todos los recursos
  const allResources = useMemo(() => {
    return [...networkResource, ...staticResource];
  }, [networkResource, staticResource]);

  const handleDownload = useCallback(async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    setIsExporting(true);
    setExportProgress(0);

    try {
      const filteredResources = applyAdvancedFilters(allResources, option.advancedFilters);
      const toDownload = resolveDuplicatedResources(filteredResources);

      await new Promise((resolve) => {
        downloadZipFile(
          toDownload,
          { 
            ignoreNoContentFile: option.ignoreNoContentFile, 
            beautifyFile: option.beautifyFile 
          },
          (item, isDone) => {
            const progress = Math.round((toDownload.length - toDownload.indexOf(item)) / toDownload.length * 100);
            setExportProgress(progress);
          },
          () => {
            resolve();
          }
        );
      });
    } catch (error) {
      console.error('Error en descarga:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [allResources, option]);

  return (
    <ExportContainer>
      <ExportHeader>
        <ExportTitle>
          <FaFileArchive />
          Descargar Recursos ({allResources.length})
        </ExportTitle>
      </ExportHeader>

      <ExportContent>
        {isExporting && (
          <ProgressContainer>
            <ProgressText>
              Exportando recursos... {exportProgress}%
            </ProgressText>
            <ProgressBar>
              <div style={{
                width: `${exportProgress}%`,
                height: '100%',
                backgroundColor: '#667eea',
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </ProgressBar>
          </ProgressContainer>
        )}

        <ExportActions>
          <ActionButton 
            primary
            onClick={handleDownload}
            disabled={isExporting || allResources.length === 0}
          >
            {isExporting ? (
              <>
                <FaSpinner className="spinning" />
                Exportando...
              </>
            ) : (
              <>
                <FaDownload />
                Descargar Todo ({allResources.length})
              </>
            )}
          </ActionButton>
        </ExportActions>
      </ExportContent>
    </ExportContainer>
  );
};

export default ExportOptions;
