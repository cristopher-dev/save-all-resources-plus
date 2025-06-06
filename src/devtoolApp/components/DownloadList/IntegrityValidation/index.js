import React, { useState, useEffect } from 'react';
import { useStore } from 'devtoolApp/store';
import {
  IntegrityContainer,
  IntegrityHeader,
  HeaderTitle,
  StatusBadge,
  ConfigSection,
  SectionTitle,
  HashSection,
  HashTypeSelector,
  HashOption,
  HashInput,
  HashResult,
  ValidationSection,
  ValidationCard,
  ValidationHeader,
  ValidationContent,
  FileUploadArea,
  ValidationResult,
  ResultItem,
  ResultIcon,
  ResultText,
  AutoVerifySection,
  SettingsGrid,
  SettingField,
  SettingLabel,
  SettingInput,
  ProgressBar,
  ProgressFill,
  ProgressText,
  HistorySection,
  HistoryList,
  HistoryItem,
  HistoryMeta,
  ActionButton,
  StatsContainer,
  StatItem,
  StatValue,
  StatLabel,
  AlertContainer,
  AlertIcon,
  AlertMessage
} from './styles';

const IntegrityValidation = () => {
  const { state, dispatch } = useStore();
  const [integrityConfig, setIntegrityConfig] = useState({
    enabled: true,
    autoVerify: true,
    hashTypes: ['MD5', 'SHA1', 'SHA256', 'SHA512'],
    selectedHashType: 'SHA256',
    verifyOnDownload: true,
    saveHashes: true,
    alertOnMismatch: true,
    quarantineCorrupted: false
  });

  const [currentHash, setCurrentHash] = useState('');
  const [expectedHash, setExpectedHash] = useState('');
  const [validationProgress, setValidationProgress] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationHistory, setValidationHistory] = useState([]);
  const [stats, setStats] = useState({
    totalValidations: 0,
    successful: 0,
    failed: 0,
    corruptedFiles: 0
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    // Cargar configuración del store
    const savedConfig = optionStore.getState().integrityConfig || {};
    setIntegrityConfig(prev => ({ ...prev, ...savedConfig }));
    
    // Cargar historial simulado
    loadMockHistory();
  }, []);

  const loadMockHistory = () => {
    const mockHistory = [
      {
        id: 1,
        fileName: 'document.pdf',
        hashType: 'SHA256',
        expectedHash: 'a1b2c3d4e5f6...',
        actualHash: 'a1b2c3d4e5f6...',
        status: 'valid',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        fileSize: '2.5 MB'
      },
      {
        id: 2,
        fileName: 'image.jpg',
        hashType: 'MD5',
        expectedHash: 'x1y2z3a4b5c6...',
        actualHash: 'x1y2z3a4b5c6...',
        status: 'valid',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        fileSize: '1.2 MB'
      },
      {
        id: 3,
        fileName: 'corrupted.zip',
        hashType: 'SHA1',
        expectedHash: 'm1n2o3p4q5r6...',
        actualHash: 'different_hash...',
        status: 'invalid',
        timestamp: new Date(Date.now() - 10800000).toISOString(),
        fileSize: '5.8 MB'
      }
    ];
    
    setValidationHistory(mockHistory);
    setStats({
      totalValidations: mockHistory.length,
      successful: mockHistory.filter(h => h.status === 'valid').length,
      failed: mockHistory.filter(h => h.status === 'invalid').length,
      corruptedFiles: mockHistory.filter(h => h.status === 'invalid').length
    });
  };

  const handleConfigChange = (key, value) => {
    setIntegrityConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      // Guardar en el store usando dispatch
      // dispatch(setIntegrityConfig(newConfig)); // Necesitarías crear esta acción
      return newConfig;
    });
  };

  const calculateHash = async (file) => {
    if (!file) return;
    
    setIsValidating(true);
    setValidationProgress(0);
    
    try {
      // Simular cálculo de hash con progreso
      for (let i = 0; i <= 100; i += 10) {
        setValidationProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Generar hash simulado basado en el tipo seleccionado
      const hashLength = {
        'MD5': 32,
        'SHA1': 40,
        'SHA256': 64,
        'SHA512': 128
      };
      
      const length = hashLength[integrityConfig.selectedHashType];
      const hash = Array.from({ length }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setCurrentHash(hash);
      
      // Agregar al historial
      const newEntry = {
        id: Date.now(),
        fileName: file.name,
        hashType: integrityConfig.selectedHashType,
        expectedHash: expectedHash || 'N/A',
        actualHash: hash,
        status: expectedHash && expectedHash.toLowerCase() === hash.toLowerCase() ? 'valid' : 
                expectedHash ? 'invalid' : 'calculated',
        timestamp: new Date().toISOString(),
        fileSize: formatFileSize(file.size)
      };
      
      setValidationHistory(prev => [newEntry, ...prev]);
      updateStats(newEntry);
      
    } catch (error) {
      console.error('Error calculando hash:', error);
    } finally {
      setIsValidating(false);
      setValidationProgress(0);
    }
  };

  const validateHash = () => {
    if (!currentHash || !expectedHash) return;
    
    const isValid = currentHash.toLowerCase() === expectedHash.toLowerCase();
    
    if (!isValid && integrityConfig.alertOnMismatch) {
      alert('⚠️ Las sumas de verificación no coinciden. El archivo puede estar corrupto.');
    }
    
    return isValid;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const updateStats = (entry) => {
    setStats(prev => ({
      totalValidations: prev.totalValidations + 1,
      successful: prev.successful + (entry.status === 'valid' ? 1 : 0),
      failed: prev.failed + (entry.status === 'invalid' ? 1 : 0),
      corruptedFiles: prev.corruptedFiles + (entry.status === 'invalid' ? 1 : 0)
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFile(files[0]);
      calculateHash(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      calculateHash(file);
    }
  };

  const clearHistory = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el historial?')) {
      setValidationHistory([]);
      setStats({
        totalValidations: 0,
        successful: 0,
        failed: 0,
        corruptedFiles: 0
      });
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(validationHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `integrity_history_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <IntegrityContainer>
      <IntegrityHeader>
        <HeaderTitle>
          🔒 Validación de Integridad
          <StatusBadge $active={integrityConfig.enabled}>
            {integrityConfig.enabled ? 'Activo' : 'Inactivo'}
          </StatusBadge>
        </HeaderTitle>
      </IntegrityHeader>

      <ConfigSection>
        <SectionTitle>Configuración General</SectionTitle>
        <SettingsGrid>
          <SettingField>
            <SettingLabel>Estado del Sistema</SettingLabel>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={integrityConfig.enabled}
                onChange={(e) => handleConfigChange('enabled', e.target.checked)}
              />
              <span style={{ fontSize: '12px' }}>Habilitar validación</span>
            </label>
          </SettingField>

          <SettingField>
            <SettingLabel>Verificación Automática</SettingLabel>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={integrityConfig.autoVerify}
                onChange={(e) => handleConfigChange('autoVerify', e.target.checked)}
              />
              <span style={{ fontSize: '12px' }}>Verificar en descarga</span>
            </label>
          </SettingField>

          <SettingField>
            <SettingLabel>Alertas de Discrepancia</SettingLabel>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={integrityConfig.alertOnMismatch}
                onChange={(e) => handleConfigChange('alertOnMismatch', e.target.checked)}
              />
              <span style={{ fontSize: '12px' }}>Alertar errores</span>
            </label>
          </SettingField>

          <SettingField>
            <SettingLabel>Cuarentena de Archivos</SettingLabel>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={integrityConfig.quarantineCorrupted}
                onChange={(e) => handleConfigChange('quarantineCorrupted', e.target.checked)}
              />
              <span style={{ fontSize: '12px' }}>Aislar corruptos</span>
            </label>
          </SettingField>
        </SettingsGrid>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>Calculadora de Hash</SectionTitle>
        <ValidationCard>
          <ValidationHeader>
            <HashTypeSelector>
              {integrityConfig.hashTypes.map(type => (
                <HashOption
                  key={type}
                  $selected={integrityConfig.selectedHashType === type}
                  onClick={() => handleConfigChange('selectedHashType', type)}
                >
                  {type}
                </HashOption>
              ))}
            </HashTypeSelector>
          </ValidationHeader>

          <ValidationContent>
            <FileUploadArea
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              $dragOver={dragOver}
            >
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
                    📄 {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📁</div>
                  <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                    Arrastra un archivo aquí o haz clic para seleccionar
                  </div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="fileInput"
                  />
                  <label
                    htmlFor="fileInput"
                    style={{
                      color: '#007acc',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textDecoration: 'underline'
                    }}
                  >
                    Seleccionar archivo
                  </label>
                </div>
              )}
            </FileUploadArea>

            {isValidating && (
              <div style={{ margin: '12px 0' }}>
                <ProgressBar>
                  <ProgressFill progress={validationProgress} />
                </ProgressBar>
                <ProgressText>Calculando hash... {validationProgress}%</ProgressText>
              </div>
            )}

            <HashSection>
              <SettingField>
                <SettingLabel>Hash Esperado (Opcional)</SettingLabel>
                <HashInput
                  type="text"
                  placeholder={`Ingresa el hash ${integrityConfig.selectedHashType} esperado...`}
                  value={expectedHash}
                  onChange={(e) => setExpectedHash(e.target.value)}
                />
              </SettingField>

              {currentHash && (
                <SettingField>
                  <SettingLabel>Hash Calculado</SettingLabel>
                  <HashResult>
                    <div style={{ fontFamily: 'monospace', fontSize: '11px', wordBreak: 'break-all' }}>
                      {currentHash}
                    </div>
                    <ActionButton
                      onClick={() => navigator.clipboard.writeText(currentHash)}
                      title="Copiar hash"
                    >
                      📋
                    </ActionButton>
                  </HashResult>
                </SettingField>
              )}

              {currentHash && expectedHash && (
                <ValidationResult>
                  <ResultItem valid={validateHash()}>
                    <ResultIcon>
                      {validateHash() ? '✅' : '❌'}
                    </ResultIcon>
                    <ResultText>
                      {validateHash() ? 
                        'Las sumas de verificación coinciden. El archivo es íntegro.' : 
                        'Las sumas de verificación NO coinciden. El archivo puede estar corrupto.'
                      }
                    </ResultText>
                  </ResultItem>
                </ValidationResult>
              )}
            </HashSection>
          </ValidationContent>
        </ValidationCard>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>Estadísticas</SectionTitle>
        <StatsContainer>
          <StatItem>
            <StatValue>{stats.totalValidations}</StatValue>
            <StatLabel>Total Validaciones</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: '#28a745' }}>{stats.successful}</StatValue>
            <StatLabel>Exitosas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: '#dc3545' }}>{stats.failed}</StatValue>
            <StatLabel>Fallidas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ color: '#ffc107' }}>{stats.corruptedFiles}</StatValue>
            <StatLabel>Archivos Corruptos</StatLabel>
          </StatItem>
        </StatsContainer>
      </ConfigSection>

      <HistorySection>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <SectionTitle>Historial de Validaciones</SectionTitle>
          <div style={{ display: 'flex', gap: '8px' }}>
            <ActionButton onClick={exportHistory}>📤 Exportar</ActionButton>
            <ActionButton onClick={clearHistory}>🗑️ Limpiar</ActionButton>
          </div>
        </div>

        <HistoryList>
          {validationHistory.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '24px', 
              color: '#666', 
              fontSize: '12px' 
            }}>
              No hay validaciones en el historial
            </div>
          ) : (
            validationHistory.map(entry => (
              <HistoryItem key={entry.id} status={entry.status}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    📄 {entry.fileName}
                  </div>
                  <HistoryMeta>
                    <span>{entry.hashType}</span>
                    <span>{entry.fileSize}</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </HistoryMeta>
                  {entry.status === 'invalid' && (
                    <AlertContainer style={{ marginTop: '4px' }}>
                      <AlertIcon>⚠️</AlertIcon>
                      <AlertMessage>Hash no coincide - Posible corrupción</AlertMessage>
                    </AlertContainer>
                  )}
                </div>
                <div style={{ 
                  color: entry.status === 'valid' ? '#28a745' : 
                         entry.status === 'invalid' ? '#dc3545' : '#6c757d',
                  fontSize: '18px'
                }}>
                  {entry.status === 'valid' ? '✅' : 
                   entry.status === 'invalid' ? '❌' : 'ℹ️'}
                </div>
              </HistoryItem>
            ))
          )}
        </HistoryList>
      </HistorySection>
    </IntegrityContainer>
  );
};

export default IntegrityValidation;
