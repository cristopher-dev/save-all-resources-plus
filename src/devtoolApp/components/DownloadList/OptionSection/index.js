import React, { useCallback, useMemo } from 'react';
import { Toggle } from '../../Toggle';
import { 
  OptionSectionWrapper, 
  SectionHeader, 
  SectionTitle, 
  OptionsGrid, 
  OptionItem, 
  OptionInfo, 
  OptionLabel, 
  OptionDescription,
  ActionSection,
  ActionRow,
  StatusIndicator,
  ProgressIndicator,
  InfoTooltip,
  AnimatedIcon,
  StatsCard,
  StatsNumber,
  StatsLabel
} from './styles';
import * as optionActions from 'devtoolApp/store/option';
import * as uiActions from 'devtoolApp/store/ui';
import useStore from 'devtoolApp/store';
import Button from '../../Button';
import { useAppSaveAllResource } from 'devtoolApp/hooks/useAppSaveAllResource';
import { 
  FaDownload, 
  FaStop, 
  FaCog, 
  FaFileAlt, 
  FaCode, 
  FaCheckCircle,
  FaSpinner,
  FaFilter,
  FaMagic,
  FaInfoCircle,
  FaChartBar,
  FaEye,
  FaRocket
} from 'react-icons/fa';

export const OptionSection = () => {
  const { handleOnSave } = useAppSaveAllResource();  const {
    dispatch,
    state: {
      option: { ignoreNoContentFile, beautifyFile },
      ui: { isSaving, selectedResources = {}, analysisCompleted, isAnalyzing },
      downloadList,
    },
  } = useStore();

  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const hasSelections = selectedCount > 0;
  const totalResources = downloadList.length;

  const handleIgnoreNoContentFile = useCallback((willIgnore) => {
    dispatch(optionActions.setIgnoreNoContentFile(willIgnore));
  }, [dispatch]);

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

  // Cálculo de progreso para mejor UX
  const downloadProgress = useMemo(() => {
    if (!hasSelections && totalResources === 0) return 0;
    if (hasSelections) {
      return Math.round((selectedCount / totalResources) * 100);
    }
    return 100;
  }, [hasSelections, selectedCount, totalResources]);
  return (
    <OptionSectionWrapper>
      <SectionHeader>
        <SectionTitle>
          <AnimatedIcon>
            <FaCog />
          </AnimatedIcon>
          Opciones de Descarga
        </SectionTitle>
        <InfoTooltip data-tooltip="Configura las opciones de descarga según tus necesidades">
          <FaInfoCircle style={{ color: 'var(--color-text-secondary)', cursor: 'help' }} />
        </InfoTooltip>
      </SectionHeader>      {/* Estadísticas de recursos */}
      {analysisCompleted && (
        <ActionRow className="stats-grid" style={{ marginBottom: '20px' }}>
          <StatsCard className="stats-card">
            <StatsNumber>{totalResources}</StatsNumber>
            <StatsLabel>Total Recursos</StatsLabel>
          </StatsCard>
          <StatsCard className="stats-card">
            <StatsNumber>{selectedCount}</StatsNumber>
            <StatsLabel>Seleccionados</StatsLabel>
          </StatsCard>
          <StatsCard className="stats-card">
            <StatsNumber>{Math.round((selectedCount / totalResources) * 100) || 0}%</StatsNumber>
            <StatsLabel>Progreso</StatsLabel>
          </StatsCard>
        </ActionRow>
      )}

      <OptionsGrid>
        <OptionItem style={{ '--animation-delay': 1 }}>
          <OptionInfo>
            <OptionLabel>
              <AnimatedIcon>
                <FaFilter />
              </AnimatedIcon>
              Filtrar archivos sin contenido
              <InfoTooltip data-tooltip="Los archivos vacíos o sin contenido válido serán excluidos automáticamente">
                <FaInfoCircle style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }} />
              </InfoTooltip>
            </OptionLabel>
            <OptionDescription>
              Excluye automáticamente los archivos que no tienen contenido válido o están vacíos
            </OptionDescription>
          </OptionInfo>
          <Toggle 
            noInteraction={isSaving} 
            isToggled={ignoreNoContentFile} 
            onToggle={handleIgnoreNoContentFile}
            activeColor="primary"
          />
        </OptionItem>

        <OptionItem style={{ '--animation-delay': 2 }}>
          <OptionInfo>
            <OptionLabel>
              <AnimatedIcon>
                <FaMagic />
              </AnimatedIcon>
              Embellecimiento de código
              <InfoTooltip data-tooltip="Formatea y mejora la legibilidad del código descargado">
                <FaInfoCircle style={{ marginLeft: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }} />
              </InfoTooltip>
            </OptionLabel>
            <OptionDescription>
              Formatea y embellece automáticamente archivos HTML, CSS, JavaScript y JSON
            </OptionDescription>
          </OptionInfo>
          <Toggle 
            noInteraction={isSaving} 
            isToggled={beautifyFile} 
            onToggle={handleBeautifyFile}
            activeColor="secondary"
          />
        </OptionItem>
      </OptionsGrid>
      
      <ActionSection>
        <ActionRow>          {!isSaving ? (
            <Button 
              variant="primary"
              size="lg"
              onClick={handleDownloadSelected}
              disabled={totalResources === 0}
              fullWidth
              loading={isAnalyzing}
              isScanning={isAnalyzing}
              style={{ 
                background: hasSelections 
                  ? 'linear-gradient(135deg, #1283c3 0%, #10b981 100%)'
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                position: 'relative',
                overflow: 'hidden',
                transform: 'perspective(1000px) rotateX(0deg)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(-5deg) translateY(-2px)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0px)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <FaRocket style={{ fontSize: '16px', marginRight: '8px' }} />
              {hasSelections 
                ? `Descargar Seleccionados (${selectedCount} de ${totalResources})` 
                : `Descargar Todo (${totalResources} recursos)`
              }
            </Button>
          ) : (            <>
              <Button 
                variant="danger"
                size="lg"
                onClick={handleStopDownload}
                fullWidth
                loading={isSaving}
                isScanning={false}
                style={{ 
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  border: 'none',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                <FaStop style={{ fontSize: '16px' }} />
                Cancelar Descarga
              </Button>
              <ProgressIndicator />
            </>
          )}
        </ActionRow>
        
        {analysisCompleted && !isSaving && (
          <ActionRow>
            <StatusIndicator>
              <FaCheckCircle />
              Análisis completado - {totalResources} recursos encontrados
              {hasSelections && ` (${selectedCount} seleccionados)`}
            </StatusIndicator>
          </ActionRow>
        )}

        {isSaving && (
          <ActionRow>
            <StatusIndicator style={{ 
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 167, 38, 0.1))',
              color: '#f59e0b',
              borderColor: 'rgba(255, 193, 7, 0.3)'
            }}>
              <FaSpinner className="fa-spin" />
              Descarga en progreso... 
              {hasSelections ? `${selectedCount} recursos` : `${totalResources} recursos`}
            </StatusIndicator>
          </ActionRow>
        )}
      </ActionSection>
    </OptionSectionWrapper>
  );
};

export default OptionSection;
