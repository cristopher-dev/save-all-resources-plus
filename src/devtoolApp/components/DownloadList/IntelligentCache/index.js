import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaDatabase, FaTrash, FaBroom, FaChartLine, FaSync, FaExternalLinkAlt, FaClock, FaMemory, FaCompressArrowsAlt } from 'react-icons/fa';
import { useStore } from '../../../store';
import { useAppTheme } from '../../../hooks/useAppTheme';
import {
  CacheContainer,
  CacheHeader,
  CacheTitle,
  CacheContent,
  CacheSection,
  CacheSectionTitle,
  CacheStats,
  StatCard,
  StatValue,
  StatLabel, 
  StatIcon,
  CacheActions,
  ActionButton,
  CacheList,
  CacheItem,
  CacheItemInfo,
  CacheItemName,
  CacheItemMeta,
  CacheItemActions,
  CacheSettings,
  SettingRow,
  SettingLabel,
  SettingInput,
  CachePolicy,
  PolicyButton,
  CacheMetrics,
  MetricBar,
  MetricLabel,
  CompressionStats,
  CompressionCard
} from './styles';
import { simulateCacheData, formatBytes, formatTime } from './cacheHelpers';

const CACHE_POLICIES = {
  'aggressive': { label: 'Agresivo', ttl: 24 * 60 * 60 * 1000, description: '24 horas' },
  'moderate': { label: 'Moderado', ttl: 12 * 60 * 60 * 1000, description: '12 horas' },
  'conservative': { label: 'Conservador', ttl: 6 * 60 * 60 * 1000, description: '6 horas' },
  'minimal': { label: 'Mínimo', ttl: 1 * 60 * 60 * 1000, description: '1 hora' }
};

const IntelligentCache = () => {
  const { state } = useStore();
  const { downloadList } = state;
  const { theme } = useAppTheme();
  
  const [expanded, setExpanded] = useState(false);
  const [cacheData, setCacheData] = useState({});
  const [cacheStats, setCacheStats] = useState({
    totalItems: 0,
    totalSize: 0,
    hitRate: 85,
    compressionRatio: 65,
    lastCleanup: new Date()
  });
  const [cachePolicy, setCachePolicy] = useState('moderate');
  const [maxCacheSize, setMaxCacheSize] = useState(100); // MB
  const [compressionLevel, setCompressionLevel] = useState(6);
  const [autoCleanup, setAutoCleanup] = useState(true);

  const toggleExpanded = () => setExpanded(!expanded);

  // Simular datos de caché basados en downloadList
  useEffect(() => {
    const { cache, totalSize } = simulateCacheData(downloadList, cachePolicy, cacheStats.compressionRatio, CACHE_POLICIES);
    setCacheData(cache);
    setCacheStats(prev => ({
      ...prev,
      totalItems: Object.keys(cache).length,
      totalSize
    }));
  }, [downloadList, cachePolicy, cacheStats.compressionRatio]);

  // Estadísticas calculadas
  const cacheMetrics = useMemo(() => {
    const entries = Object.values(cacheData);
    const expiredCount = entries.filter(item => item.isExpired).length;
    const totalOriginalSize = entries.reduce((sum, item) => sum + item.originalSize, 0);
    const spaceSaved = totalOriginalSize - cacheStats.totalSize;
    const averageCompressionRatio = totalOriginalSize > 0 ? 
      Math.round((spaceSaved / totalOriginalSize) * 100) : 0;
    
    return {
      validItems: entries.length - expiredCount,
      expiredItems: expiredCount,
      spaceSaved: spaceSaved,
      averageCompressionRatio,
      cacheUsage: Math.round((cacheStats.totalSize / (maxCacheSize * 1024 * 1024)) * 100),
      mostAccessed: entries.sort((a, b) => b.accessCount - a.accessCount).slice(0, 3)
    };
  }, [cacheData, cacheStats.totalSize, maxCacheSize]);

  // Funciones de manejo de caché
  const clearCache = useCallback(() => {
    setCacheData({});
    setCacheStats(prev => ({
      ...prev,
      totalItems: 0,
      totalSize: 0,
      lastCleanup: new Date()
    }));
  }, []);

  const cleanupExpired = useCallback(() => {
    setCacheData(prev => {
      const newCache = {};
      Object.entries(prev).forEach(([key, item]) => {
        if (!item.isExpired) {
          newCache[key] = item;
        }
      });
      return newCache;
    });
    
    setCacheStats(prev => ({
      ...prev,
      lastCleanup: new Date()
    }));
  }, []);

  const removeCacheItem = useCallback((hash) => {
    setCacheData(prev => {
      const newCache = { ...prev };
      delete newCache[hash];
      return newCache;
    });
  }, []);

  const handleCachePolicyChange = (key) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setCachePolicy(key);
  };

  const handleOpenUrl = (url) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    window.open(url, '_blank');
  };

  const handleRemoveCacheItem = (hash) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    removeCacheItem(hash);
  };

  const compressCache = useCallback(() => {
    // Simular re-compresión con mejor ratio
    setCacheStats(prev => ({
      ...prev,
      compressionRatio: Math.min(prev.compressionRatio + 5, 90)
    }));
  }, []);

  const cacheEntries = Object.entries(cacheData).slice(0, 10); // Mostrar solo 10 elementos

  return (
    <CacheContainer>
      <CacheHeader expanded={expanded} onClick={toggleExpanded}>
        <CacheTitle>
          <FaDatabase style={{ marginRight: '8px' }} />
          🧠 Caché Inteligente
          {cacheStats.totalItems > 0 && ` (${cacheStats.totalItems} elementos)`}
        </CacheTitle>
      </CacheHeader>

      <CacheContent expanded={expanded}>
        <CacheStats>
          <StatCard>
            <StatIcon><FaMemory /></StatIcon>
            <StatValue>{formatBytes(cacheStats.totalSize)}</StatValue>
            <StatLabel>Tamaño Total</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaCompressArrowsAlt /></StatIcon>
            <StatValue>{cacheStats.compressionRatio}%</StatValue>
            <StatLabel>Compresión</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaChartLine /></StatIcon>
            <StatValue>{cacheStats.hitRate}%</StatValue>
            <StatLabel>Hit Rate</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatIcon><FaClock /></StatIcon>
            <StatValue>{formatBytes(cacheMetrics.spaceSaved)}</StatValue>
            <StatLabel>Espacio Ahorrado</StatLabel>
          </StatCard>
        </CacheStats>

        <CacheSection>
          <CacheSectionTitle>⚙️ Configuración de Caché</CacheSectionTitle>
          
          <CacheSettings>
            <SettingRow>
              <SettingLabel>Política de Caché:</SettingLabel>
              <CachePolicy>
                {Object.entries(CACHE_POLICIES).map(([key, policy]) => (
                  <PolicyButton
                    key={key}
                    active={cachePolicy === key}
                    onClick={handleCachePolicyChange(key)}
                  >
                    {policy.label}
                    <small>({policy.description})</small>
                  </PolicyButton>
                ))}
              </CachePolicy>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Tamaño Máximo (MB):</SettingLabel>
              <SettingInput
                type="number"
                value={maxCacheSize}
                onChange={(e) => setMaxCacheSize(parseInt(e.target.value) || 100)}
                min="10"
                max="1000"
              />
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Nivel de Compresión (1-9):</SettingLabel>
              <SettingInput
                type="range"
                value={compressionLevel}
                onChange={(e) => setCompressionLevel(parseInt(e.target.value))}
                min="1"
                max="9"
              />
              <span style={{ marginLeft: '8px' }}>{compressionLevel}</span>
            </SettingRow>
            
            <SettingRow>
              <SettingLabel>Limpieza Automática:</SettingLabel>
              <input
                type="checkbox"
                checked={autoCleanup}
                onChange={(e) => setAutoCleanup(e.target.checked)}
              />
            </SettingRow>
          </CacheSettings>
        </CacheSection>

        <CacheSection>
          <CacheSectionTitle>📊 Métricas de Rendimiento</CacheSectionTitle>
          
          <CacheMetrics>
            <div>              <MetricLabel>Uso de Caché: {cacheMetrics.cacheUsage}%</MetricLabel>
              <MetricBar>
                <div style={{ 
                  width: `${Math.min(cacheMetrics.cacheUsage, 100)}%`,
                  height: '100%',
                  backgroundColor: cacheMetrics.cacheUsage > 80 ? theme.colors.error : cacheMetrics.cacheUsage > 60 ? theme.colors.warning : theme.colors.success,
                  borderRadius: '4px',
                  transition: 'all 0.3s ease'
                }} />
              </MetricBar>
            </div>
            
            <div>
              <MetricLabel>Elementos Válidos: {cacheMetrics.validItems} / Expirados: {cacheMetrics.expiredItems}</MetricLabel>
              <MetricBar>
                <div style={{ 
                  width: `${Math.round((cacheMetrics.validItems / (cacheMetrics.validItems + cacheMetrics.expiredItems || 1)) * 100)}%`,
                  height: '100%',
                  backgroundColor: theme.colors.success,
                  borderRadius: '4px'
                }} />
              </MetricBar>
            </div>
          </CacheMetrics>
        </CacheSection>

        <CacheSection>
          <CacheSectionTitle>🗂️ Elementos en Caché</CacheSectionTitle>
          
          <CacheActions>
            <ActionButton color="primary" onClick={compressCache}>
              <FaCompressArrowsAlt />
              Re-comprimir
            </ActionButton>
            <ActionButton color="warning" onClick={cleanupExpired}>
              <FaBroom />
              Limpiar Expirados ({cacheMetrics.expiredItems})
            </ActionButton>
            <ActionButton color="danger" onClick={clearCache}>
              <FaTrash />
              Vaciar Caché
            </ActionButton>
          </CacheActions>
          
          {cacheEntries.length > 0 ? (
            <CacheList>
              {cacheEntries.map(([hash, item]) => (
                <CacheItem key={hash} expired={item.isExpired}>
                  <CacheItemInfo>
                    <CacheItemName>
                      {item.url.split('/').pop() || 'Sin nombre'}
                      {item.isExpired && <span style={{ color: theme.colors.error, marginLeft: '8px' }}>(Expirado)</span>}
                    </CacheItemName>
                    <CacheItemMeta>
                      {formatBytes(item.compressedSize)} | {item.compressionAlgorithm} | 
                      Accesos: {item.accessCount} | Cacheado: {formatTime(item.cachedAt)}
                    </CacheItemMeta>
                  </CacheItemInfo>
                  <CacheItemActions>
                    <ActionButton 
                      size="small" 
                      color="primary" 
                      onClick={handleOpenUrl(item.url)}
                    >
                      <FaExternalLinkAlt />
                    </ActionButton>
                    <ActionButton 
                      size="small" 
                      color="danger" 
                      onClick={handleRemoveCacheItem(hash)}
                    >
                      <FaTrash />
                    </ActionButton>
                  </CacheItemActions>
                </CacheItem>
              ))}
            </CacheList>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
              <FaDatabase size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <div>
                No hay elementos en caché.<br />
                Los recursos se cachearán automáticamente durante las descargas.
              </div>
            </div>
          )}
        </CacheSection>

        {cacheMetrics.mostAccessed.length > 0 && (
          <CacheSection>
            <CacheSectionTitle>🔥 Recursos Más Accedidos</CacheSectionTitle>            <div style={{ display: 'grid', gap: '8px' }}>
              {cacheMetrics.mostAccessed.map((item, index) => (
                <div key={item.hash} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: theme.colors.backgroundAlt,
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <span>#{index + 1} {item.url.split('/').pop()}</span>
                  <span style={{ color: theme.colors.textSecondary }}>{item.accessCount} accesos</span>
                </div>
              ))}
            </div>
          </CacheSection>
        )}
      </CacheContent>
    </CacheContainer>
  );
};

export default IntelligentCache;
