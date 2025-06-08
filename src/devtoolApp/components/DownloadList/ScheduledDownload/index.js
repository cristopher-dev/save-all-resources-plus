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
import { calculateScheduleTimeHelper, processQueueHelper } from './scheduleHelpers';

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

  const toggleExpanded = (event) => {
    event.stopPropagation();
    setExpanded(!expanded);
  };

  // Procesar cola de descargas
  const processQueue = useCallback(() => {
    processQueueHelper(downloadQueue, batchSize, setDownloadQueue, setProcessingStats, setIsProcessing);
  }, [downloadQueue, batchSize]);

  // Agregar descarga a la cola
  const addToQueue = (event) => {
    event.stopPropagation();
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
  const calculateScheduleTime = () => calculateScheduleTimeHelper(scheduleType, delayMinutes, scheduleTime, recurringInterval);

  // Remover elemento de la cola
  const removeFromQueue = (id) => (event) => {
    event.stopPropagation();
    setDownloadQueue(prev => prev.filter(item => item.id !== id));
  };

  // Pausar/reanudar procesamiento
  const toggleProcessing = (event) => {
    event.stopPropagation();
    setIsProcessing(!isProcessing);
  };

  // Limpiar cola
  const clearQueue = (event) => {
    event.stopPropagation();
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
                      onClick={removeFromQueue(item.id)}
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
