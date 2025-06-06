import styled from 'styled-components';

export const ScheduledDownloadContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
`;

export const ScheduledDownloadHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surfaceHover};
  cursor: pointer;
  border-bottom: ${({ expanded, theme }) => expanded ? `1px solid ${theme.colors.border}` : 'none'};
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
  }
`;

export const ScheduledDownloadTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ScheduledDownloadContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  padding: ${({ expanded }) => expanded ? '16px' : '0'};
  max-height: ${({ expanded }) => expanded ? '400px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

export const ScheduleSection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const ScheduleSectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

export const ScheduleInput = styled.input`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ScheduleSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

export const ScheduleLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  min-width: 80px;
`;

export const BatchSettings = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const BatchCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 6px;
  padding: 12px;
`;

export const BatchCardTitle = styled.h5`
  margin: 0 0 8px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const BatchMetrics = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
  padding: 12px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 6px;
`;

export const MetricItem = styled.div`
  text-align: center;
`;

export const MetricValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 4px;
`;

export const MetricLabel = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ScheduleActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

export const QueueList = styled.div`
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin-top: 12px;
`;

export const QueueItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.colors.successBackground;
      case 'error': return theme.colors.errorBackground;
      case 'processing': return theme.colors.warningBackground;
      default: return theme.colors.background;
    }
  }};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const QueueItemInfo = styled.div`
  flex: 1;
  margin-right: 12px;
`;

export const QueueItemName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
`;

export const QueueItemTime = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const QueueItemStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ status, theme }) => {
    switch (status) {
      case 'completed': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'processing': return theme.colors.warning;
      default: return theme.colors.textSecondary;
    }
  }};
`;

export const QueueActions = styled.div`
  display: flex;
  gap: 4px;
`;

export const QueueActionButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-radius: 2px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    color: ${({ theme }) => theme.colors.text};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
