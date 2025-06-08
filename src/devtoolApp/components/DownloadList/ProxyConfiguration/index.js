import React, { useState, useEffect } from 'react';
import { useStore } from 'devtoolApp/store';
import {
  ProxyContainer,
  ProxyHeader,
  HeaderTitle,
  StatusBadge,
  ConfigSection,
  SectionTitle,
  ProxyCard,
  ProxyTypeSelector,
  ProxyOption,
  ProxyForm,
  FormGrid,
  FormField,
  FormLabel,
  FormInput,
  FormSelect,
  AuthSection,
  AuthToggle,
  TestSection,
  TestButton,
  TestResult,
  PresetSection,
  PresetGrid,
  PresetCard,
  PresetTitle,
  PresetDescription,
  ProxyRules,
  RuleItem,
  RuleInput,
  RuleButton,
  AdvancedSettings,
  SettingsGrid,
  StatusIndicator,
  ConnectionStats,
  StatItem,
  StatValue,
  StatLabel
} from './styles';

const ProxyConfiguration = () => {
  const { state, dispatch } = useStore();
  const [proxyConfig, setProxyConfig] = useState({
    enabled: false,
    type: 'http', // http, https, socks4, socks5, pac
    host: '',
    port: '',
    username: '',
    password: '',
    requireAuth: false,
    pacUrl: '',
    bypassList: [],
    timeout: 10000,
    retries: 3,
    keepAlive: true,
    useSystemProxy: false
  });

  const [testResult, setTestResult] = useState(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    successful: 0,
    failed: 0,
    avgLatency: 0,
    lastTest: null
  });

  const proxyPresets = [
    {
      name: 'HTTP Proxy',
      description: 'Proxy HTTP estándar para navegación web',
      config: { type: 'http', port: '8080', timeout: 10000 }
    },
    {
      name: 'HTTPS Proxy',
      description: 'Proxy HTTPS seguro con cifrado',
      config: { type: 'https', port: '8443', timeout: 15000 }
    },
    {
      name: 'SOCKS5 Proxy',
      description: 'Proxy SOCKS5 para máxima compatibilidad',
      config: { type: 'socks5', port: '1080', timeout: 20000 }
    },
    {
      name: 'Corporate Proxy',
      description: 'Configuración típica para entornos corporativos',
      config: { type: 'http', port: '3128', requireAuth: true, timeout: 30000 }
    }
  ];

  useEffect(() => {
    // Cargar configuración del store
    const savedConfig = state.option?.proxyConfig || {};
    setProxyConfig(prev => ({ ...prev, ...savedConfig }));
  }, [state.option]);

  const handleConfigChange = (key, value) => {
    setProxyConfig(prev => {
      const newConfig = { ...prev, [key]: value };
      // Guardar en el store usando dispatch
      // dispatch(setProxyConfig(newConfig)); // Necesitarías crear esta acción
      return newConfig;
    });
  };

  const handleBypassRuleAdd = (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const newRule = prompt('Ingrese el dominio o patrón para omitir el proxy:');
    if (newRule && newRule.trim()) {
      handleConfigChange('bypassList', [...proxyConfig.bypassList, newRule.trim()]);
    }
  };

  const handleBypassRuleRemove = (index) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const newList = proxyConfig.bypassList.filter((_, i) => i !== index);
    handleConfigChange('bypassList', newList);
  };

  const testProxyConnection = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setIsTestingConnection(true);
    setTestResult(null);

    try {
      const startTime = Date.now();
      
      // Simular prueba de conexión
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const latency = Date.now() - startTime;
      const success = Math.random() > 0.3; // 70% probabilidad de éxito
      
      if (success) {
        setTestResult({
          success: true,
          message: `Conexión exitosa (${latency}ms)`,
          latency,
          proxyInfo: {
            ip: '192.168.1.100',
            location: 'Local Network',
            anonymity: proxyConfig.type === 'socks5' ? 'High' : 'Medium'
          }
        });
        
        setConnectionStats(prev => ({
          successful: prev.successful + 1,
          failed: prev.failed,
          avgLatency: Math.round((prev.avgLatency + latency) / 2),
          lastTest: new Date().toLocaleString()
        }));
      } else {
        throw new Error('Connection timeout');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Error de conexión: ${error.message}`,
        error: error.message
      });
      
      setConnectionStats(prev => ({
        successful: prev.successful,
        failed: prev.failed + 1,
        avgLatency: prev.avgLatency,
        lastTest: new Date().toLocaleString()
      }));
    } finally {
      setIsTestingConnection(false);
    }
  };

  const applyPreset = (preset) => (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const newConfig = { ...proxyConfig, ...preset.config };
    setProxyConfig(newConfig);
    optionStore.setState(state => ({
      ...state,
      proxyConfig: newConfig
    }));
  };

  const detectSystemProxy = async (event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Simular detección de proxy del sistema
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const systemProxy = {
        type: 'http',
        host: 'proxy.company.com',
        port: '8080',
        useSystemProxy: true
      };
      
      setProxyConfig(prev => ({ ...prev, ...systemProxy }));
      optionStore.setState(state => ({
        ...state,
        proxyConfig: { ...state.proxyConfig, ...systemProxy }
      }));
    } catch (error) {
      console.error('No se pudo detectar el proxy del sistema:', error);
    }
  };

  return (
    <ProxyContainer>
      <ProxyHeader>
        <HeaderTitle>
          🌐 Configuración de Proxy
          <StatusBadge $active={proxyConfig.enabled}>
            {proxyConfig.enabled ? 'Activo' : 'Inactivo'}
          </StatusBadge>
        </HeaderTitle>
      </ProxyHeader>

      <ConfigSection>
        <ProxyCard>
          <ProxyTypeSelector>
            <SectionTitle>Tipo de Proxy</SectionTitle>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {['http', 'https', 'socks4', 'socks5', 'pac'].map(type => (
                <ProxyOption
                  key={type}
                  $selected={proxyConfig.type === type}
                  onClick={(event) => {
                    if (event) {
                      event.preventDefault();
                      event.stopPropagation();
                    }
                    handleConfigChange('type', type);
                  }}
                >
                  {type.toUpperCase()}
                </ProxyOption>
              ))}
            </div>
          </ProxyTypeSelector>

          <ProxyForm>
            <FormGrid>
              <FormField>
                <FormLabel>Estado</FormLabel>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={proxyConfig.enabled}
                    onChange={(e) => handleConfigChange('enabled', e.target.checked)}
                  />
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    Habilitar proxy
                  </span>
                </label>
              </FormField>

              <FormField>
                <FormLabel>Usar proxy del sistema</FormLabel>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={proxyConfig.useSystemProxy}
                    onChange={(e) => handleConfigChange('useSystemProxy', e.target.checked)}
                  />
                  <TestButton onClick={detectSystemProxy}>
                    🔍 Detectar
                  </TestButton>
                </div>
              </FormField>

              {proxyConfig.type !== 'pac' && !proxyConfig.useSystemProxy && (
                <>
                  <FormField>
                    <FormLabel>Host/Servidor</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="proxy.ejemplo.com"
                      value={proxyConfig.host}
                      onChange={(e) => handleConfigChange('host', e.target.value)}
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>Puerto</FormLabel>
                    <FormInput
                      type="number"
                      placeholder="8080"
                      value={proxyConfig.port}
                      onChange={(e) => handleConfigChange('port', e.target.value)}
                    />
                  </FormField>
                </>
              )}

              {proxyConfig.type === 'pac' && (
                <FormField style={{ gridColumn: '1 / -1' }}>
                  <FormLabel>URL del archivo PAC</FormLabel>
                  <FormInput
                    type="url"
                    placeholder="http://ejemplo.com/proxy.pac"
                    value={proxyConfig.pacUrl}
                    onChange={(e) => handleConfigChange('pacUrl', e.target.value)}
                  />
                </FormField>
              )}
            </FormGrid>

            <AuthSection>
              <AuthToggle>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={proxyConfig.requireAuth}
                    onChange={(e) => handleConfigChange('requireAuth', e.target.checked)}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    Requiere autenticación
                  </span>
                </label>
              </AuthToggle>

              {proxyConfig.requireAuth && (
                <FormGrid>
                  <FormField>
                    <FormLabel>Usuario</FormLabel>
                    <FormInput
                      type="text"
                      placeholder="usuario"
                      value={proxyConfig.username}
                      onChange={(e) => handleConfigChange('username', e.target.value)}
                    />
                  </FormField>

                  <FormField>
                    <FormLabel>Contraseña</FormLabel>
                    <FormInput
                      type="password"
                      placeholder="••••••••"
                      value={proxyConfig.password}
                      onChange={(e) => handleConfigChange('password', e.target.value)}
                    />
                  </FormField>
                </FormGrid>
              )}
            </AuthSection>
          </ProxyForm>
        </ProxyCard>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>Presets de Configuración</SectionTitle>
        <PresetGrid>
          {proxyPresets.map((preset, index) => (
            <PresetCard key={index} onClick={(event) => applyPreset(preset)(event)}>
              <PresetTitle>{preset.name}</PresetTitle>
              <PresetDescription>{preset.description}</PresetDescription>
            </PresetCard>
          ))}
        </PresetGrid>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>Reglas de Bypass</SectionTitle>
        <ProxyRules>
          {proxyConfig.bypassList.map((rule, index) => (
            <RuleItem key={index}>
              <RuleInput value={rule} readOnly />
              <RuleButton onClick={(event) => handleBypassRuleRemove(index)(event)}>
                ❌
              </RuleButton>
            </RuleItem>
          ))}
          <RuleButton onClick={handleBypassRuleAdd} style={{ marginTop: '8px' }}>
            ➕ Agregar regla
          </RuleButton>
        </ProxyRules>
      </ConfigSection>

      <ConfigSection>
        <SectionTitle>Configuración Avanzada</SectionTitle>
        <AdvancedSettings>
          <SettingsGrid>
            <FormField>
              <FormLabel>Timeout (ms)</FormLabel>
              <FormInput
                type="number"
                value={proxyConfig.timeout}
                onChange={(e) => handleConfigChange('timeout', parseInt(e.target.value) || 10000)}
              />
            </FormField>

            <FormField>
              <FormLabel>Reintentos</FormLabel>
              <FormInput
                type="number"
                min="0"
                max="10"
                value={proxyConfig.retries}
                onChange={(e) => handleConfigChange('retries', parseInt(e.target.value) || 0)}
              />
            </FormField>

            <FormField>
              <FormLabel>Keep-Alive</FormLabel>
              <input
                type="checkbox"
                checked={proxyConfig.keepAlive}
                onChange={(e) => handleConfigChange('keepAlive', e.target.checked)}
              />
            </FormField>
          </SettingsGrid>
        </AdvancedSettings>
      </ConfigSection>

      <TestSection>
        <SectionTitle>Prueba de Conexión</SectionTitle>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <TestButton
            onClick={testProxyConnection}
            disabled={isTestingConnection || !proxyConfig.enabled}
          >
            {isTestingConnection ? '⏳ Probando...' : '🔍 Probar Conexión'}
          </TestButton>
          
          <StatusIndicator
            type={testResult?.success ? 'success' : testResult?.success === false ? 'error' : 'default'}
          />
        </div>

        {testResult && (
          <TestResult success={testResult.success}>
            <div style={{ fontWeight: '500', marginBottom: '4px' }}>
              {testResult.success ? '✅' : '❌'} {testResult.message}
            </div>
            {testResult.proxyInfo && (
              <div style={{ fontSize: '11px', opacity: '0.8' }}>
                IP: {testResult.proxyInfo.ip} | 
                Ubicación: {testResult.proxyInfo.location} | 
                Anonimato: {testResult.proxyInfo.anonymity}
              </div>
            )}
          </TestResult>
        )}

        <ConnectionStats>
          <StatItem>
            <StatValue>{connectionStats.successful}</StatValue>
            <StatLabel>Exitosas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{connectionStats.failed}</StatValue>
            <StatLabel>Fallidas</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{connectionStats.avgLatency}ms</StatValue>
            <StatLabel>Latencia Prom.</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue style={{ fontSize: '10px' }}>
              {connectionStats.lastTest || 'N/A'}
            </StatValue>
            <StatLabel>Última Prueba</StatLabel>
          </StatItem>
        </ConnectionStats>
      </TestSection>
    </ProxyContainer>
  );
};

export default ProxyConfiguration;
