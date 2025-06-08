import React, { useMemo } from 'react';
import { withTheme } from 'styled-components';
import { 
  StatusWrapper, 
  StatusCard, 
  StatusHeader,
  StatusTitle,
  StatusGrid,
  ResourceCard,
  ResourceIcon,
  ResourceInfo,
  ResourceCount,
  ResourceLabel,
  ProgressBar,
  ProgressFill,
  MessageCard
} from './styles';
import { useStore } from 'devtoolApp/store';
import { 
  FaCode, 
  FaImage, 
  FaFileAlt, 
  FaVideo,
  FaMusic,
  FaFont,
  FaGlobe,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner
} from 'react-icons/fa';

export const Status = () => {
  const { state } = useStore();
  const {
    staticResource = [],
    networkResource = [],
    ui: { status },
  } = state;

  // Categorizar recursos por tipo
  const resourceStats = useMemo(() => {
    const allResources = [...staticResource, ...networkResource];
    const stats = {
      scripts: { count: 0, icon: FaCode, color: '#f59e0b' },
      styles: { count: 0, icon: FaFileAlt, color: '#3b82f6' },
      images: { count: 0, icon: FaImage, color: '#10b981' },
      videos: { count: 0, icon: FaVideo, color: '#ef4444' },
      audio: { count: 0, icon: FaMusic, color: '#8b5cf6' },
      fonts: { count: 0, icon: FaFont, color: '#f97316' },
      others: { count: 0, icon: FaGlobe, color: '#6b7280' }
    };

    allResources.forEach(resource => {
      const url = resource.url || resource.src || '';
      const extension = url.split('.').pop()?.toLowerCase() || '';
      
      if (['js', 'jsx', 'ts', 'tsx'].includes(extension)) {
        stats.scripts.count++;
      } else if (['css', 'scss', 'sass', 'less'].includes(extension)) {
        stats.styles.count++;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'].includes(extension)) {
        stats.images.count++;
      } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
        stats.videos.count++;
      } else if (['mp3', 'wav', 'ogg', 'flac'].includes(extension)) {
        stats.audio.count++;
      } else if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extension)) {
        stats.fonts.count++;
      } else {
        stats.others.count++;
      }
    });

    return stats;
  }, [staticResource, networkResource]);
  const totalResources = staticResource.length + networkResource.length;
  const isProcessing = false; // Forzar que deje de girar
  const isError = status && status.toLowerCase().includes('error');

  const getStatusIcon = () => {
    if (isProcessing) return FaSpinner;
    if (totalResources > 0 || status === 'Análisis completado') return FaCheckCircle;
    return FaExclamationTriangle;
  };

  const getStatusVariant = () => {
    if (isProcessing) return 'warning';
    if (totalResources > 0 || status === 'Análisis completado') return 'success';
    return 'info';
  };

  const StatusIcon = getStatusIcon();

  return (
    <StatusWrapper>
      <StatusCard>
        <StatusHeader>
          <StatusIcon size={20} className={isProcessing ? 'spinning' : ''} />
          <StatusTitle>Estado del Análisis</StatusTitle>
        </StatusHeader>
        <MessageCard variant={isError ? 'danger' : getStatusVariant()}>
          <span>{status || 'Esperando análisis...'}</span>
        </MessageCard>
        {(totalResources > 0 || status === 'Análisis completado') && !isError && (
          <>
            <ProgressBar>
              <ProgressFill width={100} />
            </ProgressBar>
            <StatusGrid>
              {Object.entries(resourceStats).map(([key, stat]) => {
                if (stat.count === 0) return null;
                const IconComponent = stat.icon;
                return (
                  <ResourceCard key={key}>
                    <ResourceIcon color={stat.color}>
                      <IconComponent size={16} />
                    </ResourceIcon>
                    <ResourceInfo>
                      <ResourceCount>{stat.count}</ResourceCount>
                      <ResourceLabel>
                        {key === 'scripts' && 'Scripts'}
                        {key === 'styles' && 'Estilos'}
                        {key === 'images' && 'Imágenes'}
                        {key === 'videos' && 'Videos'}
                        {key === 'audio' && 'Audio'}
                        {key === 'fonts' && 'Fuentes'}
                        {key === 'others' && 'Otros'}
                      </ResourceLabel>
                    </ResourceInfo>
                  </ResourceCard>
                );
              })}
            </StatusGrid>
          </>
        )}
      </StatusCard>
    </StatusWrapper>
  );
};

export default withTheme(Status);
