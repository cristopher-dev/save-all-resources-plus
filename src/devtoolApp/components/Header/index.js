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
} from './styles';
import Button from 'devtoolApp/components/Button';
import ResourcePreview from 'devtoolApp/components/DownloadList/ResourcePreview';
import { useStore } from 'devtoolApp/store';
import * as uiActions from 'devtoolApp/store/ui';
import { useAppSaveAllResource } from '../../hooks/useAppSaveAllResource';
import { useAppAnalysis } from '../../hooks/useAppAnalysis';
import {
  FaGlobe,
  FaSave,
  FaStop,
  FaExclamationTriangle,
} from 'react-icons/fa';

export const Header = (props) => {
  const { state, dispatch, theme } = useStore();
  const {
    ui: { status, isSaving, isAnalyzing, analysisCompleted },
    downloadList: { items = [] },
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
    };    return {
      totalResources,
      totalSize: formatSize(totalSize),
      isProcessing: status !== 'Listo para escanear...' || isAnalyzing,
    };
  }, [items, status, isAnalyzing]);  // Solo deshabilitar el botón cuando se está guardando
  const isActionDisabled = isSaving;
  // El botón de vista previa solo debe estar deshabilitado si no hay recursos para mostrar
  const isPreviewDisabled = stats.totalResources === 0;  const handlePreviewClick = (event) => {
    event.stopPropagation();
    if (!isPreviewDisabled) {
      setShowPreview(true);
    }
  };

  const handleStopClick = (event) => {
    event.stopPropagation();
    handleStopAnalysis();
  };

  const handleForceReset = (event) => {
    event.stopPropagation();
    console.log('[HEADER]: Force resetting saving state');
    dispatch(uiActions.forceResetSaving());
  };
  // Detectar si el botón ha estado bloqueado por mucho tiempo
  const isStuckSaving = isSaving && status !== 'Listo para escanear...';

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
            {isAnalyzing
              ? 'Escaneando...'
              : stats.isProcessing
                ? 'Procesado...'
                : analysisCompleted
                  ? 'Listo para guardar'
                  : 'Listo'}
          </StatusBadge>
        </BrandSection>        <ActionSection>
          <ButtonGroup>
            {isAnalyzing ? (
              <Button onClick={handleStopClick} variant="danger" size="sm" loading={true} isScanning={isAnalyzing}>
                <FaStop />
                Detener
              </Button>
            ) : (
              <>
                {analysisCompleted && stats.totalResources > 0 && (
                  <Button
                    onClick={handleOnSave}
                    disabled={isSaving}
                    variant="primary"
                    size="sm"
                    loading={isSaving}
                  >
                    <FaSave />
                    Guardar en Vault
                  </Button>
                )}
                <Button
                  onClick={() => {
                    if (!isSaving) {
                      handleStartAnalysis();
                    }
                  }}
                  disabled={isSaving}
                  variant={analysisCompleted && stats.totalResources > 0 ? "secondary" : "primary"}
                  size="sm"
                  loading={false}
                >
                  <FaGlobe />
                  {analysisCompleted && stats.totalResources > 0 ? 'Volver a escanear' : 'Escanear'}
                </Button>
              </>
            )}            {isStuckSaving && (
              <Button
                onClick={handleForceReset}
                variant="warning"
                size="sm"
                title="Resetear estado de guardado si está bloqueado"
              >
                <FaExclamationTriangle />
                Desbloquear
              </Button>
            )}

          </ButtonGroup>
        </ActionSection>
      </HeaderContent>

      <ResourcePreview isOpen={showPreview} onClose={() => setShowPreview(false)} />
    </HeaderWrapper>
  );
};

export default withTheme(Header);
