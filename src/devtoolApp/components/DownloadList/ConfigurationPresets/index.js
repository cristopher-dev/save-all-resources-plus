import React, { useState } from 'react';
import { useStore } from 'devtoolApp/store';
import * as optionActions from 'devtoolApp/store/option';
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
import { FaSave, FaTrash, FaDownload } from 'react-icons/fa';

const DEFAULT_PRESETS = {
  'Solo Imágenes': {
    enableFileTypeFilter: true,
    fileTypes: {
      images: true,
      css: false,
      javascript: false,
      fonts: false,
      documents: false,
      other: false
    },
    enableSizeFilter: false,
    excludedDomains: [],
    customExtensions: []
  },
  'Código y Estilos': {
    enableFileTypeFilter: true,
    fileTypes: {
      images: false,
      css: true,
      javascript: true,
      fonts: false,
      documents: true,
      other: false
    },
    enableSizeFilter: false,
    excludedDomains: [],
    customExtensions: []
  },
  'Sin Terceros': {
    enableFileTypeFilter: false,
    fileTypes: {},
    enableSizeFilter: false,
    excludedDomains: ['cdn.jsdelivr.net', 'unpkg.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'ajax.googleapis.com'],
    customExtensions: []
  },
  'Archivos Pequeños': {
    enableFileTypeFilter: false,
    fileTypes: {},
    enableSizeFilter: true,
    minSize: 0,
    maxSize: 100,
    excludedDomains: [],
    customExtensions: []
  }
};

const ConfigurationPresets = () => {
  const { state, dispatch } = useStore();
  const { option } = state;
  const [newPresetName, setNewPresetName] = useState('');
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
  };

  const applyPreset = (presetConfig) => {
    Object.keys(presetConfig).forEach(key => {
      if (key in optionActions) {
        dispatch(optionActions[key](presetConfig[key]));
      }
    });
  };

  const saveCurrentAsPreset = () => {
    if (!newPresetName.trim()) return;
    
    const currentConfig = {
      enableFileTypeFilter: option.advancedFilters?.enableFileTypeFilter || false,
      fileTypes: option.advancedFilters?.fileTypes || {},
      enableSizeFilter: option.advancedFilters?.enableSizeFilter || false,
      minSize: option.advancedFilters?.minSize || 0,
      maxSize: option.advancedFilters?.maxSize || 0,
      excludedDomains: option.advancedFilters?.excludedDomains || [],
      customExtensions: option.advancedFilters?.customExtensions || []
    };

    const newPresets = {
      ...customPresets,
      [newPresetName]: currentConfig
    };
    
    saveCustomPresets(newPresets);
    setNewPresetName('');
  };

  const deletePreset = (presetName) => {
    const newPresets = { ...customPresets };
    delete newPresets[presetName];
    saveCustomPresets(newPresets);
  };

  const allPresets = { ...DEFAULT_PRESETS, ...customPresets };

  return (
    <PresetsContainer>
      <PresetsHeader>
        <PresetsTitle>📋 Presets de Configuración</PresetsTitle>
      </PresetsHeader>
      
      <PresetsList>
        {Object.entries(allPresets).map(([name, config]) => (
          <PresetItem key={name}>
            <PresetName>{name}</PresetName>
            <PresetActions>
              <PresetButton 
                onClick={() => applyPreset(config)}
                title="Aplicar preset"
              >
                <FaDownload size={12} />
              </PresetButton>
              {!DEFAULT_PRESETS[name] && (
                <DeletePresetButton 
                  onClick={() => deletePreset(name)}
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
