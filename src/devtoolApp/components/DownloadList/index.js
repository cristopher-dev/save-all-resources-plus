import React, { useMemo, useState, useCallback } from 'react';
import {
  AddButtonWrapper,
  DownloadListHeader,
  DownloadListItemWrapper,
  DownloadListContainer,
  DownloadListWrapper,
  DownloadListItemUrl,
  DownloadListButtonGroup,
  Spinner,
  CustomCheckbox,
  FileTypeIndicator,
  Tooltip,
  StatusBadge,
  CircularProgress,
} from './styles';
import { useStore } from 'devtoolApp/store';
import Button from '../Button';
import { withTheme } from 'styled-components';
import ParserModal from './ParserModal';
import * as downloadListActions from 'devtoolApp/store/downloadList';
import * as uiActions from 'devtoolApp/store/ui';
import LogSection from './LogSection';
import OptionSection from './OptionSection';
import AnalysisStatus from '../AnalysisStatus';
import { FaTrash, FaCheckSquare, FaSquare, FaFileAlt, FaImage, FaCode, FaFont, FaPlayCircle, FaInfoCircle, FaBars, FaEye } from 'react-icons/fa';

// Función para obtener el tipo de archivo y su icono
const getFileInfo = (url) => {
  const fileName = url.split('/').pop() || '';
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const fileTypes = {
    images: { 
      extensions: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
      icon: '🖼️',
      color: '#ef4444',
      label: 'Imagen'
    },
    styles: { 
      extensions: ['css', 'scss', 'sass', 'less'],
      icon: '🎨',
      color: '#10b981',
      label: 'Estilos'
    },
    scripts: { 
      extensions: ['js', 'ts', 'jsx', 'tsx', 'mjs'],
      icon: '⚡',
      color: '#f59e0b',
      label: 'Script'
    },
    fonts: { 
      extensions: ['woff', 'woff2', 'ttf', 'eot', 'otf'],
      icon: '🔤',
      color: '#8b5cf6',
      label: 'Fuente'
    },
    documents: { 
      extensions: ['html', 'htm', 'xml', 'pdf', 'txt', 'md'],
      icon: '📄',
      color: '#3b82f6',
      label: 'Documento'
    },
    data: { 
      extensions: ['json', 'xml', 'csv', 'yaml', 'yml'],
      icon: '📊',
      color: '#06b6d4',
      label: 'Datos'
    }
  };

  for (const [type, config] of Object.entries(fileTypes)) {
    if (config.extensions.includes(extension)) {
      return { type, ...config, extension };
    }
  }

  return { 
    type: 'other', 
    icon: '📁', 
    color: '#6b7280', 
    label: 'Archivo',
    extension 
  };
};

export const DownloadList = () => {
  const { state, dispatch } = useStore();
  const {
    downloadList,
    downloadLog,
    ui: { tab, log, isSaving, savingIndex, selectedResources = {} },
    staticResource = [],
    networkResource = [],
  } = state;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    images: true,
    styles: true,
    scripts: true,
    fonts: true,
    documents: true,
    data: true,
    other: true
  });
  
  const handleClose = useMemo(
    () => (event) => {
      if (event) event.stopPropagation();
      setIsModalOpen(false);
    },
    []
  );
  
  const handleOpen = useCallback((event) => {
    event.stopPropagation();
    setIsModalOpen(true);
  }, []);
  
  const handleReset = useCallback((event) => {
    event.stopPropagation();
    // Reset download list (except main page)
    downloadList.slice(1).forEach((item) => dispatch(downloadListActions.removeDownloadItem(item)));
    // Reset analysis and UI state
    dispatch(uiActions.resetAnalysis());
  }, [downloadList, dispatch]);
  
  const handleRemove = useCallback((item) => (event) => {
    event.stopPropagation();
    dispatch(downloadListActions.removeDownloadItem(item));
  }, [dispatch]);
  
  const handleLog = useCallback((currentLog) => (event) => {
    event.stopPropagation();
    if (log?.url === currentLog?.url) {
      return dispatch(uiActions.setLog());
    }
    dispatch(uiActions.setLog(currentLog));
  }, [log, dispatch]);

  const handleCheckboxChange = useCallback((url) => {
    dispatch(uiActions.toggleResourceSelection(url));
  }, [dispatch]);
  const handleSelectAll = useCallback((event) => {
    event.stopPropagation();
    const allUrls = downloadList.reduce((acc, item) => {
      const fileInfo = getFileInfo(item.url);
      // Solo seleccionar recursos de tipos de filtros activos
      if (activeFilters[fileInfo.type]) {
        acc[item.url] = true;
      }
      return acc;
    }, {});
    dispatch(uiActions.setSelectedResources(allUrls));
  }, [downloadList, activeFilters, dispatch]);
  const handleDeselectAll = useCallback((event) => {
    event.stopPropagation();
    dispatch(uiActions.clearSelectedResources());
  }, [dispatch]);
  const handleFilterToggle = useCallback((filterType) => {
    const newFilterState = !activeFilters[filterType];
    
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: newFilterState
    }));

    // Si el filtro se desactiva, desmarcar todos los recursos de ese tipo
    if (!newFilterState) {
      const urlsToDeselect = downloadList
        .filter(item => {
          const fileInfo = getFileInfo(item.url);
          return fileInfo.type === filterType;
        })
        .map(item => item.url);

      if (urlsToDeselect.length > 0) {
        const newSelectedResources = { ...selectedResources };
        urlsToDeselect.forEach(url => {
          delete newSelectedResources[url];
        });
        dispatch(uiActions.setSelectedResources(newSelectedResources));
      }
    }
  }, [activeFilters, downloadList, selectedResources, dispatch]);

  const handleFilterAll = useCallback(() => {
    setActiveFilters({
      images: true,
      styles: true,
      scripts: true,
      fonts: true,
      documents: true,
      data: true,
      other: true
    });
  }, []);
  const handleFilterNone = useCallback(() => {
    setActiveFilters({
      images: false,
      styles: false,
      scripts: false,
      fonts: false,
      documents: false,
      data: false,
      other: false
    });
    
    // Desmarcar todos los recursos cuando se desactivan todos los filtros
    dispatch(uiActions.clearSelectedResources());
  }, [dispatch]);
  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const totalCount = downloadList.length;
  // Filtrar lista por tipos activos
  const filteredDownloadList = useMemo(() => {
    return downloadList.filter(item => {
      const fileInfo = getFileInfo(item.url);
      return activeFilters[fileInfo.type];
    });
  }, [downloadList, activeFilters]);

  const filteredSelectedCount = Object.entries(selectedResources)
    .filter(([url, selected]) => {
      if (!selected) return false;
      const item = downloadList.find(item => item.url === url);
      if (!item) return false;
      const fileInfo = getFileInfo(item.url);
      return activeFilters[fileInfo.type];
    }).length;
  const allResources = useMemo(() => [...staticResource, ...networkResource], [staticResource, networkResource]);
  // Estadísticas por tipo de archivo
  const fileStats = useMemo(() => {
    const stats = {};
    downloadList.forEach(item => {
      const fileInfo = getFileInfo(item.url);
      if (!stats[fileInfo.type]) {
        stats[fileInfo.type] = { count: 0, selected: 0, filtered: 0, ...fileInfo };
      }
      stats[fileInfo.type].count++;
      if (selectedResources[item.url]) {
        stats[fileInfo.type].selected++;
      }
      if (activeFilters[fileInfo.type]) {
        stats[fileInfo.type].filtered++;
      }
    });
    return stats;
  }, [downloadList, selectedResources, activeFilters]);

  return (
    <DownloadListWrapper>
      <AnalysisStatus /> <OptionSection />
      <DownloadListHeader>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          background: 'linear-gradient(135deg, rgba(18, 131, 195, 0.1), rgba(16, 185, 129, 0.1))',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Header principal con título e iconos */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #1283c3, #10b981)',
                padding: '8px',
                borderRadius: '8px',
                color: 'white'
              }}>
                <FaBars size={16} />
              </div>
              <h3 style={{ 
                margin: 0, 
                fontSize: '18px', 
                fontWeight: '600',
                color: 'white',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                📋 Lista de Recursos
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaInfoCircle 
                size={14} 
                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'help' }}
                title="Selecciona los recursos que deseas descargar"
              />
              <FaEye 
                size={14} 
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
            </div>
          </div>          {/* Estadísticas visuales mejoradas */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.1
              }}>
                <CircularProgress percentage={totalCount > 0 ? (totalCount / 100) * 100 : 0} />
              </div>              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#60a5fa',
                textShadow: '0 0 10px rgba(96, 165, 250, 0.3)',
                position: 'relative',
                zIndex: 1
              }}>
                {filteredDownloadList.length}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>
                Recursos Visibles
              </div>
            </div>
            
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ 
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.1
              }}>
                <CircularProgress percentage={totalCount > 0 ? (selectedCount / totalCount) * 100 : 0} />
              </div>              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: filteredSelectedCount > 0 ? '#34d399' : 'rgba(255, 255, 255, 0.5)',
                textShadow: filteredSelectedCount > 0 ? '0 0 10px rgba(52, 211, 153, 0.3)' : 'none',
                position: 'relative',
                zIndex: 1
              }}>
                {filteredSelectedCount}
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>
                Seleccionados
              </div>
            </div>

            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: filteredSelectedCount > 0 ? '#fbbf24' : 'rgba(255, 255, 255, 0.5)',
                textShadow: filteredSelectedCount > 0 ? '0 0 10px rgba(251, 191, 36, 0.3)' : 'none'
              }}>
                {filteredDownloadList.length > 0 ? Math.round((filteredSelectedCount / filteredDownloadList.length) * 100) : 0}%
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.8)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: '500'
              }}>
                Progreso
              </div>
            </div>

            {/* Mostrar estadísticas por tipo de archivo */}
            {Object.entries(fileStats).slice(0, 2).map(([type, stats]) => (
              <div key={type} style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: stats.color,
                  textShadow: `0 0 10px ${stats.color}30`
                }}>
                  {stats.icon} {stats.count}
                </div>
                <div style={{ 
                  fontSize: '10px', 
                  color: 'rgba(255, 255, 255, 0.8)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  {stats.label}s
                </div>
              </div>
            ))}
          </div>

          {/* Barra de estado con texto mejorado */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>            <span style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '13px', 
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FaFileAlt size={12} />
              {filteredSelectedCount > 0 
                ? `${filteredSelectedCount} de ${filteredDownloadList.length} recursos seleccionados` 
                : `${filteredDownloadList.length} recursos visibles para descarga`
              }
            </span>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button 
                color="secondary" 
                onClick={handleSelectAll} 
                style={{ 
                  fontSize: '11px', 
                  padding: '6px 12px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(16, 185, 129, 0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaCheckSquare style={{ marginRight: '6px' }} />
                Todos
              </Button>
              <Button 
                color="secondary" 
                onClick={handleDeselectAll} 
                style={{ 
                  fontSize: '11px', 
                  padding: '6px 12px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontWeight: '500',
                  transition: 'all 0.3s ease',
                  borderRadius: '6px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.3)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <FaSquare style={{ marginRight: '6px' }} />
                Ninguno
              </Button>
            </div>          </div>
        </div>

        {/* Sección de Filtros */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                padding: '6px',
                borderRadius: '6px',
                color: 'white'
              }}>
                🔍
              </div>
              <span style={{ 
                color: 'white', 
                fontSize: '14px', 
                fontWeight: '600' 
              }}>
                Filtros por Tipo
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button 
                color="secondary" 
                onClick={handleFilterAll}
                style={{ 
                  fontSize: '10px', 
                  padding: '4px 8px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399',
                  fontWeight: '500'
                }}
              >
                Todos
              </Button>
              <Button 
                color="secondary" 
                onClick={handleFilterNone}
                style={{ 
                  fontSize: '10px', 
                  padding: '4px 8px',
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  fontWeight: '500'
                }}
              >
                Ninguno
              </Button>
            </div>
          </div>          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
            gap: '8px'
          }}>
            {Object.entries(fileStats).map(([type, stats]) => (
              <div
                key={type}
                onClick={() => handleFilterToggle(type)}
                style={{
                  background: activeFilters[type] 
                    ? `linear-gradient(135deg, ${stats.color}20, ${stats.color}10)` 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: activeFilters[type] 
                    ? `1px solid ${stats.color}40` 
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '10px 8px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  opacity: activeFilters[type] ? 1 : 0.6,
                  transform: activeFilters[type] ? 'scale(1)' : 'scale(0.96)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = activeFilters[type] ? 'scale(1)' : 'scale(0.96)';
                }}
              >
                {/* Indicador de check para filtro activo */}
                {activeFilters[type] && (
                  <div style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: stats.color,
                    borderRadius: '50%',
                    width: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: `0 0 8px ${stats.color}50`,
                    animation: 'checkPulse 0.3s ease-out'
                  }}>
                    ✓
                  </div>
                )}
                
                <div style={{ 
                  fontSize: '16px', 
                  marginBottom: '4px',
                  filter: activeFilters[type] ? 'none' : 'grayscale(100%)',
                  position: 'relative'
                }}>
                  {stats.icon}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  fontWeight: '600',
                  color: activeFilters[type] ? stats.color : 'rgba(255, 255, 255, 0.5)',
                  marginBottom: '2px'
                }}>
                  {stats.count}
                </div>
                <div style={{ 
                  fontSize: '9px', 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  {stats.label}
                </div>
                {stats.selected > 0 && (
                  <div style={{ 
                    fontSize: '8px', 
                    color: '#34d399',
                    marginTop: '2px',
                    fontWeight: '600'
                  }}>
                    ✓ {stats.selected}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contador de filtros aplicados */}
          <div style={{ 
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            Mostrando {filteredDownloadList.length} de {totalCount} recursos
            {filteredSelectedCount > 0 && (
              <span style={{ color: '#34d399', marginLeft: '8px' }}>
                • {filteredSelectedCount} seleccionados
              </span>
            )}
          </div>
        </div>
      </DownloadListHeader>      <DownloadListContainer>        {filteredDownloadList.map((item, index) => {
          if (!item) return null; // Protección contra item nulo
          const foundLog = downloadLog.find((i) => i.url === item.url);
          const logExpanded = log && log.url === item.url;
          const isChecked = selectedResources[item.url] || false;
          const originalIndex = downloadList.findIndex(originalItem => originalItem.url === item.url);
          
          return (
            <React.Fragment key={item.url}>
              <DownloadListItemWrapper highlighted={tab && item.url === tab.url} done={!!foundLog} logExpanded={logExpanded}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  <CustomCheckbox
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(item.url)}
                    disabled={isSaving}
                  />
                  <FileTypeIndicator url={item.url} />
                  <Tooltip data-tooltip={item.url}>
                    <DownloadListItemUrl active={isSaving === item.url}>
                      {item.url.length > 60 ? `${item.url.substring(0, 60)}...` : item.url}
                    </DownloadListItemUrl>
                  </Tooltip>
                </div>
                <DownloadListButtonGroup>
                  {!isSaving && foundLog && (
                    <Button 
                      color={`secondary`} 
                      onClick={handleLog(foundLog)}
                      style={{
                        background: logExpanded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        borderColor: logExpanded ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        color: logExpanded ? '#f87171' : '#34d399'
                      }}
                    >
                      {logExpanded ? `🙈 Ocultar Log` : `👁️ Ver Log`}
                    </Button>
                  )}
                  {!isSaving && originalIndex !== 0 && (
                    <Button 
                      color={`danger`} 
                      onClick={handleRemove(item)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: '#f87171'
                      }}
                    >
                      <FaTrash />
                    </Button>
                  )}
                  {isSaving && savingIndex === originalIndex && (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      background: 'rgba(251, 191, 36, 0.2)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid rgba(251, 191, 36, 0.3)'
                    }}>
                      <Spinner />
                      <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '500' }}>
                        Descargando...
                      </span>
                    </div>
                  )}
                </DownloadListButtonGroup>
              </DownloadListItemWrapper>
            </React.Fragment>
          );
        })}
      </DownloadListContainer>
      <ParserModal isOpen={isModalOpen} onClose={handleClose} />
    </DownloadListWrapper>
  );
};

export default withTheme(DownloadList);
