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
  const analyzeDependencies = useMemo(() => {
    if (downloadList.length <= 1) return { dependencies: {}, stats: {}, criticalPath: [] };

    const resources = downloadList.slice(1); // Excluir la página principal
    const dependencies = {};
    const stats = {
      totalResources: resources.length,
      cssFiles: 0,
      jsFiles: 0,
      images: 0,
      fonts: 0,
      documents: 0,
      externalDependencies: 0,
      circularDependencies: 0,
    };

    // Analizar cada recurso
    resources.forEach((resource, index) => {
      const url = new URL(resource.url);
      const fileType = getFileType(resource.url);
      const extension = getFileExtension(resource.url);
      
      // Contar tipos de archivo
      switch (fileType) {
        case 'css': stats.cssFiles++; break;
        case 'javascript': stats.jsFiles++; break;
        case 'images': stats.images++; break;
        case 'fonts': stats.fonts++; break;
        case 'documents': stats.documents++; break;
      }

      // Determinar dependencias basadas en el tipo de archivo y URL
      const resourceDeps = [];
      
      // CSS puede depender de imágenes y fuentes
      if (fileType === 'css') {
        const cssImages = resources.filter(r => 
          getFileType(r.url) === 'images' && 
          new URL(r.url).hostname === url.hostname
        );
        const cssFonts = resources.filter(r => 
          getFileType(r.url) === 'fonts' && 
          new URL(r.url).hostname === url.hostname
        );
        resourceDeps.push(...cssImages.map(r => r.url), ...cssFonts.map(r => r.url));
      }

      // JavaScript puede depender de otros recursos
      if (fileType === 'javascript') {
        const jsImages = resources.filter(r => 
          getFileType(r.url) === 'images' && 
          new URL(r.url).hostname === url.hostname
        );
        resourceDeps.push(...jsImages.map(r => r.url));
      }

      // Detectar dependencias externas
      const mainDomain = downloadList[0] ? new URL(downloadList[0].url).hostname : '';
      if (url.hostname !== mainDomain) {
        stats.externalDependencies++;
      }

      dependencies[resource.url] = {
        type: fileType,
        extension,
        domain: url.hostname,
        size: resource.size || 0,
        dependencies: resourceDeps,
        dependents: [],
        depth: 0,
        critical: false,
      };
    });

    // Calcular dependientes inversos
    Object.keys(dependencies).forEach(resourceUrl => {
      dependencies[resourceUrl].dependencies.forEach(depUrl => {
        if (dependencies[depUrl]) {
          dependencies[depUrl].dependents.push(resourceUrl);
        }
      });
    });

    // Calcular profundidad de dependencias
    const calculateDepth = (url, visited = new Set()) => {
      if (visited.has(url)) {
        stats.circularDependencies++;
        return 0;
      }
      
      visited.add(url);
      const resource = dependencies[url];
      if (!resource || resource.dependencies.length === 0) {
        return 0;
      }
      
      const maxDepth = Math.max(
        ...resource.dependencies.map(depUrl => calculateDepth(depUrl, new Set(visited)))
      );
      
      resource.depth = maxDepth + 1;
      return resource.depth;
    };

    Object.keys(dependencies).forEach(url => {
      calculateDepth(url);
    });

    // Identificar ruta crítica (recursos con más dependientes)
    const criticalPath = Object.entries(dependencies)
      .filter(([_, resource]) => resource.dependents.length > 2 || resource.depth > 3)
      .sort((a, b) => b[1].dependents.length - a[1].dependents.length)
      .slice(0, 5)
      .map(([url, resource]) => {
        dependencies[url].critical = true;
        return url;
      });

    return { dependencies, stats, criticalPath };
  }, [downloadList]);

  // Filtrar recursos por tipo
  const filteredDependencies = useMemo(() => {
    if (selectedFilter === 'all') {
      return analyzeDependencies.dependencies;
    }
    
    return Object.entries(analyzeDependencies.dependencies)
      .filter(([_, resource]) => resource.type === selectedFilter)
      .reduce((acc, [url, resource]) => ({ ...acc, [url]: resource }), {});
  }, [analyzeDependencies.dependencies, selectedFilter]);

  // Ejecutar análisis automático
  useEffect(() => {
    if (downloadList.length > 1 && !analyzing && !analysisCompleted && !analysisInterrupted) {
      setAnalyzing(true);
      dispatch(uiActions.setStatus('Iniciando análisis de dependencias...'));
      
      // Simular tiempo de análisis con posibilidad de interrupción
      const analysisTimeout = setTimeout(() => {
        if (!analysisInterrupted) {
          setDependencyTree(analyzeDependencies.dependencies);
          setAnalyzing(false);
          dispatch(uiActions.setAnalysisCompleted());
          dispatch(uiActions.setStatus('Análisis de dependencias completado'));
        }
      }, 2000);

      return () => clearTimeout(analysisTimeout);
    }
  }, [downloadList, analyzeDependencies.dependencies, analyzing, analysisCompleted, analysisInterrupted, dispatch]);

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

  const exportDependencyReport = () => {
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
              </div>
              <Button color="danger" onClick={stopAnalysis}>
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
              </div>
              <Button color="primary" onClick={restartAnalysis}>
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
                    onClick={() => setSelectedFilter(type)}
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
                onClick={() => setAnalyzing(true)}
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
