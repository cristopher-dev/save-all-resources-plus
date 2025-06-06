import React, { useCallback, useState } from 'react';
import { Toggle } from '../../Toggle';
import Button from '../../Button';
import {
  AdvancedFiltersWrapper,
  AdvancedFiltersTitle,
  AdvancedFiltersCollapsible,
  AdvancedFiltersRow,
  AdvancedFiltersInput,
  AdvancedFiltersLabel,
  AdvancedFiltersGroup,
  FileTypeGrid,
  SizeFilterRow,
  DomainExcludeSection,
  CustomExtensionsSection,
} from './styles';
import * as optionActions from 'devtoolApp/store/option';
import useStore from 'devtoolApp/store';

export const AdvancedFilters = () => {
  const {
    dispatch,
    state: {
      option: {
        filterByFileType,
        filterBySize,
        includeImages,
        includeStylesheets,
        includeScripts,
        includeFonts,
        includeDocuments,
        minFileSize,
        maxFileSize,
        excludeDomains,
        customFileExtensions,
      },
      ui: { isSaving },
    },
  } = useStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [extensionInput, setExtensionInput] = useState('');

  const handleToggleExpanded = useCallback(() => setIsExpanded(!isExpanded), [isExpanded]);

  const handleFilterByFileType = useCallback((willFilter) => {
    dispatch(optionActions.setFilterByFileType(willFilter));
  }, [dispatch]);

  const handleFilterBySize = useCallback((willFilter) => {
    dispatch(optionActions.setFilterBySize(willFilter));
  }, [dispatch]);

  const handleIncludeImages = useCallback((willInclude) => {
    dispatch(optionActions.setIncludeImages(willInclude));
  }, [dispatch]);

  const handleIncludeStylesheets = useCallback((willInclude) => {
    dispatch(optionActions.setIncludeStylesheets(willInclude));
  }, [dispatch]);

  const handleIncludeScripts = useCallback((willInclude) => {
    dispatch(optionActions.setIncludeScripts(willInclude));
  }, [dispatch]);

  const handleIncludeFonts = useCallback((willInclude) => {
    dispatch(optionActions.setIncludeFonts(willInclude));
  }, [dispatch]);

  const handleIncludeDocuments = useCallback((willInclude) => {
    dispatch(optionActions.setIncludeDocuments(willInclude));
  }, [dispatch]);

  const handleMinFileSize = useCallback((e) => {
    dispatch(optionActions.setMinFileSize(e.target.value));
  }, [dispatch]);

  const handleMaxFileSize = useCallback((e) => {
    dispatch(optionActions.setMaxFileSize(e.target.value));
  }, [dispatch]);

  const handleAddDomain = useCallback(() => {
    if (domainInput.trim()) {
      const newDomains = [...excludeDomains, domainInput.trim()];
      dispatch(optionActions.setExcludeDomains(newDomains));
      setDomainInput('');
    }
  }, [domainInput, excludeDomains, dispatch]);

  const handleRemoveDomain = useCallback((domain) => {
    const newDomains = excludeDomains.filter(d => d !== domain);
    dispatch(optionActions.setExcludeDomains(newDomains));
  }, [excludeDomains, dispatch]);

  const handleAddExtension = useCallback(() => {
    if (extensionInput.trim()) {
      const ext = extensionInput.trim().replace(/^\./, ''); // Remove leading dot if present
      const newExtensions = [...customFileExtensions, ext];
      dispatch(optionActions.setCustomFileExtensions(newExtensions));
      setExtensionInput('');
    }
  }, [extensionInput, customFileExtensions, dispatch]);

  const handleRemoveExtension = useCallback((extension) => {
    const newExtensions = customFileExtensions.filter(ext => ext !== extension);
    dispatch(optionActions.setCustomFileExtensions(newExtensions));
  }, [customFileExtensions, dispatch]);

  return (
    <AdvancedFiltersWrapper>
      <AdvancedFiltersTitle onClick={handleToggleExpanded}>
        🔧 Filtros Avanzados {isExpanded ? '⬆️' : '⬇️'}
      </AdvancedFiltersTitle>
      
      {isExpanded && (
        <AdvancedFiltersCollapsible>
          <AdvancedFiltersGroup>
            <Toggle 
              noInteraction={isSaving} 
              isToggled={filterByFileType} 
              onToggle={handleFilterByFileType}
            >
              Filtrar por tipo de archivo
            </Toggle>
            
            {filterByFileType && (
              <FileTypeGrid>
                <Toggle 
                  noInteraction={isSaving} 
                  isToggled={includeImages} 
                  onToggle={handleIncludeImages}
                  size="small"
                >
                  🖼️ Imágenes (jpg, png, gif, svg, webp)
                </Toggle>
                <Toggle 
                  noInteraction={isSaving} 
                  isToggled={includeStylesheets} 
                  onToggle={handleIncludeStylesheets}
                  size="small"
                >
                  🎨 CSS (css, scss, sass, less)
                </Toggle>
                <Toggle 
                  noInteraction={isSaving} 
                  isToggled={includeScripts} 
                  onToggle={handleIncludeScripts}
                  size="small"
                >
                  📜 JavaScript (js, ts, jsx, tsx)
                </Toggle>
                <Toggle 
                  noInteraction={isSaving} 
                  isToggled={includeFonts} 
                  onToggle={handleIncludeFonts}
                  size="small"
                >
                  🔤 Fuentes (woff, woff2, ttf, eot)
                </Toggle>
                <Toggle 
                  noInteraction={isSaving} 
                  isToggled={includeDocuments} 
                  onToggle={handleIncludeDocuments}
                  size="small"
                >
                  📄 Documentos (html, xml, json, txt)
                </Toggle>
              </FileTypeGrid>
            )}
          </AdvancedFiltersGroup>

          <AdvancedFiltersGroup>
            <Toggle 
              noInteraction={isSaving} 
              isToggled={filterBySize} 
              onToggle={handleFilterBySize}
            >
              Filtrar por tamaño de archivo
            </Toggle>
            
            {filterBySize && (
              <SizeFilterRow>
                <div>
                  <AdvancedFiltersLabel>Tamaño mínimo (KB):</AdvancedFiltersLabel>
                  <AdvancedFiltersInput
                    type="number"
                    min="0"
                    value={minFileSize}
                    onChange={handleMinFileSize}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <AdvancedFiltersLabel>Tamaño máximo (KB):</AdvancedFiltersLabel>
                  <AdvancedFiltersInput
                    type="number"
                    min="0"
                    value={maxFileSize}
                    onChange={handleMaxFileSize}
                    disabled={isSaving}
                  />
                </div>
              </SizeFilterRow>
            )}
          </AdvancedFiltersGroup>

          <AdvancedFiltersGroup>
            <DomainExcludeSection>
              <AdvancedFiltersLabel>🚫 Excluir dominios:</AdvancedFiltersLabel>
              <AdvancedFiltersRow>
                <AdvancedFiltersInput
                  type="text"
                  placeholder="ej: ads.google.com"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                  disabled={isSaving}
                />
                <Button color="primary" onClick={handleAddDomain} disabled={isSaving || !domainInput.trim()}>
                  Añadir
                </Button>
              </AdvancedFiltersRow>
              {excludeDomains.length > 0 && (
                <div>
                  {excludeDomains.map(domain => (
                    <span key={domain} style={{ 
                      display: 'inline-block', 
                      margin: '2px', 
                      padding: '4px 8px', 
                      background: '#f0f0f0', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {domain}
                      <button 
                        onClick={() => handleRemoveDomain(domain)}
                        style={{ 
                          marginLeft: '5px', 
                          background: 'none', 
                          border: 'none', 
                          color: 'red', 
                          cursor: 'pointer' 
                        }}
                        disabled={isSaving}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </DomainExcludeSection>
          </AdvancedFiltersGroup>

          <AdvancedFiltersGroup>
            <CustomExtensionsSection>
              <AdvancedFiltersLabel>➕ Extensiones personalizadas:</AdvancedFiltersLabel>
              <AdvancedFiltersRow>
                <AdvancedFiltersInput
                  type="text"
                  placeholder="ej: pdf, doc, zip"
                  value={extensionInput}
                  onChange={(e) => setExtensionInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddExtension()}
                  disabled={isSaving}
                />
                <Button color="primary" onClick={handleAddExtension} disabled={isSaving || !extensionInput.trim()}>
                  Añadir
                </Button>
              </AdvancedFiltersRow>
              {customFileExtensions.length > 0 && (
                <div>
                  {customFileExtensions.map(ext => (
                    <span key={ext} style={{ 
                      display: 'inline-block', 
                      margin: '2px', 
                      padding: '4px 8px', 
                      background: '#e8f4f8', 
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      .{ext}
                      <button 
                        onClick={() => handleRemoveExtension(ext)}
                        style={{ 
                          marginLeft: '5px', 
                          background: 'none', 
                          border: 'none', 
                          color: 'red', 
                          cursor: 'pointer' 
                        }}
                        disabled={isSaving}
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CustomExtensionsSection>
          </AdvancedFiltersGroup>
        </AdvancedFiltersCollapsible>
      )}
    </AdvancedFiltersWrapper>
  );
};

export default AdvancedFilters;
