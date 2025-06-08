import React, { useState, useEffect } from 'react';
import { useStore } from 'devtoolApp/store';
import { useAppTheme } from 'devtoolApp/hooks/useAppTheme';
import { getFileSize, getFileType, getFileExtension } from 'devtoolApp/utils/file';
import {
  PreviewContainer,
  PreviewHeader,
  PreviewTitle,
  CloseButton,
  PreviewContent,
  ResourceList,
  ResourceItem,
  ResourceInfo,
  ResourceName,
  ResourceMeta,
  ResourcePreview as ResourcePreviewWrapper,
  PreviewImage,
  PreviewCode,
  ResourceStats,
  StatsItem,
  FilterControls,
  SearchInput,
  TypeFilter,
  TypeBadge,
  NoPreviewMessage
} from './styles';
import { FaTimes, FaFile, FaImage, FaCode, FaFont, FaFileAlt } from 'react-icons/fa';

const ResourcePreview = ({ isOpen, onClose }) => {
  const { state } = useStore();
  const { networkResource, staticResource, option } = state;
  const { theme } = useAppTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  const allResources = [...(networkResource || []), ...(staticResource || [])];
  
  const filteredResources = allResources.filter(resource => {
    const matchesSearch = resource.url.toLowerCase().includes(searchTerm.toLowerCase());
    const fileType = getFileType(resource.url, resource.mimeType);
    const matchesType = selectedType === 'all' || fileType === selectedType;
    return matchesSearch && matchesType;
  });

  const typeIcons = {
    images: FaImage,
    css: FaCode,
    javascript: FaCode,
    fonts: FaFont,
    documents: FaFileAlt,
    other: FaFile
  };  const typeColors = {
    images: theme.colors.error,
    css: theme.colors.success,
    javascript: theme.colors.info,
    fonts: theme.colors.secondary,
    documents: theme.colors.warning,
    other: theme.colors.textMuted
  };

  const getResourceStats = () => {
    const stats = {};
    const totalSize = filteredResources.reduce((acc, resource) => {
      const type = getFileType(resource.url, resource.mimeType);
      const size = getFileSize(resource);
      
      if (!stats[type]) {
        stats[type] = { count: 0, size: 0 };
      }
      stats[type].count++;
      stats[type].size += size;
      
      return acc + size;
    }, 0);
    
    return { stats, totalSize, totalCount: filteredResources.length };
  };

  const { stats, totalSize, totalCount } = getResourceStats();

  const renderPreview = (resource) => {
    const fileType = getFileType(resource.url, resource.mimeType);
    const extension = getFileExtension(resource.url);
    
    console.log('[PREVIEW]: Rendering preview for', resource.url, 'Type:', fileType, 'Extension:', extension, 'Has content:', !!resource.content);
    
    if (fileType === 'images' && resource.content) {
      let src = resource.content;
      
      try {
        if (resource.encoding === 'base64') {
          // Verificar si ya es un data URL
          if (!resource.content.startsWith('data:')) {
            src = `data:${resource.mimeType || 'image/png'};base64,${resource.content}`;
          }
        } else if (resource.content instanceof Blob) {
          src = URL.createObjectURL(resource.content);
        } else if (typeof resource.content === 'string' && !resource.content.startsWith('data:')) {
          // Si es una cadena pero no es data URL ni base64, no mostrar vista previa
          return <NoPreviewMessage>Vista previa no disponible para este tipo de imagen</NoPreviewMessage>;
        }
        
        return (
          <PreviewImage 
            src={src}
            alt={resource.url}
            onError={(e) => {
              console.error('[PREVIEW]: Error loading image:', resource.url);
              e.target.style.display = 'none';
              e.target.nextSibling && (e.target.nextSibling.style.display = 'block');
            }}
            onLoad={() => {
              console.log('[PREVIEW]: Image loaded successfully:', resource.url);
            }}
          />
        );
      } catch (error) {
        console.error('[PREVIEW]: Error creating image src:', error);
        return <NoPreviewMessage>Error loading image preview</NoPreviewMessage>;
      }
    }
    
    if (['css', 'javascript', 'documents'].includes(fileType) && resource.content && typeof resource.content === 'string') {
      let displayContent = resource.content;
      
      // Si es base64, intentar decodificar para texto
      if (resource.encoding === 'base64') {
        try {
          displayContent = atob(resource.content);
        } catch (error) {
          console.error('[PREVIEW]: Error decoding base64 content:', error);
          return <NoPreviewMessage>Error decoding base64 content</NoPreviewMessage>;
        }
      }
      
      return (
        <PreviewCode language={extension}>
          {displayContent.substring(0, 300)}
          {displayContent.length > 300 && '...'}
        </PreviewCode>
      );
    }
    
    return <NoPreviewMessage>Preview not available for this file type ({fileType})</NoPreviewMessage>;
  };

  if (!isOpen) return null;

  // Event handlers para botones
  const handleClose = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    onClose && onClose();
  };

  const handleTypeFilterAll = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedType('all');
  };

  const handleTypeFilter = (type) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedType(type);
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>🔍 Resource Preview ({totalCount})</PreviewTitle>
        <CloseButton onClick={handleClose}>
          <FaTimes />
        </CloseButton>
      </PreviewHeader>
      
      <FilterControls>
        <SearchInput
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TypeFilter>
          <TypeBadge 
            $active={selectedType === 'all'}
            onClick={handleTypeFilterAll}
          >
            All
          </TypeBadge>
          {Object.keys(stats).map(type => {
            const Icon = typeIcons[type];
            return (
              <TypeBadge
                key={type}
                $active={selectedType === type}
                color={typeColors[type]}
                onClick={handleTypeFilter(type)}
              >
                <Icon size={12} />
                {type} ({stats[type].count})
              </TypeBadge>
            );
          })}
        </TypeFilter>
      </FilterControls>

      <ResourceStats>
        <StatsItem>
          📊 Total: {totalCount} resources
        </StatsItem>
        <StatsItem>
          💾 Size: {Math.round(totalSize / 1024)} KB
        </StatsItem>
        <StatsItem>
          📈 Average: {totalCount > 0 ? Math.round(totalSize / totalCount / 1024) : 0} KB/file
        </StatsItem>
      </ResourceStats>
      
      <PreviewContent>
        <ResourceList>
          {filteredResources.map((resource, index) => {
            const fileType = getFileType(resource.url, resource.mimeType);
            const fileSize = getFileSize(resource);
            const Icon = typeIcons[fileType];
            
            return (
              <ResourceItem key={`${resource.url}-${index}`}>
                <ResourceInfo>
                  <ResourceName>
                    <Icon size={14} color={typeColors[fileType]} />
                    {resource.saveAs?.name || resource.url.split('/').pop() || 'Unnamed'}
                  </ResourceName>
                  <ResourceMeta>
                    {Math.round(fileSize / 1024)} KB • {fileType}
                  </ResourceMeta>
                </ResourceInfo>
                <ResourcePreviewWrapper>
                  {renderPreview(resource)}
                </ResourcePreviewWrapper>
              </ResourceItem>
            );
          })}
        </ResourceList>
      </PreviewContent>
    </PreviewContainer>
  );
};

export default ResourcePreview;
