import React, { useMemo, useState } from 'react';
import { withTheme } from 'styled-components';
import { 
  HeaderWrapper, 
  HeaderContent,
  BrandSection,
  BrandTitle,
  BrandSubtitle,
  StatusBadge,
  ActionSection,
  ButtonGroup,
  StatsContainer,
  StatItem
} from './styles';
import ResetButton from 'devtoolApp/components/ResetButton';
import Button from 'devtoolApp/components/Button';
import ResourcePreview from 'devtoolApp/components/DownloadList/ResourcePreview';
import { useStore } from 'devtoolApp/store';
import { INITIAL_STATE as UI_INITIAL_STATE } from 'devtoolApp/store/ui';
import { useAppSaveAllResource } from '../../hooks/useAppSaveAllResource';
import { useAppAnalysis } from '../../hooks/useAppAnalysis';
import { 
  FaEye, 
  FaDownload, 
  FaSave, 
  FaFileArchive, 
  FaCog,
  FaChartLine,
  FaGlobe,
  FaStop
} from 'react-icons/fa';
import packageJson from '/package.json';

export const Header = (props) => {
  const { state, theme } = useStore();
  const {
    ui: { status, isSaving, isAnalyzing, analysisCompleted },
    downloadList: { items = [] }
  } = state;
  const { handleOnSave } = useAppSaveAllResource();
  const { handleStartAnalysis, handleStopAnalysis } = useAppAnalysis();
  const [showPreview, setShowPreview] = useState(false);

  // Estadísticas de recursos
  const stats = useMemo(() => {
    const totalResources = items.length;
    const totalSize = items.reduce((acc, item) => acc + (item.size || 0), 0);
    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return {
      totalResources,
      totalSize: formatSize(totalSize),
      isProcessing: status !== UI_INITIAL_STATE.status || isAnalyzing
    };
  }, [items, status, isAnalyzing]);

  const saveText = useMemo(() => {
    if (isAnalyzing) {
      return 'Escaneando...';
    }
    if (status !== UI_INITIAL_STATE.status) {
      return 'Procesando...';
    }
    if (isSaving) {
      return 'Guardando recursos...';
    }
    if (analysisCompleted && stats.totalResources > 0) {
      return 'Guardar en Vault';
    }
    return 'Escanear';
  }, [status, isSaving, isAnalyzing, analysisCompleted, stats.totalResources]);

  const isActionDisabled = status !== UI_INITIAL_STATE.status || isSaving;

  const handleMainAction = (event) => {
    event.stopPropagation();
    if (isActionDisabled) return;
    
    if (analysisCompleted && stats.totalResources > 0) {
      handleOnSave();
    } else {
      handleStartAnalysis();
    }
  };

  const handlePreviewClick = (event) => {
    event.stopPropagation();
    if (!isActionDisabled) {
      setShowPreview(true);
    }
  };

  const handleStopClick = (event) => {
    event.stopPropagation();
    handleStopAnalysis();
  };

  return (
    <HeaderWrapper>
      <HeaderContent>
        <BrandSection>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FaGlobe size={24} color={theme?.colors?.primary || '#1283c3'} />
            <div>
              <BrandTitle>Resource Vault</BrandTitle>
              <BrandSubtitle>Gestor Inteligente de Recursos Web</BrandSubtitle>
            </div>
          </div>
          
          <StatusBadge variant={stats.isProcessing ? 'warning' : 'success'}>
            {isAnalyzing ? 'Escaneando...' : stats.isProcessing ? 'Procesando...' : analysisCompleted ? 'Listo para guardar' : 'Listo'}
          </StatusBadge>
        </BrandSection>

        <StatsContainer>
          <StatItem>
            <FaFileArchive size={14} />
            <span>{stats.totalResources} recursos</span>
          </StatItem>
          <StatItem>
            <FaChartLine size={14} />
            <span>{stats.totalSize}</span>
          </StatItem>
        </StatsContainer>

        <ActionSection>
          <ButtonGroup>
            <Button 
              onClick={handlePreviewClick} 
              disabled={isActionDisabled}
              variant="ghost"
              size="sm"
            >
              <FaEye />
              Vista Previa
            </Button>
            
            {isAnalyzing ? (
              <Button 
                onClick={handleStopClick} 
                variant="danger"
                size="sm"
              >
                <FaStop />
                Detener
              </Button>
            ) : (
              <Button 
                onClick={handleMainAction} 
                disabled={isActionDisabled}
                variant="primary"
                size="sm"
              >
                <FaSave />
                {saveText}
              </Button>
            )}
            
            <ResetButton />
          </ButtonGroup>
        </ActionSection>
      </HeaderContent>

      <ResourcePreview 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />
    </HeaderWrapper>
  );
};

export default withTheme(Header);
