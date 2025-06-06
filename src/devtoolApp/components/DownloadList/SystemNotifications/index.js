import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaBell, FaVolumeUp, FaDesktop, FaEnvelope, FaCog, FaCheck, FaTimes, FaExclamationTriangle, FaInfo } from 'react-icons/fa';
import { useStore } from '../../../store';
import {
  NotificationContainer,
  NotificationHeader,
  NotificationTitle,
  NotificationContent,
  NotificationSection,
  NotificationSectionTitle,
  NotificationSettings,
  SettingRow,
  SettingLabel,
  SettingToggle,
  SettingSelect,
  SettingInput,
  NotificationTypes,
  TypeCard,
  TypeIcon,
  TypeName,
  TypeDescription,
  NotificationPreview,
  PreviewContainer,
  PreviewNotification,
  PreviewContent,
  PreviewActions,
  TestButton,
  NotificationHistory,
  HistoryItem,
  HistoryIcon,
  HistoryInfo,
  HistoryTime,
  VolumeControl,
  VolumeSlider,
  PermissionStatus,
  PermissionButton
} from './styles';

const NOTIFICATION_TYPES = {
  'desktop': {
    name: 'Notificaciones de Sistema',
    icon: FaDesktop,
    description: 'Notificaciones nativas del sistema operativo',
    requiresPermission: true,
    settings: ['sound', 'duration', 'position']
  },
  'browser': {
    name: 'Notificaciones del Navegador',
    icon: FaBell,
    description: 'Notificaciones dentro del navegador',
    requiresPermission: false,
    settings: ['sound', 'duration', 'style']
  },
  'sound': {
    name: 'Alertas de Sonido',
    icon: FaVolumeUp,
    description: 'Reproducir sonidos para eventos importantes',
    requiresPermission: false,
    settings: ['volume', 'soundType']
  },
  'email': {
    name: 'Notificaciones por Email',
    icon: FaEnvelope,
    description: 'Enviar resúmenes por correo electrónico',
    requiresPermission: false,
    settings: ['email', 'frequency']
  }
};

const NOTIFICATION_EVENTS = {
  'downloadComplete': { name: 'Descarga Completada', icon: FaCheck, color: '#4ecdc4' },
  'downloadFailed': { name: 'Descarga Fallida', icon: FaTimes, color: '#ff6b6b' },
  'downloadStarted': { name: 'Descarga Iniciada', icon: FaInfo, color: '#667eea' },
  'queueComplete': { name: 'Cola Completada', icon: FaCheck, color: '#4ecdc4' },
  'cacheCleared': { name: 'Caché Limpiado', icon: FaInfo, color: '#feca57' },
  'compressionComplete': { name: 'Compresión Completada', icon: FaCheck, color: '#4ecdc4' },
  'error': { name: 'Error del Sistema', icon: FaExclamationTriangle, color: '#ff6b6b' }
};

const SystemNotifications = () => {
  const { state } = useStore();
  const { downloadList } = state;
  
  const [expanded, setExpanded] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [settings, setSettings] = useState({
    desktop: {
      enabled: true,
      events: ['downloadComplete', 'downloadFailed', 'queueComplete'],
      duration: 5000,
      position: 'top-right'
    },
    browser: {
      enabled: true,
      events: ['downloadComplete', 'downloadFailed', 'compressionComplete'],
      duration: 3000,
      style: 'modern'
    },
    sound: {
      enabled: true,
      events: ['downloadComplete', 'downloadFailed'],
      volume: 0.7,
      soundType: 'chime'
    },
    email: {
      enabled: false,
      events: ['queueComplete'],
      email: '',
      frequency: 'immediate'
    }
  });
  const [notificationHistory, setNotificationHistory] = useState([]);
  const [testingNotification, setTestingNotification] = useState(null);

  const toggleExpanded = () => setExpanded(!expanded);

  // Verificar permisos de notificación al cargar
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Simular historial de notificaciones
  useEffect(() => {
    const simulatedHistory = [
      {
        id: 1,
        type: 'downloadComplete',
        title: 'Descarga completada',
        message: 'Se descargaron 45 recursos exitosamente',
        timestamp: new Date(Date.now() - 300000), // 5 minutos atrás
        read: true
      },
      {
        id: 2,
        type: 'compressionComplete',
        title: 'Compresión completada',
        message: 'Archivo ZIP creado: recursos_2024.zip (12.5 MB)',
        timestamp: new Date(Date.now() - 900000), // 15 minutos atrás
        read: false
      },
      {
        id: 3,
        type: 'downloadFailed',
        title: 'Error en descarga',
        message: '3 recursos no pudieron descargarse',
        timestamp: new Date(Date.now() - 1800000), // 30 minutos atrás
        read: true
      }
    ];
    setNotificationHistory(simulatedHistory);
  }, []);

  // Solicitar permisos de notificación
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  }, []);

  // Enviar notificación de prueba
  const sendTestNotification = useCallback(async (type) => {
    setTestingNotification(type);
    
    try {
      if (type === 'desktop' && settings.desktop.enabled) {
        if (notificationPermission !== 'granted') {
          const granted = await requestNotificationPermission();
          if (!granted) {
            alert('Se necesitan permisos para mostrar notificaciones de sistema');
            return;
          }
        }
        
        new Notification('Web Resource Vault - Prueba', {
          body: 'Esta es una notificación de prueba del sistema',
          icon: '/icon128.png',
          tag: 'test-notification'
        });
      } else if (type === 'browser' && settings.browser.enabled) {
        // Simular notificación del navegador
        const notification = {
          id: Date.now(),
          type: 'downloadComplete',
          title: 'Prueba de notificación',
          message: 'Esta es una notificación de prueba del navegador',
          timestamp: new Date(),
          read: false
        };
        setNotificationHistory(prev => [notification, ...prev.slice(0, 9)]);
      } else if (type === 'sound' && settings.sound.enabled) {
        // Reproducir sonido de prueba
        playNotificationSound(settings.sound.soundType, settings.sound.volume);
      }
      
      setTimeout(() => setTestingNotification(null), 2000);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      setTestingNotification(null);
    }
  }, [settings, notificationPermission, requestNotificationPermission]);

  // Reproducir sonido de notificación
  const playNotificationSound = useCallback((soundType, volume) => {
    // En una implementación real, aquí se reproducirían los sonidos
    console.log(`Reproduciendo sonido: ${soundType} al volumen ${volume}`);
  }, []);

  // Actualizar configuración
  const updateSetting = useCallback((type, key, value) => {
    setSettings(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value
      }
    }));
  }, []);

  // Marcar notificación como leída
  const markAsRead = useCallback((id) => {
    setNotificationHistory(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Eliminar notificación del historial
  const deleteNotification = useCallback((id) => {
    setNotificationHistory(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Estadísticas de notificaciones
  const notificationStats = useMemo(() => {
    const total = notificationHistory.length;
    const unread = notificationHistory.filter(n => !n.read).length;
    const byType = notificationHistory.reduce((acc, notification) => {
      acc[notification.type] = (acc[notification.type] || 0) + 1;
      return acc;
    }, {});
    
    return { total, unread, byType };
  }, [notificationHistory]);

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return 'Ahora';
  };

  return (
    <NotificationContainer>
      <NotificationHeader expanded={expanded} onClick={toggleExpanded}>
        <NotificationTitle>
          <FaBell style={{ marginRight: '8px' }} />
          🔔 Notificaciones del Sistema
          {notificationStats.unread > 0 && ` (${notificationStats.unread} sin leer)`}
        </NotificationTitle>
      </NotificationHeader>

      <NotificationContent expanded={expanded}>
        {notificationPermission !== 'granted' && (
          <PermissionStatus>
            <FaExclamationTriangle style={{ marginRight: '8px', color: '#feca57' }} />
            Las notificaciones de sistema requieren permisos.
            <PermissionButton onClick={requestNotificationPermission}>
              Solicitar Permisos
            </PermissionButton>
          </PermissionStatus>
        )}

        <NotificationSection>
          <NotificationSectionTitle>🔧 Tipos de Notificación</NotificationSectionTitle>
          
          <NotificationTypes>
            {Object.entries(NOTIFICATION_TYPES).map(([key, type]) => {
              const Icon = type.icon;
              const isEnabled = settings[key]?.enabled;
              const canEnable = !type.requiresPermission || notificationPermission === 'granted';
              
              return (
                <TypeCard key={key} enabled={isEnabled} disabled={!canEnable}>
                  <TypeIcon enabled={isEnabled}>
                    <Icon />
                  </TypeIcon>
                  <TypeName>{type.name}</TypeName>
                  <TypeDescription>{type.description}</TypeDescription>
                  
                  <SettingRow>
                    <SettingToggle
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) => updateSetting(key, 'enabled', e.target.checked)}
                      disabled={!canEnable}
                    />
                    <SettingLabel>Habilitar</SettingLabel>
                  </SettingRow>
                  
                  <TestButton
                    onClick={() => sendTestNotification(key)}
                    disabled={!isEnabled || testingNotification === key}
                  >
                    {testingNotification === key ? 'Enviando...' : 'Probar'}
                  </TestButton>
                </TypeCard>
              );
            })}
          </NotificationTypes>
        </NotificationSection>

        <NotificationSection>
          <NotificationSectionTitle>⚙️ Configuración Detallada</NotificationSectionTitle>
          
          <NotificationSettings>
            {Object.entries(settings).map(([type, config]) => (
              config.enabled && (
                <div key={type} style={{ marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: '600' }}>
                    {NOTIFICATION_TYPES[type].name}
                  </h5>
                  
                  <SettingRow>
                    <SettingLabel>Eventos:</SettingLabel>
                    <SettingSelect
                      multiple
                      value={config.events || []}
                      onChange={(e) => {
                        const selectedEvents = Array.from(e.target.selectedOptions, option => option.value);
                        updateSetting(type, 'events', selectedEvents);
                      }}
                      style={{ height: '80px' }}
                    >
                      {Object.entries(NOTIFICATION_EVENTS).map(([event, info]) => (
                        <option key={event} value={event}>
                          {info.name}
                        </option>
                      ))}
                    </SettingSelect>
                  </SettingRow>
                  
                  {type === 'desktop' && (
                    <>
                      <SettingRow>
                        <SettingLabel>Duración (ms):</SettingLabel>
                        <SettingInput
                          type="number"
                          value={config.duration || 5000}
                          onChange={(e) => updateSetting(type, 'duration', parseInt(e.target.value))}
                          min="1000"
                          max="30000"
                        />
                      </SettingRow>
                      <SettingRow>
                        <SettingLabel>Posición:</SettingLabel>
                        <SettingSelect
                          value={config.position || 'top-right'}
                          onChange={(e) => updateSetting(type, 'position', e.target.value)}
                        >
                          <option value="top-left">Superior Izquierda</option>
                          <option value="top-right">Superior Derecha</option>
                          <option value="bottom-left">Inferior Izquierda</option>
                          <option value="bottom-right">Inferior Derecha</option>
                        </SettingSelect>
                      </SettingRow>
                    </>
                  )}
                  
                  {type === 'sound' && (
                    <>
                      <SettingRow>
                        <SettingLabel>Volumen:</SettingLabel>
                        <VolumeControl>
                          <VolumeSlider
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={config.volume || 0.7}
                            onChange={(e) => updateSetting(type, 'volume', parseFloat(e.target.value))}
                          />
                          <span>{Math.round((config.volume || 0.7) * 100)}%</span>
                        </VolumeControl>
                      </SettingRow>
                      <SettingRow>
                        <SettingLabel>Tipo de Sonido:</SettingLabel>
                        <SettingSelect
                          value={config.soundType || 'chime'}
                          onChange={(e) => updateSetting(type, 'soundType', e.target.value)}
                        >
                          <option value="chime">Campanilla</option>
                          <option value="beep">Bip</option>
                          <option value="notification">Notificación</option>
                          <option value="success">Éxito</option>
                          <option value="error">Error</option>
                        </SettingSelect>
                      </SettingRow>
                    </>
                  )}
                  
                  {type === 'email' && (
                    <>
                      <SettingRow>
                        <SettingLabel>Email:</SettingLabel>
                        <SettingInput
                          type="email"
                          value={config.email || ''}
                          onChange={(e) => updateSetting(type, 'email', e.target.value)}
                          placeholder="usuario@ejemplo.com"
                        />
                      </SettingRow>
                      <SettingRow>
                        <SettingLabel>Frecuencia:</SettingLabel>
                        <SettingSelect
                          value={config.frequency || 'immediate'}
                          onChange={(e) => updateSetting(type, 'frequency', e.target.value)}
                        >
                          <option value="immediate">Inmediato</option>
                          <option value="hourly">Cada hora</option>
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                        </SettingSelect>
                      </SettingRow>
                    </>
                  )}
                </div>
              )
            ))}
          </NotificationSettings>
        </NotificationSection>

        <NotificationSection>
          <NotificationSectionTitle>
            📝 Historial de Notificaciones ({notificationStats.total})
          </NotificationSectionTitle>
          
          {notificationHistory.length > 0 ? (
            <NotificationHistory>
              {notificationHistory.slice(0, 10).map((notification) => {
                const eventInfo = NOTIFICATION_EVENTS[notification.type];
                const Icon = eventInfo?.icon || FaInfo;
                
                return (
                  <HistoryItem key={notification.id} read={notification.read}>
                    <HistoryIcon color={eventInfo?.color}>
                      <Icon />
                    </HistoryIcon>
                    <HistoryInfo>
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                        {notification.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {notification.message}
                      </div>
                    </HistoryInfo>
                    <HistoryTime>{formatTime(notification.timestamp)}</HistoryTime>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!notification.read && (
                        <TestButton
                          size="small"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <FaCheck />
                        </TestButton>
                      )}
                      <TestButton
                        size="small"
                        color="danger"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <FaTimes />
                      </TestButton>
                    </div>
                  </HistoryItem>
                );
              })}
            </NotificationHistory>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
              <FaBell size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <div>
                No hay notificaciones en el historial.<br />
                Las notificaciones aparecerán aquí cuando ocurran eventos.
              </div>
            </div>
          )}
        </NotificationSection>

        <NotificationSection>
          <NotificationSectionTitle>🔍 Vista Previa</NotificationSectionTitle>
          
          <NotificationPreview>
            <PreviewContainer>
              <PreviewNotification>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaCheck style={{ color: '#4ecdc4' }} />
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
                      Resources Saver
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      Descarga completada - 25 recursos descargados
                    </div>
                  </div>
                </div>
                <PreviewActions>
                  <small style={{ color: '#666' }}>Hace 2m</small>
                </PreviewActions>
              </PreviewNotification>
            </PreviewContainer>
          </NotificationPreview>
        </NotificationSection>
      </NotificationContent>
    </NotificationContainer>
  );
};

export default SystemNotifications;
