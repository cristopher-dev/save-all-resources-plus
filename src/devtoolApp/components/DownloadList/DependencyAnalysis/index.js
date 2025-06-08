import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from 'devtoolApp/store';
import * as uiActions from 'devtoolApp/store/ui';
import {
  DependencyAnalysisContainer,
  DependencyAnalysisHeader,
  DependencyAnalysisTitle,
  DependencyAnalysisContent,
  DependencySection,
  DependencySectionTitle,
  DependencyStats,
  StatCard,
  StatValue,
  StatLabel,
  DependencyList,
  DependencyItem,
  DependencyItemInfo,
  DependencyItemName,
  DependencyItemType,
  DependencyItemPath,
  DependencyActions,
  CriticalPathContainer,
  CriticalPathTitle,
  CriticalPathList,
  CriticalPathItem,
  AnalysisFilters,
  FilterButton,
  DependencyVisualization,
} from './styles';
import { FaChevronDown, FaProjectDiagram, FaExclamationTriangle, FaSearch, FaDownload, FaStop } from 'react-icons/fa';
import Button from '../../Button';
import { getFileType, getFileExtension } from 'devtoolApp/utils/file';
import { analyzeDependenciesFromList } from './dependencyHelpers';

const RESOURCE_TYPES = ['all', 'css', 'js', 'image', 'font', 'document'];

const DependencyAnalysis = () => {
  const { state, dispatch } = useStore();
  const { downloadList, ui } = state;
  const { isAnalyzing, analysisCompleted } = ui;
  
  const [expanded, setExpanded] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [dependencyTree, setDependencyTree] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisInterrupted, setAnalysisInterrupted] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  // Analizar dependencias de recursos
  const analyzeDependencies = useMemo(() => analyzeDependenciesFromList(downloadList), [downloadList]);

  // Filtrar recursos por tipo
  const filteredDependencies = useMemo(() => {
    if (selectedFilter === 'all') {
      return analyzeDependencies.dependencies;
    }
    
    return Object.entries(analyzeDependencies.dependencies)
      .filter(([_, resource]) => resource.type === selectedFilter)
      .reduce((acc, [url, resource]) => ({ ...acc, [url]: resource }), {});
  }, [analyzeDependencies.dependencies, selectedFilter]);

  // Ejecutar análisis automático solo si el análisis principal ya está completado
  useEffect(() => {
    // Solo ejecutar análisis de dependencias si el análisis principal del UI ya fue completado
    const mainAnalysisCompleted = isAnalyzing || analysisCompleted;
    
    if (downloadList.length > 1 && !analyzing && mainAnalysisCompleted && !analysisInterrupted) {
      setAnalyzing(true);
      dispatch(uiActions.setStatus('Iniciando análisis de dependencias...'));
      
      // Simular tiempo de análisis con posibilidad de interrupción
      const analysisTimeout = setTimeout(() => {
        if (!analysisInterrupted) {
          setDependencyTree(analyzeDependencies.dependencies);
          setAnalyzing(false);
          dispatch(uiActions.setStatus('Análisis de dependencias completado'));
        }
      }, 2000);

      return () => clearTimeout(analysisTimeout);
    }
  }, [downloadList, analyzeDependencies.dependencies, analyzing, isAnalyzing, analysisCompleted, analysisInterrupted, dispatch]);

  const stopAnalysis = () => {
    setAnalysisInterrupted(true);
    setAnalyzing(false);
    dispatch(uiActions.stopAnalysis());
  };

  const restartAnalysis = () => {
    setAnalysisInterrupted(false);
    dispatch(uiActions.setStatus('Reiniciando análisis...'));
    // El useEffect se encargará de reiniciar el análisis
  };

  const exportDependencyReport = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const report = {
      timestamp: new Date().toISOString(),
      mainUrl: downloadList[0]?.url || '',
      statistics: analyzeDependencies.stats,
      dependencies: analyzeDependencies.dependencies,
      criticalPath: analyzeDependencies.criticalPath,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dependency-analysis-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFilterChange = (type) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedFilter(type);
  };

  const handleReanalyze = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setAnalyzing(true);
  };

  const totalResources = downloadList.length - 1;

  return (
    <DependencyAnalysisContainer>
      <DependencyAnalysisHeader expanded={expanded} onClick={toggleExpanded}>
        <DependencyAnalysisTitle>
          <FaProjectDiagram />
          Análisis de Dependencias
          {totalResources > 0 && ` (${totalResources} recursos)`}
        </DependencyAnalysisTitle>
        <FaChevronDown style={{ 
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} />
      </DependencyAnalysisHeader>

      <DependencyAnalysisContent expanded={expanded}>
        {analyzing && (
          <DependencySection>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#666', marginBottom: '16px' }}>
                🔍 Analizando dependencias entre recursos...
              </div>              <Button 
                color="danger" 
                onClick={stopAnalysis}
                loading={analyzing}
                isScanning={analyzing}
              >
                <FaStop style={{ marginRight: '8px' }} />
                Detener Análisis
              </Button>
            </div>
          </DependencySection>
        )}

        {analysisInterrupted && !analyzing && (
          <DependencySection>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '14px', color: '#f39c12', marginBottom: '16px' }}>
                ⚠️ Análisis interrumpido por el usuario
              </div>              <Button 
                color="primary" 
                onClick={restartAnalysis}
                loading={false}
                isScanning={false}
              >
                <FaSearch style={{ marginRight: '8px' }} />
                Reiniciar Análisis
              </Button>
            </div>
          </DependencySection>
        )}

        {!analyzing && !analysisInterrupted && totalResources > 0 && (
          <>
            <DependencySection>
              <DependencySectionTitle>📊 Estadísticas Generales</DependencySectionTitle>
              
              <DependencyStats>
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.totalResources}</StatValue>
                  <StatLabel>Total Recursos</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.cssFiles}</StatValue>
                  <StatLabel>Archivos CSS</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.jsFiles}</StatValue>
                  <StatLabel>Archivos JS</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.images}</StatValue>
                  <StatLabel>Imágenes</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.fonts}</StatValue>
                  <StatLabel>Fuentes</StatLabel>
                </StatCard>
                
                <StatCard>
                  <StatValue>{analyzeDependencies.stats.externalDependencies}</StatValue>
                  <StatLabel>Dependencias Externas</StatLabel>
                </StatCard>
              </DependencyStats>
            </DependencySection>

            {analyzeDependencies.criticalPath.length > 0 && (
              <DependencySection>
                <CriticalPathContainer>
                  <CriticalPathTitle>
                    <FaExclamationTriangle />
                    Ruta Crítica
                  </CriticalPathTitle>
                  <div style={{ fontSize: '12px', marginBottom: '8px', color: '#666' }}>
                    Recursos con mayor impacto en la carga de la página
                  </div>
                  <CriticalPathList>
                    {analyzeDependencies.criticalPath.map((url, index) => (
                      <CriticalPathItem key={index}>
                        {url.split('/').pop() || url}
                      </CriticalPathItem>
                    ))}
                  </CriticalPathList>
                </CriticalPathContainer>
              </DependencySection>
            )}

            <DependencySection>
              <DependencySectionTitle>🔍 Explorar Dependencias</DependencySectionTitle>
              
              <AnalysisFilters>
                {RESOURCE_TYPES.map(type => (
                  <FilterButton
                    key={type}
                    active={selectedFilter === type}
                    onClick={handleFilterChange(type)}
                  >
                    {type === 'all' ? 'Todos' : type.toUpperCase()}
                    {type !== 'all' && ` (${Object.values(analyzeDependencies.dependencies).filter(r => r.type === type).length})`}
                  </FilterButton>
                ))}
              </AnalysisFilters>

              <DependencyList>
                {Object.entries(filteredDependencies).map(([url, resource]) => (
                  <DependencyItem key={url} depth={resource.depth}>
                    <DependencyItemInfo>
                      <DependencyItemName>
                        <DependencyItemType itemType={resource.type}>
                          {resource.type}
                        </DependencyItemType>
                        {url.split('/').pop() || url}
                        {resource.critical && (
                          <span style={{ color: '#ffc107', marginLeft: '8px' }}>⚠️</span>
                        )}
                      </DependencyItemName>
                      <DependencyItemPath>
                        {url.length > 60 ? `${url.substring(0, 60)}...` : url}
                      </DependencyItemPath>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        {resource.dependencies.length} dependencias • {resource.dependents.length} dependientes • Profundidad: {resource.depth}
                      </div>
                    </DependencyItemInfo>
                  </DependencyItem>
                ))}
              </DependencyList>
            </DependencySection>

            <DependencyActions>
              <Button color="primary" onClick={exportDependencyReport}>
                <FaDownload style={{ marginRight: '8px' }} />
                Exportar Reporte
              </Button>
              
              <Button 
                color="secondary" 
                onClick={handleReanalyze}
              >
                <FaSearch style={{ marginRight: '8px' }} />
                Re-analizar
              </Button>
            </DependencyActions>
          </>
        )}

        {!analyzing && totalResources === 0 && (
          <DependencySection>
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <FaProjectDiagram size={32} style={{ marginBottom: '16px', opacity: 0.5 }} />
              <div style={{ fontSize: '14px' }}>
                No hay recursos para analizar.<br />
                Agrega URLs a la lista de descarga para ver el análisis de dependencias.
              </div>
            </div>
          </DependencySection>
        )}
      </DependencyAnalysisContent>
    </DependencyAnalysisContainer>
  );
};

export default DependencyAnalysis;
