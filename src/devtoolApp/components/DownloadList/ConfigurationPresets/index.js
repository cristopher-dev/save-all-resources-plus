import React, { useState } from 'react';
import { useStore } from 'devtoolApp/store';
import * as optionActions from 'devtoolApp/store/option';
import * as uiActions from 'devtoolApp/store/ui';
import {
  PresetsContainer,
  PresetsHeader,
  PresetsTitle,
  PresetsList,
  PresetItem,
  PresetName,
  PresetActions,
  PresetButton,
  NewPresetSection,
  NewPresetInput,
  SavePresetButton,
  DeletePresetButton
} from './styles';
import { FaSave, FaTrash, FaDownload, FaCheck, FaFileExport, FaFileImport } from 'react-icons/fa';

const DEFAULT_PRESETS = {
  '🖼️ Solo Imágenes': {
    filterByFileType: true,
    includeImages: true,
    includeStylesheets: false,
    includeScripts: false,
    includeFonts: false,
    includeDocuments: false,
    filterBySize: false,
    excludeDomains: [],
    customFileExtensions: []
  },
  '⚡ Código y Estilos': {
    filterByFileType: true,
    includeImages: false,
    includeStylesheets: true,
    includeScripts: true,
    includeFonts: false,
    includeDocuments: true,
    filterBySize: false,
    excludeDomains: [],
    customFileExtensions: []
  },
  '🚫 Sin Terceros': {
    filterByFileType: false,
    includeImages: true,
    includeStylesheets: true,
    includeScripts: true,
    includeFonts: true,
    includeDocuments: true,
    filterBySize: false,
    excludeDomains: ['cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'ajax.googleapis.com'],
    customFileExtensions: []
  },
  '📏 Archivos Pequeños': {
    filterByFileType: false,
    includeImages: true,
    includeStylesheets: true,
    includeScripts: true,
    includeFonts: true,
    includeDocuments: true,
    filterBySize: true,
    minFileSize: 0,
    maxFileSize: 100,
    excludeDomains: [],
    customFileExtensions: []
  }
};

const ConfigurationPresets = () => {
  const { state, dispatch } = useStore();
  const { option } = state;
  const [newPresetName, setNewPresetName] = useState('');
  const [appliedPreset, setAppliedPreset] = useState(null);
  const [customPresets, setCustomPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('resourcesSaverPresets') || '{}');
    } catch {
      return {};
    }
  });

  const saveCustomPresets = (presets) => {
    setCustomPresets(presets);
    localStorage.setItem('resourcesSaverPresets', JSON.stringify(presets));
  };  const applyPreset = (presetConfig, event) => {
    if (event) event.stopPropagation();
    
    // Apply each configuration property with the correct action
    if (presetConfig.filterByFileType !== undefined) {
      dispatch(optionActions.setFilterByFileType(presetConfig.filterByFileType));
    }
    if (presetConfig.includeImages !== undefined) {
      dispatch(optionActions.setIncludeImages(presetConfig.includeImages));
    }
    if (presetConfig.includeStylesheets !== undefined) {
      dispatch(optionActions.setIncludeStylesheets(presetConfig.includeStylesheets));
    }
    if (presetConfig.includeScripts !== undefined) {
      dispatch(optionActions.setIncludeScripts(presetConfig.includeScripts));
    }
    if (presetConfig.includeFonts !== undefined) {
      dispatch(optionActions.setIncludeFonts(presetConfig.includeFonts));
    }
    if (presetConfig.includeDocuments !== undefined) {
      dispatch(optionActions.setIncludeDocuments(presetConfig.includeDocuments));
    }
    if (presetConfig.filterBySize !== undefined) {
      dispatch(optionActions.setFilterBySize(presetConfig.filterBySize));
    }
    if (presetConfig.minFileSize !== undefined) {
      dispatch(optionActions.setMinFileSize(presetConfig.minFileSize));
    }
    if (presetConfig.maxFileSize !== undefined) {
      dispatch(optionActions.setMaxFileSize(presetConfig.maxFileSize));
    }
    if (presetConfig.excludeDomains !== undefined) {
      dispatch(optionActions.setExcludeDomains(presetConfig.excludeDomains));
    }
    if (presetConfig.customFileExtensions !== undefined) {
      dispatch(optionActions.setCustomFileExtensions(presetConfig.customFileExtensions));
    }
    
    // Show feedback
    const presetName = Object.keys(allPresets).find(name => allPresets[name] === presetConfig);
    setAppliedPreset(presetName);
    dispatch(uiActions.setStatus(`Preset "${presetName}" aplicado correctamente`));
    
    // Clear feedback after 2 seconds
    setTimeout(() => {
      setAppliedPreset(null);
    }, 2000);
  };
  const saveCurrentAsPreset = (event) => {
    if (event) event.stopPropagation();
    if (!newPresetName.trim()) return;
    
    const currentConfig = {
      filterByFileType: option.filterByFileType || false,
      includeImages: option.includeImages !== undefined ? option.includeImages : true,
      includeStylesheets: option.includeStylesheets !== undefined ? option.includeStylesheets : true,
      includeScripts: option.includeScripts !== undefined ? option.includeScripts : true,
      includeFonts: option.includeFonts !== undefined ? option.includeFonts : true,
      includeDocuments: option.includeDocuments !== undefined ? option.includeDocuments : true,
      filterBySize: option.filterBySize || false,
      minFileSize: option.minFileSize || 0,
      maxFileSize: option.maxFileSize || 10240,
      excludeDomains: option.excludeDomains || [],
      customFileExtensions: option.customFileExtensions || []
    };

    const newPresets = {
      ...customPresets,
      [newPresetName]: currentConfig
    };    
    saveCustomPresets(newPresets);
    setNewPresetName('');
    dispatch(uiActions.setStatus(`Preset "${newPresetName}" guardado correctamente`));
  };  const deletePreset = (presetName, event) => {
    if (event) event.stopPropagation();
    const newPresets = { ...customPresets };
    delete newPresets[presetName];
    saveCustomPresets(newPresets);
    dispatch(uiActions.setStatus(`Preset "${presetName}" eliminado`));
  };

  const exportPresets = (event) => {
    if (event) event.stopPropagation();
    const dataStr = JSON.stringify(customPresets, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'recursos-presets.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    dispatch(uiActions.setStatus('Presets exportados correctamente'));
  };

  const importPresets = (event) => {
    if (event) event.stopPropagation();
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedPresets = JSON.parse(e.target.result);
            const mergedPresets = { ...customPresets, ...importedPresets };
            saveCustomPresets(mergedPresets);
            dispatch(uiActions.setStatus(`${Object.keys(importedPresets).length} presets importados`));
          } catch (error) {
            dispatch(uiActions.setStatus('Error al importar presets: archivo inválido'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const allPresets = { ...DEFAULT_PRESETS, ...customPresets };

  return (    <PresetsContainer>
      <PresetsHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <PresetsTitle>📋 Presets de Configuración</PresetsTitle>
          <div style={{ display: 'flex', gap: '8px' }}>
            <PresetButton 
              onClick={exportPresets}
              title="Exportar presets personalizados"
              style={{ fontSize: '10px', padding: '4px 6px' }}
            >
              <FaFileExport size={10} />
            </PresetButton>
            <PresetButton 
              onClick={importPresets}
              title="Importar presets"
              style={{ fontSize: '10px', padding: '4px 6px' }}
            >
              <FaFileImport size={10} />
            </PresetButton>
          </div>
        </div>
      </PresetsHeader>
      
      <PresetsList>
        {Object.entries(allPresets).map(([name, config]) => (
          <PresetItem key={name}>
            <PresetName>{name}</PresetName>            <PresetActions>
              <PresetButton 
                onClick={(e) => applyPreset(config, e)}
                title="Aplicar preset"
                style={{
                  background: appliedPreset === name ? '#10B981' : undefined
                }}
              >
                {appliedPreset === name ? <FaCheck size={12} /> : <FaDownload size={12} />}
              </PresetButton>
              {!DEFAULT_PRESETS[name] && (
                <DeletePresetButton 
                  onClick={(e) => deletePreset(name, e)}
                  title="Eliminar preset"
                >
                  <FaTrash size={10} />
                </DeletePresetButton>
              )}
            </PresetActions>
          </PresetItem>
        ))}
      </PresetsList>

      <NewPresetSection>
        <NewPresetInput
          type="text"
          placeholder="Nombre del nuevo preset..."
          value={newPresetName}
          onChange={(e) => setNewPresetName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && saveCurrentAsPreset()}
        />
        <SavePresetButton 
          onClick={saveCurrentAsPreset}
          disabled={!newPresetName.trim()}
          title="Guardar configuración actual como preset"
        >
          <FaSave size={12} />
        </SavePresetButton>
      </NewPresetSection>
    </PresetsContainer>
  );
};

export default ConfigurationPresets;
