import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FaCompressArrowsAlt, FaFileArchive, FaCog, FaDownload, FaChartLine, FaSpinner, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useStore } from '../../../store';
import {
  CompressionContainer,
  CompressionHeader,
  CompressionTitle,
  CompressionContent,
  CompressionSection,
  CompressionSectionTitle,
  CompressionStats,
  StatCard,
  StatValue,
  StatLabel,
  StatIcon,
  CompressionSettings,
  SettingRow,
  SettingLabel,
  SettingSelect,
  SettingInput,
  SettingCheckbox,
  FormatOptions,
  FormatOption,
  FormatIcon,
  FormatName,
  FormatDescription,
  CompressionActions,
  ActionButton,
  CompressionProgress,
  ProgressBar,
  ProgressText,
  CompressionResults,
  ResultItem,
  ResultInfo,
  ResultSize,
  ResultActions,
  AdvancedOptions,
  OptionGroup,
  OptionTitle,
  CompressionPreview,
  PreviewTable,
  PreviewRow,
  PreviewCell
} from './styles';
import { formatBytes, simulateCompressionStats } from './compressionHelpers';

const COMPRESSION_FORMATS = {
  'zip': {
    name: 'ZIP',
    icon: '📦',
    description: 'Formato estándar con buena compatibilidad',
    extension: '.zip',
    supportsBatch: true,
    averageRatio: 65,
    speed: 'Rápido'
  },
  'gzip': {
    name: 'GZIP',
    icon: '🗜️',
    description: 'Excelente compresión para archivos individuales',
    extension: '.gz',
    supportsBatch: false,
    averageRatio: 75,
    speed: 'Medio'
  },
  'bzip2': {
    name: 'BZIP2',
    icon: '📋',
    description: 'Mayor compresión, más lento',
    extension: '.bz2',
    supportsBatch: false,
    averageRatio: 80,
    speed: 'Lento'
  },
  '7z': {
    name: '7-Zip',
    icon: '🔧',
    description: 'Máxima compresión disponible',
    extension: '.7z',
    supportsBatch: true,
    averageRatio: 85,
    speed: 'Muy Lento'
  },
  'tar.gz': {
    name: 'TAR.GZ',
    icon: '📚',
    description: 'Estándar en sistemas Unix/Linux',
    extension: '.tar.gz',
    supportsBatch: true,
    averageRatio: 70,
    speed: 'Medio'
  },
  'rar': {
    name: 'RAR',
    icon: '📁',
    description: 'Buena compresión con recuperación de errores',
    extension: '.rar',
    supportsBatch: true,
    averageRatio: 78,
    speed: 'Medio'
  }
};

const COMPRESSION_LEVELS = {
  1: { name: 'Mínimo', description: 'Más rápido, menos compresión' },
  3: { name: 'Rápido', description: 'Buen balance velocidad/compresión' },
  6: { name: 'Normal', description: 'Compresión estándar' },
  9: { name: 'Máximo', description: 'Mejor compresión, más lento' }
};

const EnhancedCompression = () => {
  const { state } = useStore();
  const { downloadList } = state;
  
  const [expanded, setExpanded] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('zip');
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [password, setPassword] = useState('');
  const [splitArchive, setSplitArchive] = useState(false);
  const [splitSize, setSplitSize] = useState(50); // MB
  const [excludeEmpty, setExcludeEmpty] = useState(true);
  const [addMetadata, setAddMetadata] = useState(true);
  const [compressing, setCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);
  const [compressionResults, setCompressionResults] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  // Estadísticas calculadas
  const compressionStats = useMemo(() => simulateCompressionStats(downloadList, selectedFormat, compressionLevel, COMPRESSION_FORMATS), [downloadList, selectedFormat, compressionLevel]);

  // Simular proceso de compresión
  const startCompression = useCallback(async () => {
    if (compressionStats.totalFiles === 0) return;
    
    setCompressing(true);
    setCompressionProgress(0);
    
    // Simular progreso de compresión
    const totalSteps = compressionStats.totalFiles;
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setCompressionProgress(Math.round((i / totalSteps) * 100));
    }
    
    // Crear resultado simulado
    const format = COMPRESSION_FORMATS[selectedFormat];
    const result = {
      id: Date.now(),
      format: selectedFormat,
      filename: `resources_${new Date().toISOString().split('T')[0]}${format.extension}`,
      originalSize: compressionStats.originalSize,
      compressedSize: compressionStats.estimatedSize,
      compressionRatio: compressionStats.estimatedRatio,
      filesCount: compressionStats.totalFiles,
      createdAt: new Date(),
      protected: password.length > 0,
      splitParts: splitArchive ? Math.ceil(compressionStats.estimatedSize / (splitSize * 1024 * 1024)) : 1
    };
    
    setCompressionResults(prev => [result, ...prev.slice(0, 4)]); // Mantener solo 5 resultados
    setCompressing(false);
    setCompressionProgress(0);
  }, [compressionStats, selectedFormat, password, splitArchive, splitSize]);

  // Eliminar resultado
  const deleteResult = useCallback((id) => {
    setCompressionResults(prev => prev.filter(result => result.id !== id));
  }, []);

  // Descargar resultado (simulado)
  const downloadResult = useCallback((result) => {
    // En una implementación real, aquí se descargaría el archivo
    console.log('Descargando:', result.filename);
  }, []);

  const getSpeedColor = (speed) => {
    switch (speed) {
      case 'Muy Rápido': return '#4ecdc4';
      case 'Rápido': return '#48cae4';
      case 'Medio': return '#feca57';
      case 'Lento': return '#ff9ff3';
      case 'Muy Lento': return '#ff6b6b';
      default: return '#666';
    }
  };

  return (
    <CompressionContainer>
      <CompressionHeader expanded={expanded} onClick={toggleExpanded}>
        <CompressionTitle>
          <FaCompressArrowsAlt style={{ marginRight: '8px' }} />
          🗜️ Compresión Avanzada
          {compressionStats.totalFiles > 0 && ` (${compressionStats.totalFiles} archivos)`}
        </CompressionTitle>
      </CompressionHeader>

      <CompressionContent expanded={expanded}>
        <CompressionStats>
          <StatCard>
            <StatIcon><FaFileArchive /></StatIcon>
            <StatValue>{compressionStats.totalFiles}</StatValue>
            <StatLabel>Archivos</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaCompressArrowsAlt /></StatIcon>
            <StatValue>{formatBytes(compressionStats.originalSize)}</StatValue>
            <StatLabel>Tamaño Original</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaChartLine /></StatIcon>
            <StatValue>{formatBytes(compressionStats.estimatedSize)}</StatValue>
            <StatLabel>Tamaño Estimado</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaCheckCircle /></StatIcon>
            <StatValue>{compressionStats.estimatedRatio}%</StatValue>
            <StatLabel>Compresión</StatLabel>
          </StatCard>
        </CompressionStats>

        <CompressionSection>
          <CompressionSectionTitle>📦 Formato de Compresión</CompressionSectionTitle>
          
          <FormatOptions>
            {Object.entries(COMPRESSION_FORMATS).map(([key, format]) => (
              <FormatOption
                key={key}
                selected={selectedFormat === key}
                onClick={() => setSelectedFormat(key)}
              >
                <FormatIcon>{format.icon}</FormatIcon>
                <FormatName>{format.name}</FormatName>
                <FormatDescription>
                  {format.description}
                  <br />
                  <small style={{ color: getSpeedColor(format.speed) }}>
                    {format.speed} • ~{format.averageRatio}% compresión
                  </small>
                </FormatDescription>
              </FormatOption>
            ))}
          </FormatOptions>
        </CompressionSection>

        <CompressionSection>
          <CompressionSectionTitle>⚙️ Configuración</CompressionSectionTitle>
          
          <CompressionSettings>
            <SettingRow>
              <SettingLabel>Nivel de Compresión:</SettingLabel>
              <SettingSelect 
                value={compressionLevel} 
                onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
              >
                {Object.entries(COMPRESSION_LEVELS).map(([level, info]) => (
                  <option key={level} value={level}>
                    {info.name} - {info.description}
                  </option>
                ))}
              </SettingSelect>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Contraseña:</SettingLabel>
              <SettingInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Opcional - Proteger con contraseña"
              />
            </SettingRow>
            
            <AdvancedOptions>
              <OptionGroup>
                <OptionTitle>Opciones Avanzadas</OptionTitle>
                
                <SettingRow>
                  <SettingCheckbox
                    type="checkbox"
                    checked={splitArchive}
                    onChange={(e) => setSplitArchive(e.target.checked)}
                  />
                  <SettingLabel>Dividir archivo grande</SettingLabel>
                  {splitArchive && (
                    <>
                      <SettingInput
                        type="number"
                        value={splitSize}
                        onChange={(e) => setSplitSize(parseInt(e.target.value) || 50)}
                        min="1"
                        max="1000"
                        style={{ width: '80px', marginLeft: '8px' }}
                      />
                      <span style={{ marginLeft: '4px' }}>MB por parte</span>
                    </>
                  )}
                </SettingRow>
                
                <SettingRow>
                  <SettingCheckbox
                    type="checkbox"
                    checked={excludeEmpty}
                    onChange={(e) => setExcludeEmpty(e.target.checked)}
                  />
                  <SettingLabel>Excluir archivos vacíos</SettingLabel>
                </SettingRow>
                
                <SettingRow>
                  <SettingCheckbox
                    type="checkbox"
                    checked={addMetadata}
                    onChange={(e) => setAddMetadata(e.target.checked)}
                  />
                  <SettingLabel>Incluir metadatos</SettingLabel>
                </SettingRow>
              </OptionGroup>
            </AdvancedOptions>
          </CompressionSettings>
        </CompressionSection>

        {compressionStats.totalFiles > 0 && (
          <CompressionSection>
            <CompressionSectionTitle>📊 Vista Previa</CompressionSectionTitle>
            
            <CompressionPreview>
              <PreviewTable>
                <PreviewRow header>
                  <PreviewCell>Propiedad</PreviewCell>
                  <PreviewCell>Valor</PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Formato</PreviewCell>
                  <PreviewCell>{COMPRESSION_FORMATS[selectedFormat].name}</PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Archivos incluidos</PreviewCell>
                  <PreviewCell>{compressionStats.totalFiles}</PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Tamaño original</PreviewCell>
                  <PreviewCell>{formatBytes(compressionStats.originalSize)}</PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Tamaño estimado</PreviewCell>
                  <PreviewCell>{formatBytes(compressionStats.estimatedSize)}</PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Espacio ahorrado</PreviewCell>
                  <PreviewCell style={{ color: '#4ecdc4', fontWeight: 'bold' }}>
                    {formatBytes(compressionStats.spaceSaved)} ({compressionStats.estimatedRatio}%)
                  </PreviewCell>
                </PreviewRow>
                <PreviewRow>
                  <PreviewCell>Protegido</PreviewCell>
                  <PreviewCell>{password ? 'Sí' : 'No'}</PreviewCell>
                </PreviewRow>
                {splitArchive && (
                  <PreviewRow>
                    <PreviewCell>Partes</PreviewCell>
                    <PreviewCell>{Math.ceil(compressionStats.estimatedSize / (splitSize * 1024 * 1024))}</PreviewCell>
                  </PreviewRow>
                )}
              </PreviewTable>
            </CompressionPreview>
          </CompressionSection>
        )}

        <CompressionSection>
          <CompressionActions>
            <ActionButton 
              color="primary" 
              onClick={startCompression}
              disabled={compressing || compressionStats.totalFiles === 0}
            >
              {compressing ? <FaSpinner className="spinning" /> : <FaCompressArrowsAlt />}
              {compressing ? 'Comprimiendo...' : 'Iniciar Compresión'}
            </ActionButton>
            
            <ActionButton 
              color="secondary" 
              onClick={() => setPreviewMode(!previewMode)}
              disabled={compressionStats.totalFiles === 0}
            >
              <FaCog />
              {previewMode ? 'Ocultar Vista Previa' : 'Vista Previa'}
            </ActionButton>
          </CompressionActions>

          {compressing && (
            <CompressionProgress>
              <ProgressText>
                Procesando archivos... {compressionProgress}%
              </ProgressText>
              <ProgressBar>
                <div style={{
                  width: `${compressionProgress}%`,
                  height: '100%',
                  backgroundColor: '#667eea',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </ProgressBar>
            </CompressionProgress>
          )}
        </CompressionSection>

        {compressionResults.length > 0 && (
          <CompressionSection>
            <CompressionSectionTitle>📁 Archivos Generados</CompressionSectionTitle>
            
            <CompressionResults>
              {compressionResults.map((result) => (
                <ResultItem key={result.id}>
                  <ResultInfo>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {COMPRESSION_FORMATS[result.format].icon} {result.filename}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {formatBytes(result.compressedSize)} • {result.compressionRatio}% compresión • 
                      {result.filesCount} archivos • {result.createdAt.toLocaleString()}
                      {result.protected && ' • 🔒 Protegido'}
                      {result.splitParts > 1 && ` • ${result.splitParts} partes`}
                    </div>
                  </ResultInfo>
                  <ResultActions>
                    <ActionButton
                      size="small"
                      color="primary"
                      onClick={() => downloadResult(result)}
                    >
                      <FaDownload />
                    </ActionButton>
                    <ActionButton
                      size="small"
                      color="danger"
                      onClick={() => deleteResult(result.id)}
                    >
                      ×
                    </ActionButton>
                  </ResultActions>
                </ResultItem>
              ))}
            </CompressionResults>
          </CompressionSection>
        )}

        {compressionStats.totalFiles === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
            <FaFileArchive size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
            <div>
              No hay archivos para comprimir.<br />
              Agrega recursos a la lista de descarga para habilitar la compresión.
            </div>
          </div>
        )}
      </CompressionContent>
    </CompressionContainer>
  );
};

export default EnhancedCompression;
