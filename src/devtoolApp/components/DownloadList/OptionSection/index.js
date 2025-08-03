import React, { useCallback, useMemo } from 'react';
import { 
  OptionSectionWrapper, 
  SectionHeader, 
  SectionTitle, 
  ActionSection,
  ActionRow,
  StatusIndicator,
  AnimatedIcon,
  InfoTooltip,
  ProgressIndicator,
  StatsCard,
  StatsNumber,
  StatsLabel
} from './styles';
import * as uiActions from 'devtoolApp/store/ui';
import useStore from 'devtoolApp/store';
import Button from '../../Button';
import { useAppSaveAllResource } from 'devtoolApp/hooks/useAppSaveAllResource';
import { 
  FaDownload,
  FaCog,
  FaInfoCircle,
  FaCheckCircle,
  FaSpinner,
  FaStop,
  FaRocket
} from 'react-icons/fa';

export const OptionSection = () => {
  const { handleOnSave } = useAppSaveAllResource();  const {
    dispatch,
    state: {
      ui: { isSaving, selectedResources = {}, analysisCompleted, isAnalyzing },
      downloadList,
      networkResource = [],
      staticResource = [],
    },
  } = useStore();  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const hasSelections = selectedCount > 0;
  const totalResources = downloadList.length;
  const totalDetectedResources = networkResource.length + staticResource.length;
  
  // El botón debe estar habilitado si:
  // 1. Hay recursos en downloadList (páginas para descargar), O
  // 2. Se detectaron recursos automáticamente
  const hasResourcesForDownload = totalResources > 0 || totalDetectedResources > 0;

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
    dispatch(uiActions.setStatus('Download canceled by user'));
  }, [dispatch]);

  // Progress calculation for better UX
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
          Download Options
        </SectionTitle>
        <InfoTooltip data-tooltip="Configure download options as needed">
          <FaInfoCircle style={{ color: 'var(--color-text-secondary)', cursor: 'help' }} />
        </InfoTooltip>
      </SectionHeader>      {/* Estadísticas de recursos */}
      {analysisCompleted && (
        <ActionRow className="stats-grid" style={{ marginBottom: '20px' }}>
          <StatsCard className="stats-card">
            <StatsNumber>{totalResources > 0 ? totalResources : totalDetectedResources}</StatsNumber>
            <StatsLabel>Total Resources</StatsLabel>
          </StatsCard>
          <StatsCard className="stats-card">
            <StatsNumber>{selectedCount}</StatsNumber>
            <StatsLabel>Selected</StatsLabel>
          </StatsCard>
          <StatsCard className="stats-card">
            <StatsNumber>{Math.round((selectedCount / Math.max(totalResources, totalDetectedResources, 1)) * 100) || 0}%</StatsNumber>
            <StatsLabel>Progress</StatsLabel>
          </StatsCard>        </ActionRow>
      )}

      <ActionSection>
        <ActionRow>          {!isSaving ? (
            <Button 
              variant="primary"
              size="lg"
              onClick={handleDownloadSelected}
              disabled={!hasResourcesForDownload || (!analysisCompleted && !hasSelections)}
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
            >              <FaRocket style={{ fontSize: '16px', marginRight: '8px' }} />
              {hasSelections 
                ? `Download Selected (${selectedCount} of ${totalResources})` 
                : totalResources > 0 
                  ? `Download All (${totalResources} resources)`
                  : `Download Resources (${totalDetectedResources} found)`
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
                Cancel Download
              </Button>
              <ProgressIndicator />
            </>
          )}
        </ActionRow>
        
        {analysisCompleted && !isSaving && (
          <ActionRow>
            <StatusIndicator>
              <FaCheckCircle />              Analysis completed - {totalResources > 0 
                ? `${totalResources} resources found`
                : `${totalDetectedResources} resources detected`}
              {hasSelections && ` (${selectedCount} selected)`}
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
              <FaSpinner className="fa-spin" />              Download in progress... 
              {hasSelections 
                ? `${selectedCount} resources` 
                : totalResources > 0 
                  ? `${totalResources} resources`
                  : `${totalDetectedResources} resources`}
            </StatusIndicator>
          </ActionRow>
        )}
      </ActionSection>
    </OptionSectionWrapper>
  );
};

export default OptionSection;
