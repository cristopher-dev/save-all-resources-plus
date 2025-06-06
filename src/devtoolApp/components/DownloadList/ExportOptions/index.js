import React, { useState, useMemo, useCallback } from 'react';
import { useStore } from 'devtoolApp/store';
import { 
  downloadZipFile, 
  resolveDuplicatedResources, 
  applyAdvancedFilters, 
  getFileType,
  exportResources,
  groupResourcesByType
} from '../../../utils/file';
import { 
  FaDownload, 
  FaFileArchive, 
  FaLayerGroup, 
  FaFile, 
  FaChevronDown,
  FaCheck,
  FaSpinner,
  FaCog,
  FaFilter
} from 'react-icons/fa';
import Button from '../../Button';
import {
  ExportContainer,
  ExportHeader,
  ExportTitle,
  ExportContent,
  ExportSection,
  ExportSectionTitle,
  ExportOptionsContainer,
  ExportOption,
  OptionIcon,
  OptionContent,
  OptionTitle,
  OptionDescription,
  GroupSelection,
  GroupItem,
  GroupCheckbox,
  GroupLabel,
  GroupStats,
  ExportActions,
  ActionButton,
  ProgressContainer,
  ProgressBar,
  ProgressText,
  ConfigSection,
  ConfigRow,
  ConfigLabel,
  ConfigSelect,
  ConfigCheckbox
} from './styles';

const RESOURCE_GROUPS = {
  all: {
    name: 'Todos los recursos',
    description: 'Descargar todos los recursos disponibles',
    icon: FaFileArchive,
    color: '#667eea'
  },
  images: {
    name: 'Imágenes',
    description: 'JPG, PNG, GIF, SVG, WebP, etc.',
    icon: FaFile,
    color: '#ff6b6b'
  },
  styles: {
    name: 'Estilos',
    description: 'CSS, SCSS, LESS',
    icon: FaFile,
    color: '#4ecdc4'
  },
  scripts: {
    name: 'Scripts',
    description: 'JavaScript, TypeScript',
    icon: FaFile,
    color: '#45b7d1'
  },
  fonts: {
    name: 'Fuentes',
    description: 'TTF, WOFF, WOFF2, OTF',
    icon: FaFile,
    color: '#96ceb4'
  },
  documents: {
    name: 'Documentos',
    description: 'HTML, PDF, TXT, JSON',
    icon: FaFile,
    color: '#ffeaa7'
  },
  media: {
    name: 'Media',
    description: 'Videos, audio y otros medios',
    icon: FaFile,
    color: '#fd79a8'
  }
};

const ExportOptions = () => {
  const { state, dispatch } = useStore();
  const { networkResource = [], staticResource = [], option } = state;
  
  const [expanded, setExpanded] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState(['all']);
  const [exportMode, setExportMode] = useState('global'); // 'global', 'individual', 'groups'
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState('zip');
  const [separateFiles, setSeparateFiles] = useState(false);

  // Combinar todos los recursos
  const allResources = useMemo(() => {
    return [...networkResource, ...staticResource];
  }, [networkResource, staticResource]);

  // Agrupar recursos por tipo
  const groupedResources = useMemo(() => {
    const groups = {};
    
    allResources.forEach(resource => {
      const type = getFileType(resource.url, resource.mimeType);
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(resource);
    });

    return groups;
  }, [allResources]);

  // Estadísticas por grupo
  const groupStats = useMemo(() => {
    const stats = {};
    
    Object.keys(RESOURCE_GROUPS).forEach(groupKey => {
      if (groupKey === 'all') {
        stats[groupKey] = {
          count: allResources.length,
          size: allResources.reduce((acc, res) => acc + (res.content?.length || 0), 0)
        };
      } else {
        const resources = groupedResources[groupKey] || [];
        stats[groupKey] = {
          count: resources.length,
          size: resources.reduce((acc, res) => acc + (res.content?.length || 0), 0)
        };
      }
    });

    return stats;
  }, [allResources, groupedResources]);

  // Formatear tamaño
  const formatSize = useCallback((bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Manejar selección de grupos
  const handleGroupToggle = useCallback((groupKey) => {
    if (groupKey === 'all') {
      setSelectedGroups(['all']);
    } else {
      setSelectedGroups(prev => {
        const filtered = prev.filter(key => key !== 'all');
        if (filtered.includes(groupKey)) {
          return filtered.filter(key => key !== groupKey);
        } else {
          return [...filtered, groupKey];
        }
      });
    }
  }, []);

  // Obtener recursos seleccionados
  const getSelectedResources = useCallback(() => {
    if (selectedGroups.includes('all')) {
      return allResources;
    }
    
    const selected = [];
    selectedGroups.forEach(groupKey => {
      if (groupedResources[groupKey]) {
        selected.push(...groupedResources[groupKey]);
      }
    });
    
    return selected;
  }, [selectedGroups, allResources, groupedResources]);

  // Descarga global
  const handleGlobalDownload = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const resources = getSelectedResources();
      const filteredResources = applyAdvancedFilters(resources, option.advancedFilters);
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
      console.error('Error en descarga global:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [getSelectedResources, option]);

  // Descarga individual
  const handleIndividualDownload = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const resources = getSelectedResources();
      const filteredResources = applyAdvancedFilters(resources, option.advancedFilters);
      
      for (let i = 0; i < filteredResources.length; i++) {
        const resource = filteredResources[i];
        const progress = Math.round((i + 1) / filteredResources.length * 100);
        setExportProgress(progress);

        // Descargar archivo individual
        if (resource.content) {
          const blob = new Blob([resource.content]);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = resource.saveAs?.name || resource.url.split('/').pop() || 'resource';
          a.click();
          URL.revokeObjectURL(url);
          
          // Pausa pequeña entre descargas para evitar bloqueos del navegador
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error en descarga individual:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [getSelectedResources, option]);

  // Descarga por grupos
  const handleGroupDownload = useCallback(async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      const totalGroups = selectedGroups.filter(key => key !== 'all').length;
      
      for (let i = 0; i < totalGroups; i++) {
        const groupKey = selectedGroups[i];
        const groupResources = groupedResources[groupKey] || [];
        const filteredResources = applyAdvancedFilters(groupResources, option.advancedFilters);
        const toDownload = resolveDuplicatedResources(filteredResources);
        
        if (toDownload.length > 0) {
          await new Promise((resolve) => {
            downloadZipFile(
              toDownload,
              { 
                ignoreNoContentFile: option.ignoreNoContentFile, 
                beautifyFile: option.beautifyFile 
              },
              (item, isDone) => {
                // Progreso por grupo
              },
              () => {
                resolve();
              }
            );
          });
        }
        
        const progress = Math.round((i + 1) / totalGroups * 100);
        setExportProgress(progress);
      }
    } catch (error) {
      console.error('Error en descarga por grupos:', error);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [selectedGroups, groupedResources, option]);

  // Manejar descarga según el modo
  const handleDownload = useCallback(() => {
    switch (exportMode) {
      case 'individual':
        return handleIndividualDownload();
      case 'groups':
        return handleGroupDownload();
      default:
        return handleGlobalDownload();
    }
  }, [exportMode, handleGlobalDownload, handleIndividualDownload, handleGroupDownload]);

  const selectedResourcesCount = getSelectedResources().length;

  return (
    <ExportContainer>
      <ExportHeader onClick={() => setExpanded(!expanded)}>
        <ExportTitle>
          <FaDownload />
          Opciones de Exportación
          {selectedResourcesCount > 0 && ` (${selectedResourcesCount} recursos)`}
        </ExportTitle>
        <FaChevronDown style={{ 
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} />
      </ExportHeader>

      <ExportContent expanded={expanded}>
        <ExportSection>
          <ExportSectionTitle>📥 Modo de Exportación</ExportSectionTitle>
          
          <ExportOptionsContainer>
            <ExportOption 
              selected={exportMode === 'global'}
              onClick={() => setExportMode('global')}
            >
              <OptionIcon>
                <FaFileArchive />
              </OptionIcon>
              <OptionContent>
                <OptionTitle>Descarga Global</OptionTitle>
                <OptionDescription>
                  Un solo archivo ZIP con todos los recursos seleccionados
                </OptionDescription>
              </OptionContent>
            </ExportOption>

            <ExportOption 
              selected={exportMode === 'individual'}
              onClick={() => setExportMode('individual')}
            >
              <OptionIcon>
                <FaFile />
              </OptionIcon>
              <OptionContent>
                <OptionTitle>Descarga Individual</OptionTitle>
                <OptionDescription>
                  Cada recurso se descarga como archivo separado
                </OptionDescription>
              </OptionContent>
            </ExportOption>

            <ExportOption 
              selected={exportMode === 'groups'}
              onClick={() => setExportMode('groups')}
            >
              <OptionIcon>
                <FaLayerGroup />
              </OptionIcon>
              <OptionContent>
                <OptionTitle>Descarga por Grupos</OptionTitle>
                <OptionDescription>
                  Un archivo ZIP por cada tipo de recurso
                </OptionDescription>
              </OptionContent>
            </ExportOption>
          </ExportOptionsContainer>
        </ExportSection>

        <ExportSection>
          <ExportSectionTitle>🗂️ Selección de Recursos</ExportSectionTitle>
          
          <GroupSelection>
            {Object.entries(RESOURCE_GROUPS).map(([key, group]) => {
              const stats = groupStats[key];
              const isSelected = selectedGroups.includes(key);
              const IconComponent = group.icon;
              
              return (
                <GroupItem 
                  key={key} 
                  selected={isSelected}
                  onClick={() => handleGroupToggle(key)}
                >
                  <GroupCheckbox>
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => {}}
                    />
                    <FaCheck />
                  </GroupCheckbox>
                  
                  <div style={{ flex: 1 }}>
                    <GroupLabel color={group.color}>
                      <IconComponent />
                      {group.name}
                    </GroupLabel>
                    <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                      {group.description}
                    </div>
                  </div>
                  
                  <GroupStats>
                    <div>{stats.count} archivos</div>
                    <div>{formatSize(stats.size)}</div>
                  </GroupStats>
                </GroupItem>
              );
            })}
          </GroupSelection>
        </ExportSection>

        <ConfigSection>
          <ExportSectionTitle>⚙️ Configuración</ExportSectionTitle>
          
          <ConfigRow>
            <ConfigLabel>Formato:</ConfigLabel>
            <ConfigSelect 
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="zip">ZIP</option>
              <option value="tar">TAR</option>
              <option value="7z">7Z</option>
            </ConfigSelect>
          </ConfigRow>

          <ConfigRow>
            <ConfigCheckbox>
              <input 
                type="checkbox"
                checked={separateFiles}
                onChange={(e) => setSeparateFiles(e.target.checked)}
              />
              <span>Mantener archivos separados por dominio</span>
            </ConfigCheckbox>
          </ConfigRow>
        </ConfigSection>

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
            disabled={isExporting || selectedResourcesCount === 0}
          >
            {isExporting ? (
              <>
                <FaSpinner className="spinning" />
                Exportando...
              </>
            ) : (
              <>
                <FaDownload />
                Exportar {selectedResourcesCount} recursos
              </>
            )}
          </ActionButton>
          
          <ActionButton 
            onClick={() => setSelectedGroups(['all'])}
            disabled={isExporting}
          >
            <FaCheck />
            Seleccionar todo
          </ActionButton>
        </ExportActions>
      </ExportContent>
    </ExportContainer>
  );
};

export default ExportOptions;
