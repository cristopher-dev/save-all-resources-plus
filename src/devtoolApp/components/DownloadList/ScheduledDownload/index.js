import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from 'devtoolApp/store';
import * as optionActions from 'devtoolApp/store/option';
import {
  ScheduledDownloadContainer,
  ScheduledDownloadHeader,
  ScheduledDownloadTitle,
  ScheduledDownloadContent,
  ScheduleSection,
  ScheduleSectionTitle,
  ScheduleRow,
  ScheduleInput,
  ScheduleSelect,
  ScheduleLabel,
  BatchSettings,
  BatchCard,
  BatchCardTitle,
  BatchMetrics,
  MetricItem,
  MetricValue,
  MetricLabel,
  ScheduleActions,
  QueueList,
  QueueItem,
  QueueItemInfo,
  QueueItemName,
  QueueItemTime,
  QueueItemStatus,
  QueueActions,
  QueueActionButton,
} from './styles';
import { FaChevronDown, FaClock, FaPlay, FaPause, FaStop, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import Button from '../../Button';

const SCHEDULE_TYPES = [
  { value: 'immediate', label: 'Inmediato' },
  { value: 'delay', label: 'Con Retraso' },
  { value: 'time', label: 'Hora Específica' },
  { value: 'recurring', label: 'Recurrente' },
];

const RECURRING_INTERVALS = [
  { value: 'hourly', label: 'Cada Hora' },
  { value: 'daily', label: 'Diario' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensual' },
];

const ScheduledDownload = () => {
  const { state, dispatch } = useStore();
  const { downloadList } = state;
  
  const [expanded, setExpanded] = useState(false);
  const [scheduleType, setScheduleType] = useState('immediate');
  const [delayMinutes, setDelayMinutes] = useState(5);
  const [scheduleTime, setScheduleTime] = useState('');
  const [recurringInterval, setRecurringInterval] = useState('daily');
  const [batchSize, setBatchSize] = useState(5);
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStats, setProcessingStats] = useState({
    completed: 0,
    failed: 0,
    remaining: 0,
  });

  const toggleExpanded = () => setExpanded(!expanded);

  // Procesar cola de descargas
  const processQueue = useCallback(async () => {
    if (!downloadQueue.length || isProcessing) return;
    
    setIsProcessing(true);
    const batch = downloadQueue.slice(0, batchSize);
    
    // Simular procesamiento de descarga
    for (const item of batch) {
      try {
        setDownloadQueue(prev => 
          prev.map(q => q.id === item.id ? { ...q, status: 'processing' } : q)
        );
        
        // Simular tiempo de descarga
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDownloadQueue(prev => 
          prev.map(q => q.id === item.id ? { ...q, status: 'completed', completedAt: new Date() } : q)
        );
        
        setProcessingStats(prev => ({
          ...prev,
          completed: prev.completed + 1,
          remaining: prev.remaining - 1,
        }));
        
      } catch (error) {
        setDownloadQueue(prev => 
          prev.map(q => q.id === item.id ? { ...q, status: 'error', error: error.message } : q)
        );
        
        setProcessingStats(prev => ({
          ...prev,
          failed: prev.failed + 1,
          remaining: prev.remaining - 1,
        }));
      }
    }
    
    // Remover elementos completados o con error después de un tiempo
    setTimeout(() => {
      setDownloadQueue(prev => prev.filter(item => 
        !['completed', 'error'].includes(item.status) || 
        Date.now() - item.completedAt?.getTime() < 5000
      ));
    }, 5000);
    
    setIsProcessing(false);
  }, [downloadQueue, batchSize, isProcessing]);

  // Agregar descarga a la cola
  const addToQueue = () => {
    const newItems = downloadList.slice(1).map((item, index) => ({
      id: `download_${Date.now()}_${index}`,
      url: item.url,
      status: 'queued',
      scheduledFor: calculateScheduleTime(),
      addedAt: new Date(),
    }));
    
    setDownloadQueue(prev => [...prev, ...newItems]);
    setProcessingStats(prev => ({
      ...prev,
      remaining: prev.remaining + newItems.length,
    }));
  };

  // Calcular hora de programación
  const calculateScheduleTime = () => {
    const now = new Date();
    
    switch (scheduleType) {
      case 'immediate':
        return now;
      case 'delay':
        return new Date(now.getTime() + delayMinutes * 60000);
      case 'time':
        const [hours, minutes] = scheduleTime.split(':');
        const scheduled = new Date();
        scheduled.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        if (scheduled <= now) {
          scheduled.setDate(scheduled.getDate() + 1);
        }
        return scheduled;
      case 'recurring':
        // Para recurrente, programar la primera ejecución según el intervalo
        switch (recurringInterval) {
          case 'hourly':
            return new Date(now.getTime() + 60 * 60000);
          case 'daily':
            return new Date(now.getTime() + 24 * 60 * 60000);
          case 'weekly':
            return new Date(now.getTime() + 7 * 24 * 60 * 60000);
          case 'monthly':
            return new Date(now.getTime() + 30 * 24 * 60 * 60000);
          default:
            return now;
        }
      default:
        return now;
    }
  };

  // Remover elemento de la cola
  const removeFromQueue = (id) => {
    setDownloadQueue(prev => prev.filter(item => item.id !== id));
  };

  // Pausar/reanudar procesamiento
  const toggleProcessing = () => {
    setIsProcessing(!isProcessing);
  };

  // Limpiar cola
  const clearQueue = () => {
    setDownloadQueue([]);
    setProcessingStats({ completed: 0, failed: 0, remaining: 0 });
  };

  // Efecto para procesar cola automáticamente
  useEffect(() => {
    if (downloadQueue.length > 0 && !isProcessing) {
      const queuedItems = downloadQueue.filter(item => item.status === 'queued');
      const readyItems = queuedItems.filter(item => item.scheduledFor <= new Date());
      
      if (readyItems.length > 0) {
        processQueue();
      }
    }
  }, [downloadQueue, processQueue, isProcessing]);

  const totalDownloads = downloadList.length - 1; // Excluir el primer elemento que es la página actual

  return (
    <ScheduledDownloadContainer>
      <ScheduledDownloadHeader expanded={expanded} onClick={toggleExpanded}>
        <ScheduledDownloadTitle>
          <FaCalendarAlt />
          Descarga Programada
          {downloadQueue.length > 0 && ` (${downloadQueue.length} en cola)`}
        </ScheduledDownloadTitle>
        <FaChevronDown style={{ 
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s ease'
        }} />
      </ScheduledDownloadHeader>

      <ScheduledDownloadContent expanded={expanded}>
        <ScheduleSection>
          <ScheduleSectionTitle>⚙️ Configuración de Programación</ScheduleSectionTitle>
          
          <ScheduleRow>
            <ScheduleLabel>Tipo:</ScheduleLabel>
            <ScheduleSelect 
              value={scheduleType} 
              onChange={(e) => setScheduleType(e.target.value)}
            >
              {SCHEDULE_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </ScheduleSelect>
          </ScheduleRow>

          {scheduleType === 'delay' && (
            <ScheduleRow>
              <ScheduleLabel>Retraso:</ScheduleLabel>
              <ScheduleInput
                type="number"
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(parseInt(e.target.value) || 5)}
                min="1"
                max="1440"
              />
              <span>minutos</span>
            </ScheduleRow>
          )}

          {scheduleType === 'time' && (
            <ScheduleRow>
              <ScheduleLabel>Hora:</ScheduleLabel>
              <ScheduleInput
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </ScheduleRow>
          )}

          {scheduleType === 'recurring' && (
            <ScheduleRow>
              <ScheduleLabel>Intervalo:</ScheduleLabel>
              <ScheduleSelect 
                value={recurringInterval} 
                onChange={(e) => setRecurringInterval(e.target.value)}
              >
                {RECURRING_INTERVALS.map(interval => (
                  <option key={interval.value} value={interval.value}>
                    {interval.label}
                  </option>
                ))}
              </ScheduleSelect>
            </ScheduleRow>
          )}
        </ScheduleSection>

        <ScheduleSection>
          <ScheduleSectionTitle>📦 Configuración de Lotes</ScheduleSectionTitle>
          
          <ScheduleRow>
            <ScheduleLabel>Tamaño del lote:</ScheduleLabel>
            <ScheduleInput
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(parseInt(e.target.value) || 5)}
              min="1"
              max="20"
            />
            <span>recursos por lote</span>
          </ScheduleRow>

          <BatchSettings>
            <BatchCard>
              <BatchCardTitle>📊 Recursos Disponibles</BatchCardTitle>
              <MetricValue>{totalDownloads}</MetricValue>
              <MetricLabel>para descargar</MetricLabel>
            </BatchCard>
            
            <BatchCard>
              <BatchCardTitle>⏱️ Tiempo Estimado</BatchCardTitle>
              <MetricValue>{Math.ceil(totalDownloads / batchSize) * 2}</MetricValue>
              <MetricLabel>minutos aprox.</MetricLabel>
            </BatchCard>
          </BatchSettings>
        </ScheduleSection>

        <BatchMetrics>
          <MetricItem>
            <MetricValue>{processingStats.completed}</MetricValue>
            <MetricLabel>Completados</MetricLabel>
          </MetricItem>
          <MetricItem>
            <MetricValue>{processingStats.failed}</MetricValue>
            <MetricLabel>Fallidos</MetricLabel>
          </MetricItem>
          <MetricItem>
            <MetricValue>{processingStats.remaining}</MetricValue>
            <MetricLabel>Pendientes</MetricLabel>
          </MetricItem>
        </BatchMetrics>

        <ScheduleActions>
          <Button 
            color="primary" 
            onClick={addToQueue}
            disabled={totalDownloads === 0}
          >
            <FaClock style={{ marginRight: '8px' }} />
            Programar Descarga
          </Button>
          
          <Button 
            color={isProcessing ? "warning" : "success"} 
            onClick={toggleProcessing}
            disabled={downloadQueue.length === 0}
          >
            {isProcessing ? <FaPause /> : <FaPlay />}
            {isProcessing ? 'Pausar' : 'Iniciar'} Cola
          </Button>
          
          <Button 
            color="danger" 
            onClick={clearQueue}
            disabled={downloadQueue.length === 0}
          >
            <FaStop style={{ marginRight: '8px' }} />
            Limpiar Cola
          </Button>
        </ScheduleActions>

        {downloadQueue.length > 0 && (
          <ScheduleSection>
            <ScheduleSectionTitle>📋 Cola de Descargas</ScheduleSectionTitle>
            <QueueList>
              {downloadQueue.map((item) => (
                <QueueItem key={item.id} status={item.status}>
                  <QueueItemInfo>
                    <QueueItemName>{item.url.substring(0, 50)}...</QueueItemName>
                    <QueueItemTime>
                      Programado: {item.scheduledFor.toLocaleString()}
                    </QueueItemTime>
                  </QueueItemInfo>
                  
                  <QueueItemStatus status={item.status}>
                    {item.status === 'queued' && <FaClock />}
                    {item.status === 'processing' && <FaPlay />}
                    {item.status === 'completed' && '✓'}
                    {item.status === 'error' && '✗'}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </QueueItemStatus>
                  
                  <QueueActions>
                    <QueueActionButton 
                      onClick={() => removeFromQueue(item.id)}
                      disabled={item.status === 'processing'}
                    >
                      <FaTrash />
                    </QueueActionButton>
                  </QueueActions>
                </QueueItem>
              ))}
            </QueueList>
          </ScheduleSection>
        )}
      </ScheduledDownloadContent>
    </ScheduledDownloadContainer>
  );
};

export default ScheduledDownload;
