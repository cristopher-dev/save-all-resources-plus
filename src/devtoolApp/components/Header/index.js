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
import { 
  FaEye, 
  FaDownload, 
  FaSave, 
  FaFileArchive, 
  FaCog,
  FaChartLine,
  FaGlobe
} from 'react-icons/fa';
import packageJson from '/package.json';

export const Header = (props) => {
  const { state, theme } = useStore();
  const {
    ui: { status, isSaving },
    downloadList: { items = [] }
  } = state;
  const { handleOnSave } = useAppSaveAllResource();
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
      isProcessing: status !== UI_INITIAL_STATE.status
    };
  }, [items, status]);

  const saveText = useMemo(() => {
    if (status !== UI_INITIAL_STATE.status) {
      return 'Procesando recursos...';
    }
    return isSaving ? `Guardando recursos...` : `Guardar en Vault`;
  }, [status, isSaving]);

  const isActionDisabled = status !== UI_INITIAL_STATE.status || isSaving;

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
            {stats.isProcessing ? 'Procesando...' : 'Listo'}
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
              onClick={() => setShowPreview(true)} 
              disabled={isActionDisabled}
              variant="ghost"
              size="sm"
            >
              <FaEye />
              Vista Previa
            </Button>
            
            <Button 
              onClick={handleOnSave} 
              disabled={isActionDisabled || stats.totalResources === 0}
              variant="primary"
              size="sm"
            >
              <FaSave />
              {saveText}
            </Button>
            
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
