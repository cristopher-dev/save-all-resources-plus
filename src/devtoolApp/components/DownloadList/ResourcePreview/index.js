import React, { useState, useEffect } from 'react';
import { useStore } from 'devtoolApp/store';
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
  };

  const typeColors = {
    images: '#ff6b6b',
    css: '#4ecdc4',
    javascript: '#45b7d1',
    fonts: '#96ceb4',
    documents: '#ffeaa7',
    other: '#ddd'
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
    
    if (fileType === 'images' && resource.content) {
      let src = resource.content;
      if (resource.encoding === 'base64') {
        src = `data:${resource.mimeType || 'image/png'};base64,${resource.content}`;
      } else if (!(resource.content instanceof Blob)) {
        return <NoPreviewMessage>Vista previa no disponible</NoPreviewMessage>;
      }
      
      return (
        <PreviewImage 
          src={src}
          alt={resource.url}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      );
    }
    
    if (['css', 'javascript', 'documents'].includes(fileType) && resource.content && typeof resource.content === 'string') {
      return (
        <PreviewCode language={extension}>
          {resource.content.substring(0, 300)}
          {resource.content.length > 300 && '...'}
        </PreviewCode>
      );
    }
    
    return <NoPreviewMessage>Vista previa no disponible para este tipo de archivo</NoPreviewMessage>;
  };

  if (!isOpen) return null;

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>🔍 Vista Previa de Recursos ({totalCount})</PreviewTitle>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </PreviewHeader>
      
      <FilterControls>
        <SearchInput
          type="text"
          placeholder="Buscar recursos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TypeFilter>
          <TypeBadge 
            $active={selectedType === 'all'}
            onClick={() => setSelectedType('all')}
          >
            Todos
          </TypeBadge>
          {Object.keys(stats).map(type => {
            const Icon = typeIcons[type];
            return (
              <TypeBadge
                key={type}
                $active={selectedType === type}
                color={typeColors[type]}
                onClick={() => setSelectedType(type)}
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
          📊 Total: {totalCount} recursos
        </StatsItem>
        <StatsItem>
          💾 Tamaño: {Math.round(totalSize / 1024)} KB
        </StatsItem>
        <StatsItem>
          📈 Promedio: {totalCount > 0 ? Math.round(totalSize / totalCount / 1024) : 0} KB/archivo
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
                    {resource.saveAs?.name || resource.url.split('/').pop() || 'Sin nombre'}
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
