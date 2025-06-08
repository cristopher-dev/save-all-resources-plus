import React from 'react';
import styled from 'styled-components';
import { useStore } from 'devtoolApp/store';
import { FaSpinner, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

const AnalysisStatusContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'isAnalyzing' && prop !== 'isInterrupted'
})`
  padding: 12px 16px;
  margin: 8px 0;
  border-radius: 6px;
  background: ${props => {
    if (props.isCompleted) return props.theme.colors.success + '20';
    if (props.isAnalyzing) return props.theme.colors.primary + '20';
    if (props.isInterrupted) return props.theme.colors.warning + '20';
    return 'transparent';
  }};
  border: 1px solid ${props => {
    if (props.isCompleted) return props.theme.colors.success;
    if (props.isAnalyzing) return props.theme.colors.primary;
    if (props.isInterrupted) return props.theme.colors.warning;
    return 'transparent';
  }};
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  transition: all 0.3s ease;
`;

const StatusIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isCompleted' && prop !== 'isAnalyzing' && prop !== 'isInterrupted'
})`
  color: ${props => {
    if (props.isCompleted) return props.theme.colors.success;
    if (props.isAnalyzing) return props.theme.colors.primary;
    if (props.isInterrupted) return props.theme.colors.warning;
    return props.theme.colors.text;
  }};
  
  svg {
    animation: ${props => props.isAnalyzing ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const StatusText = styled.div`
  flex: 1;
  color: ${props => props.theme.colors.text};
`;

const ResourceCount = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

export const AnalysisStatus = () => {
  const { state } = useStore();
  const { 
    ui: { status, analysisCompleted, isAnalyzing }, 
    networkResource = [], 
    staticResource = [] 
  } = state;
  
  const totalResources = networkResource.length + staticResource.length;
  const isInterrupted = status.includes('detenido') || status.includes('interrumpido');
  
  // Solo mostrar cuando el análisis está activo (isAnalyzing = true)
  // Se oculta automáticamente cuando el análisis termina (isAnalyzing = false)
  if (!isAnalyzing) {
    return null;
  }
  const getStatusIcon = () => {
    if (isInterrupted) return <FaExclamationTriangle />;
    // Durante el análisis activo, mostrar spinner
    return <FaSpinner />;
  };
  const getStatusMessage = () => {
    if (isInterrupted) {
      return status;
    }
    // Durante el análisis activo, mostrar progreso
    return `Analizando recursos... ${totalResources} detectados`;
  };
  return (
    <AnalysisStatusContainer 
      isCompleted={false}
      isAnalyzing={isAnalyzing}
      isInterrupted={isInterrupted}
    >
      <StatusIcon 
        isCompleted={false}
        isAnalyzing={isAnalyzing}
        isInterrupted={isInterrupted}
      >
        {getStatusIcon()}
      </StatusIcon>
      
      <StatusText>
        {getStatusMessage()}
      </StatusText>
      
      {totalResources > 0 && (
        <ResourceCount>
          {totalResources}
        </ResourceCount>
      )}
    </AnalysisStatusContainer>
  );
};

export default AnalysisStatus;
