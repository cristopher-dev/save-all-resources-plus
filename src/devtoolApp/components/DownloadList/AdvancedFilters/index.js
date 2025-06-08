import React, { useState } from 'react';
import { useStore } from 'devtoolApp/store';
import * as optionActions from 'devtoolApp/store/option';
import {
  AdvancedFiltersContainer,
  AdvancedFiltersHeader,
  AdvancedFiltersTitle,
  ExpandIcon,
  AdvancedFiltersContent,
  FilterSection,
  FilterSectionTitle,
  ToggleRow,
  ToggleLabel,
  FileTypeGrid,
  FileTypeItem,
  FileTypeIcon,
  FileTypeLabel,
  SizeFilterRow,
  SizeInput,
  SizeLabel,
  TagsContainer,
  Tag,
  TagRemove,
  AddTagInput,
  FilterStats,
  StatItem,
  StatIcon,
} from './styles';
import { Toggle } from '../../Toggle';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const FILE_TYPES = [
  { key: 'images', label: 'Imágenes', icon: '🖼️' },
  { key: 'css', label: 'CSS', icon: '🎨' },
  { key: 'javascript', label: 'JavaScript', icon: '⚡' },
  { key: 'fonts', label: 'Fuentes', icon: '🔤' },
  { key: 'documents', label: 'Documentos', icon: '📄' },
  { key: 'other', label: 'Otros', icon: '📎' },
];

const AdvancedFilters = () => {
  const { state, dispatch } = useStore();
  const { option } = state;
  
  const [expanded, setExpanded] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newExtension, setNewExtension] = useState('');

  const toggleExpanded = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  const handleFileTypeToggle = (fileType) => (event) => {
    event.stopPropagation();
    // Map to existing store structure
    const toggleAction = {
      images: optionActions.setIncludeImages,
      css: optionActions.setIncludeStylesheets,
      javascript: optionActions.setIncludeScripts,
      fonts: optionActions.setIncludeFonts,
      documents: optionActions.setIncludeDocuments,
    }[fileType];
    
    if (toggleAction) {
      const currentValue = {
        images: option.includeImages,
        css: option.includeStylesheets,
        javascript: option.includeScripts,
        fonts: option.includeFonts,
        documents: option.includeDocuments,
      }[fileType];
      
      dispatch(toggleAction(!currentValue));
    }
  };

  const handleSizeChange = (field, value) => {
    const numValue = parseInt(value) || 0;
    if (field === 'minSize') {
      dispatch(optionActions.setMinFileSize(numValue));
    } else {
      dispatch(optionActions.setMaxFileSize(numValue));
    }
  };

  const addDomain = (event) => {
    if (event) event.stopPropagation();
    if (newDomain.trim()) {
      const domains = [...(option.excludeDomains || []), newDomain.trim()];
      dispatch(optionActions.setExcludeDomains(domains));
      setNewDomain('');
    }
  };

  const removeDomain = (domain) => (event) => {
    event.stopPropagation();
    const domains = (option.excludeDomains || []).filter(d => d !== domain);
    dispatch(optionActions.setExcludeDomains(domains));
  };

  const addExtension = (event) => {
    if (event) event.stopPropagation();
    if (newExtension.trim()) {
      const extensions = [...(option.customFileExtensions || []), newExtension.trim()];
      dispatch(optionActions.setCustomFileExtensions(extensions));
      setNewExtension('');
    }
  };

  const removeExtension = (extension) => (event) => {
    event.stopPropagation();
    const extensions = (option.customFileExtensions || []).filter(e => e !== extension);
    dispatch(optionActions.setCustomFileExtensions(extensions));
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (option.filterByFileType) count++;
    if (option.filterBySize) count++;
    if (option.excludeDomains?.length > 0) count++;
    if (option.customFileExtensions?.length > 0) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <AdvancedFiltersContainer>
      <AdvancedFiltersHeader $expanded={expanded} onClick={toggleExpanded}>
        <AdvancedFiltersTitle>
          🔧 Filtros Avanzados
          {activeFiltersCount > 0 && ` (${activeFiltersCount} activos)`}
        </AdvancedFiltersTitle>
        <ExpandIcon $expanded={expanded}>
          <FaChevronDown />
        </ExpandIcon>
      </AdvancedFiltersHeader>

      <AdvancedFiltersContent $expanded={expanded}>
        <FilterSection>
          <FilterSectionTitle>
            🗂️ Filtros por Tipo de Archivo
          </FilterSectionTitle>
          
          <ToggleRow>
            <Toggle
              isToggled={option.filterByFileType || false}
              onToggle={(enabled) => dispatch(optionActions.setFilterByFileType(enabled))}
            />
            <ToggleLabel>
              Habilitar filtro por tipo de archivo
            </ToggleLabel>
          </ToggleRow>

          {option.filterByFileType && (
            <FileTypeGrid>
              {FILE_TYPES.map(({ key, label, icon }) => {
                const isChecked = {
                  images: option.includeImages,
                  css: option.includeStylesheets,
                  javascript: option.includeScripts,
                  fonts: option.includeFonts,
                  documents: option.includeDocuments,
                  other: true, // Default for other types
                }[key] || false;
                
                return (
                  <FileTypeItem
                    key={key}
                    $checked={isChecked}
                    onClick={handleFileTypeToggle(key)}
                  >
                    <FileTypeIcon>{icon}</FileTypeIcon>
                    <FileTypeLabel $checked={isChecked}>
                      {label}
                    </FileTypeLabel>
                  </FileTypeItem>
                );
              })}
            </FileTypeGrid>
          )}
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            📏 Filtros por Tamaño
          </FilterSectionTitle>
          
          <ToggleRow>
            <Toggle
              isToggled={option.filterBySize || false}
              onToggle={(enabled) => dispatch(optionActions.setFilterBySize(enabled))}
            />
            <ToggleLabel>
              Habilitar filtro por tamaño
            </ToggleLabel>
          </ToggleRow>

          {option.filterBySize && (
            <SizeFilterRow>
              <SizeLabel>Mín:</SizeLabel>
              <SizeInput
                type="number"
                value={option.minFileSize || 0}
                onChange={(e) => handleSizeChange('minSize', e.target.value)}
                placeholder="0"
              />
              <SizeLabel>KB</SizeLabel>
              
              <SizeLabel>Máx:</SizeLabel>
              <SizeInput
                type="number"
                value={option.maxFileSize || ''}
                onChange={(e) => handleSizeChange('maxSize', e.target.value)}
                placeholder="Sin límite"
              />
              <SizeLabel>KB</SizeLabel>
            </SizeFilterRow>
          )}
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            🚫 Dominios Excluidos
          </FilterSectionTitle>
          
          <TagsContainer>
            {(option.excludeDomains || []).map((domain) => (
              <Tag key={domain}>
                {domain}
                <TagRemove onClick={removeDomain(domain)}>
                  <FaTimes />
                </TagRemove>
              </Tag>
            ))}
            <AddTagInput
              type="text"
              placeholder="Agregar dominio..."
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addDomain(e)}
            />
          </TagsContainer>
        </FilterSection>

        <FilterSection>
          <FilterSectionTitle>
            🎯 Solo Extensiones Específicas
          </FilterSectionTitle>
          
          <TagsContainer>
            {(option.customFileExtensions || []).map((extension) => (
              <Tag key={extension}>
                .{extension}
                <TagRemove onClick={removeExtension(extension)}>
                  <FaTimes />
                </TagRemove>
              </Tag>
            ))}
            <AddTagInput
              type="text"
              placeholder="Agregar extensión (sin punto)..."
              value={newExtension}
              onChange={(e) => setNewExtension(e.target.value.replace('.', ''))}
              onKeyPress={(e) => e.key === 'Enter' && addExtension(e)}
            />
          </TagsContainer>
        </FilterSection>

        {activeFiltersCount > 0 && (
          <FilterStats>
            <StatItem>
              <StatIcon>📊</StatIcon>
              {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
            </StatItem>
            {option.filterByFileType && (
              <StatItem>
                <StatIcon>🗂️</StatIcon>
                Tipos activos: {[option.includeImages, option.includeStylesheets, option.includeScripts, option.includeFonts, option.includeDocuments].filter(Boolean).length}
              </StatItem>
            )}
            {option.excludeDomains?.length > 0 && (
              <StatItem>
                <StatIcon>🚫</StatIcon>
                Dominios excluidos: {option.excludeDomains.length}
              </StatItem>
            )}
          </FilterStats>
        )}
      </AdvancedFiltersContent>
    </AdvancedFiltersContainer>
  );
};

export default AdvancedFilters;