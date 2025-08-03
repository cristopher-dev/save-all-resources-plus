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
import DownloadSettings from '../DownloadSettings';
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

// Función para obtener el tamaño estimado de un archivo
const getEstimatedFileSize = (resource) => {
  if (resource.content) {
    return resource.content.length;
  }
  // Estimación basada en la extensión
  const fileInfo = getFileInfo(resource.url);
  const sizeEstimates = {
    images: 150000, // ~150KB
    styles: 50000,  // ~50KB
    scripts: 100000, // ~100KB
    fonts: 75000,   // ~75KB
    documents: 25000, // ~25KB
    data: 10000,    // ~10KB
    other: 50000    // ~50KB
  };
  return sizeEstimates[fileInfo.type] || 50000;
};

// Función para categorizar por tamaño
const getSizeCategory = (size) => {
  if (size < 50000) return 'small';   // < 50KB
  if (size < 200000) return 'medium'; // 50KB - 200KB
  return 'large';                     // > 200KB
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
  const [searchTerm, setSearchTerm] = useState('');
  const [sizeFilter, setSizeFilter] = useState('all'); // all, small, medium, large
  const [sortBy, setSortBy] = useState('name'); // name, size, type
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
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

  // Si downloadList está vacío, usar recursos detectados automáticamente como fallback
  const displayList = useMemo(() => {
    if (downloadList.length > 0) {
      return downloadList;
    }
    // Crear elementos de lista a partir de recursos detectados
    const autoDetectedResources = [...staticResource, ...networkResource];
    return autoDetectedResources.map(resource => ({
      url: resource.url,
      // Agregar propiedades adicionales si es necesario
    }));
  }, [downloadList, staticResource, networkResource]);

  const handleSelectAll = useCallback((event) => {
    event.stopPropagation();
    const allUrls = displayList.reduce((acc, item) => {
      const fileInfo = getFileInfo(item.url);
      // Solo seleccionar recursos de tipos de filtros activos
      if (activeFilters[fileInfo.type]) {
        acc[item.url] = true;
      }
      return acc;
    }, {});
    dispatch(uiActions.setSelectedResources(allUrls));
  }, [displayList, activeFilters, dispatch]);
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
      const urlsToDeselect = displayList
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
  }, [activeFilters, displayList, selectedResources, dispatch]);

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

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleSizeFilterChange = useCallback((newSizeFilter) => {
    setSizeFilter(newSizeFilter);
  }, []);

  const handleSortChange = useCallback((newSort) => {
    setSortBy(newSort);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSizeFilter('all');
    setSortBy('name');
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
  const selectedCount = Object.values(selectedResources).filter(Boolean).length;
  const totalCount = displayList.length; // Usar displayList en lugar de downloadList
  
  // Debug: Log del estado actual
  console.log('[DOWNLOAD LIST DEBUG]:', {
    downloadListLength: downloadList.length,
    staticResourceLength: staticResource.length,
    networkResourceLength: networkResource.length,
    downloadList: downloadList.map(item => ({ url: item.url })).slice(0, 3), // Solo primeros 3 para debug
    staticResourceUrls: staticResource.map(item => item.url).slice(0, 3),
    networkResourceUrls: networkResource.map(item => item.url).slice(0, 3)
  });
  
  // Filtrar lista por tipos activos, búsqueda y filtros avanzados
  const filteredDownloadList = useMemo(() => {
    let filtered = displayList.filter(item => {
      const fileInfo = getFileInfo(item.url);
      
      // Filtro por tipo
      if (!activeFilters[fileInfo.type]) return false;
      
      // Filtro por búsqueda de texto
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const fileName = item.url.split('/').pop() || '';
        const urlMatch = item.url.toLowerCase().includes(searchLower);
        const fileNameMatch = fileName.toLowerCase().includes(searchLower);
        const extensionMatch = fileInfo.extension.toLowerCase().includes(searchLower);
        const typeMatch = fileInfo.label.toLowerCase().includes(searchLower);
        
        if (!urlMatch && !fileNameMatch && !extensionMatch && !typeMatch) {
          return false;
        }
      }
      
      // Filtro por tamaño
      if (sizeFilter !== 'all') {
        const resource = [...staticResource, ...networkResource].find(r => r.url === item.url);
        if (resource) {
          const size = getEstimatedFileSize(resource);
          const sizeCategory = getSizeCategory(size);
          if (sizeCategory !== sizeFilter) return false;
        }
      }
      
      return true;
    });
    
    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'size':
          const resourceA = [...staticResource, ...networkResource].find(r => r.url === a.url);
          const resourceB = [...staticResource, ...networkResource].find(r => r.url === b.url);
          const sizeA = resourceA ? getEstimatedFileSize(resourceA) : 0;
          const sizeB = resourceB ? getEstimatedFileSize(resourceB) : 0;
          return sizeB - sizeA; // Descendente
        case 'type':
          const typeA = getFileInfo(a.url).label;
          const typeB = getFileInfo(b.url).label;
          return typeA.localeCompare(typeB);
        case 'name':
        default:
          const nameA = a.url.split('/').pop() || a.url;
          const nameB = b.url.split('/').pop() || b.url;
          return nameA.localeCompare(nameB);
      }
    });
    
    return filtered;
  }, [displayList, activeFilters, searchTerm, sizeFilter, sortBy, staticResource, networkResource]);

  const filteredSelectedCount = Object.entries(selectedResources)
    .filter(([url, selected]) => {
      if (!selected) return false;
      const item = displayList.find(item => item.url === url);
      if (!item) return false;
      const fileInfo = getFileInfo(item.url);
      return activeFilters[fileInfo.type];
    }).length;
  const allResources = useMemo(() => [...staticResource, ...networkResource], [staticResource, networkResource]);
  
  // Estadísticas por tipo de archivo (usar displayList en lugar de downloadList)
  const fileStats = useMemo(() => {
    const stats = {};
    displayList.forEach(item => {
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
  }, [displayList, selectedResources, activeFilters]);

  return (
    <DownloadListWrapper>
      <AnalysisStatus />
      <DownloadSettings />
      <OptionSection />
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
                📋 Resource List
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaInfoCircle 
                size={14} 
                style={{ color: 'rgba(255, 255, 255, 0.7)', cursor: 'help' }}
                title="Select the resources you want to download"
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
                Visible Resources
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
              }}>                Selected
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
                Progress
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
              {filteredSelectedCount > 0                ? `${filteredSelectedCount} of ${filteredDownloadList.length} resources selected` 
                : `${filteredDownloadList.length} resources visible for download`
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
                None
              </Button>
            </div>          </div>
        </div>

        {/* Sección de Filtros Avanzados */}
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
            marginBottom: '16px'
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
                Filtros Avanzados
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button 
                color="secondary" 
                onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
                style={{ 
                  fontSize: '10px', 
                  padding: '4px 8px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  fontWeight: '500'
                }}
              >
                {isFiltersExpanded ? '▲ Contraer' : '▼ Expandir'}
              </Button>
              <Button 
                color="secondary" 
                onClick={handleClearFilters}
                style={{ 
                  fontSize: '10px', 
                  padding: '4px 8px',
                  background: 'rgba(156, 163, 175, 0.2)',
                  border: '1px solid rgba(156, 163, 175, 0.3)',
                  color: '#9ca3af',
                  fontWeight: '500'
                }}
              >
                🗑️ Limpiar
              </Button>
            </div>
          </div>

          {/* Barra de búsqueda */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            marginBottom: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1', minWidth: '200px' }}>
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, extensión o tipo..."
                value={searchTerm}
                onChange={handleSearchChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '13px',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            
            {/* Filtros rápidos */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <select
                value={sizeFilter}
                onChange={(e) => handleSizeFilterChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="all" style={{ background: '#1f2937', color: 'white' }}>📏 Todos los tamaños</option>
                <option value="small" style={{ background: '#1f2937', color: 'white' }}>🔸 Pequeño (&lt;50KB)</option>
                <option value="medium" style={{ background: '#1f2937', color: 'white' }}>🔶 Mediano (50-200KB)</option>
                <option value="large" style={{ background: '#1f2937', color: 'white' }}>🔸 Grande (&gt;200KB)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="name" style={{ background: '#1f2937', color: 'white' }}>🔤 Ordenar por nombre</option>
                <option value="size" style={{ background: '#1f2937', color: 'white' }}>📊 Ordenar por tamaño</option>
                <option value="type" style={{ background: '#1f2937', color: 'white' }}>📁 Ordenar por tipo</option>
              </select>
            </div>
          </div>

          {/* Filtros por tipo (siempre visibles pero compactos) */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', 
            gap: '8px',
            marginBottom: isFiltersExpanded ? '16px' : '0'
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

          {/* Controles de filtros expandidos */}
          {isFiltersExpanded && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: 'block', 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    fontSize: '11px', 
                    marginBottom: '6px',
                    fontWeight: '500'
                  }}>
                    🎯 Acciones rápidas:
                  </label>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                      ✅ Todos los tipos
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
                      ❌ Ningún tipo
                    </Button>
                    <Button 
                      color="secondary" 
                      onClick={() => {
                        setActiveFilters({
                          images: true,
                          styles: true,
                          scripts: false,
                          fonts: false,
                          documents: false,
                          data: false,
                          other: false
                        });
                      }}
                      style={{ 
                        fontSize: '10px', 
                        padding: '4px 8px',
                        background: 'rgba(139, 92, 246, 0.2)',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#a78bfa',
                        fontWeight: '500'
                      }}
                    >
                      🎨 Solo visuales
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contador de resultados */}
          <div style={{ 
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '6px',
            textAlign: 'center',
            fontSize: '11px',
            color: 'rgba(255, 255, 255, 0.8)'
          }}>
            {searchTerm || sizeFilter !== 'all' || sortBy !== 'name' ? (
              <span>
                🔍 Filtros aplicados: mostrando <strong>{filteredDownloadList.length}</strong> de {totalCount} recursos
                {searchTerm && <span style={{ color: '#60a5fa' }}> • búsqueda: "{searchTerm}"</span>}
                {sizeFilter !== 'all' && <span style={{ color: '#f59e0b' }}> • tamaño: {sizeFilter}</span>}
                {sortBy !== 'name' && <span style={{ color: '#10b981' }}> • orden: {sortBy}</span>}
              </span>
            ) : (
              <span>
                {downloadList.length > 0 
                  ? `Mostrando ${filteredDownloadList.length} de ${totalCount} recursos de la lista`
                  : `Mostrando ${filteredDownloadList.length} de ${totalCount} recursos detectados automáticamente`
                }
              </span>
            )}
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
          // Para recursos auto-detectados, el originalIndex debe ser calculado diferente
          const originalIndex = downloadList.length > 0 
            ? downloadList.findIndex(originalItem => originalItem.url === item.url)
            : index; // Si usamos recursos auto-detectados, usar el índice actual
          
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
                  {/* Solo mostrar botón de eliminar para items del downloadList original */}
                  {!isSaving && downloadList.length > 0 && originalIndex !== 0 && originalIndex >= 0 && (
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
                      <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '500' }}>                        Downloading...
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
