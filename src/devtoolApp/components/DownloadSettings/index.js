import React, { useCallback } from 'react';
import styled from 'styled-components';
import { FaCog, FaInfoCircle, FaFilter, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../../store';
import * as optionActions from '../../store/option';

const SettingsWrapper = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SettingsTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const SettingGroup = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
`;

const SettingGroupTitle = styled.h4`
  margin: 0 0 12px 0;
  color: #10b981;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  color: white;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Toggle = styled.input`
  appearance: none;
  width: 40px;
  height: 20px;
  background: ${props => props.checked ? '#10b981' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:before {
    content: '';
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${props => props.checked ? '22px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const NumberInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  padding: 4px 8px;
  width: 80px;
  font-size: 12px;
  
  &:focus {
    outline: none;
    border-color: #10b981;
  }
`;

const InfoTooltip = styled.div`
  position: relative;
  cursor: help;
  
  &:hover::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    z-index: 1000;
  }
`;

const ResetButton = styled.button`
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
`;

const DownloadSettings = () => {
  const { 
    store: {
      option: {
        ignoreNoContentFile,
        beautifyFile,
        filterByFileType,
        filterBySize,
        includeImages,
        includeStylesheets,
        includeScripts,
        includeFonts,
        includeDocuments,
        minFileSize,
        maxFileSize
      }
    },
    dispatch
  } = useStore();

  const handleToggle = useCallback((action) => (event) => {
    dispatch(action(event.target.checked));
  }, [dispatch]);

  const handleNumberChange = useCallback((action) => (event) => {
    dispatch(action(parseInt(event.target.value) || 0));
  }, [dispatch]);

  const handleResetToDefaults = useCallback(() => {
    dispatch(optionActions.setIgnoreNoContentFile(false));
    dispatch(optionActions.setFilterByFileType(false));
    dispatch(optionActions.setFilterBySize(false));
    dispatch(optionActions.setIncludeImages(true));
    dispatch(optionActions.setIncludeStylesheets(true));
    dispatch(optionActions.setIncludeScripts(true));
    dispatch(optionActions.setIncludeFonts(true));
    dispatch(optionActions.setIncludeDocuments(true));
    dispatch(optionActions.setMinFileSize(0));
    dispatch(optionActions.setMaxFileSize(50240));
  }, [dispatch]);

  return (
    <SettingsWrapper>
      <SettingsHeader>
        <SettingsTitle>
          <FaCog />
          Download Settings
        </SettingsTitle>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <InfoTooltip data-tooltip="Configure how resources are filtered and downloaded">
            <FaInfoCircle style={{ color: 'var(--color-text-secondary)' }} />
          </InfoTooltip>
          <ResetButton onClick={handleResetToDefaults}>
            Reset to Defaults
          </ResetButton>
        </div>
      </SettingsHeader>

      <SettingsGrid>
        <SettingGroup>
          <SettingGroupTitle>
            <FaFilter />
            File Filtering
          </SettingGroupTitle>
          
          <SettingItem>
            <SettingLabel htmlFor="ignoreNoContent">
              <InfoTooltip data-tooltip="Skip files without content (may exclude some valid resources)">
                <FaExclamationTriangle size={12} color="#f59e0b" />
              </InfoTooltip>
              Ignore files without content
            </SettingLabel>
            <Toggle
              id="ignoreNoContent"
              type="checkbox"
              checked={ignoreNoContentFile}
              onChange={handleToggle(optionActions.setIgnoreNoContentFile)}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel htmlFor="filterByType">
              Filter by file type
            </SettingLabel>
            <Toggle
              id="filterByType"
              type="checkbox"
              checked={filterByFileType}
              onChange={handleToggle(optionActions.setFilterByFileType)}
            />
          </SettingItem>

          <SettingItem>
            <SettingLabel htmlFor="filterBySize">
              Filter by file size
            </SettingLabel>
            <Toggle
              id="filterBySize"
              type="checkbox"
              checked={filterBySize}
              onChange={handleToggle(optionActions.setFilterBySize)}
            />
          </SettingItem>
        </SettingGroup>

        {filterByFileType && (
          <SettingGroup>
            <SettingGroupTitle>
              <FaCheckCircle />
              File Types
            </SettingGroupTitle>
            
            <SettingItem>
              <SettingLabel htmlFor="includeImages">Images</SettingLabel>
              <Toggle
                id="includeImages"
                type="checkbox"
                checked={includeImages}
                onChange={handleToggle(optionActions.setIncludeImages)}
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel htmlFor="includeStylesheets">Stylesheets</SettingLabel>
              <Toggle
                id="includeStylesheets"
                type="checkbox"
                checked={includeStylesheets}
                onChange={handleToggle(optionActions.setIncludeStylesheets)}
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel htmlFor="includeScripts">Scripts</SettingLabel>
              <Toggle
                id="includeScripts"
                type="checkbox"
                checked={includeScripts}
                onChange={handleToggle(optionActions.setIncludeScripts)}
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel htmlFor="includeFonts">Fonts</SettingLabel>
              <Toggle
                id="includeFonts"
                type="checkbox"
                checked={includeFonts}
                onChange={handleToggle(optionActions.setIncludeFonts)}
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel htmlFor="includeDocuments">Documents</SettingLabel>
              <Toggle
                id="includeDocuments"
                type="checkbox"
                checked={includeDocuments}
                onChange={handleToggle(optionActions.setIncludeDocuments)}
              />
            </SettingItem>
          </SettingGroup>
        )}

        {filterBySize && (
          <SettingGroup>
            <SettingGroupTitle>
              File Size Limits (KB)
            </SettingGroupTitle>
            
            <SettingItem>
              <SettingLabel htmlFor="minSize">Minimum size:</SettingLabel>
              <NumberInput
                id="minSize"
                type="number"
                value={minFileSize}
                onChange={handleNumberChange(optionActions.setMinFileSize)}
                min="0"
              />
            </SettingItem>

            <SettingItem>
              <SettingLabel htmlFor="maxSize">Maximum size:</SettingLabel>
              <NumberInput
                id="maxSize"
                type="number"
                value={maxFileSize}
                onChange={handleNumberChange(optionActions.setMaxFileSize)}
                min="0"
              />
            </SettingItem>
          </SettingGroup>
        )}

        <SettingGroup>
          <SettingGroupTitle>
            File Processing
          </SettingGroupTitle>
          
          <SettingItem>
            <SettingLabel htmlFor="beautifyFile">
              <InfoTooltip data-tooltip="Format and beautify code files (JS, CSS, HTML, JSON)">
                <FaInfoCircle size={12} />
              </InfoTooltip>
              Beautify files
            </SettingLabel>
            <Toggle
              id="beautifyFile"
              type="checkbox"
              checked={beautifyFile}
              onChange={handleToggle(optionActions.setBeautifyFile)}
            />
          </SettingItem>
        </SettingGroup>
      </SettingsGrid>
    </SettingsWrapper>
  );
};

export default DownloadSettings;
