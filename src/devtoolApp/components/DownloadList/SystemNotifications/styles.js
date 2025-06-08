import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const NotificationContainer = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const NotificationHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const NotificationTitle = styled.h3`
  color: ${props => props.theme.colors.white || '#ffffff'};
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const NotificationContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const NotificationSection = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
`;

export const NotificationSectionTitle = styled.h4`
  color: ${props => props.theme.colors.white || '#ffffff'};
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 500;
`;

export const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const SettingLabel = styled.label`
  color: ${props => props.theme.colors.white || '#ffffff'};
  font-size: 12px;
  font-weight: 500;
  flex: 1;
`;

export const SettingToggle = styled.input`
  margin: 0;
`;

export const SettingSelect = styled.select`
  background: ${props => props.theme.inputBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.colors.white || '#ffffff'};
  font-size: 11px;
  padding: 4px 8px;
`;

export const SettingInput = styled.input`
  background: ${props => props.theme.inputBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.colors.white || '#ffffff'};
  font-size: 11px;
  padding: 4px 8px;
  width: 100px;
`;

export const NotificationTypes = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const TypeCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'enabled' && prop !== 'disabled'
})`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.enabled ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

export const TypeIcon = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'enabled'
})`
  font-size: 18px;
  color: ${props => props.enabled ? props.theme.primary : props.theme.textSecondary};
  margin-bottom: 8px;
`;

export const TypeName = styled.h5`
  color: ${props => props.theme.colors.white || '#ffffff'};
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
`;

export const TypeDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
`;

export const NotificationPreview = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  overflow: hidden;
  margin-top: 12px;
`;

export const PreviewContainer = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  padding: 12px;
`;

export const PreviewNotification = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: ${slideIn} 0.3s ease-out;
`;

export const PreviewContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PreviewActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const TestButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['size', 'color'].includes(prop)
})`
  background: ${props => {
    switch (props.color) {
      case 'danger':
        return props.theme.colors?.error || '#ef4444';
      case 'warning':
        return props.theme.colors?.warning || '#f59e0b';
      case 'success':
        return props.theme.colors?.success || '#10b981';
      default:
        return props.theme.colors?.primary || '#3b82f6';
    }
  }};
  color: ${props => props.theme.colors?.white || '#ffffff'};
  border: none;
  border-radius: 4px;
  padding: ${props => props.size === 'small' ? '4px 8px' : '6px 12px'};
  font-size: ${props => props.size === 'small' ? '10px' : '11px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const NotificationHistory = styled.div`
  max-height: 200px;
  overflow-y: auto;
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
`;

export const HistoryItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'read'
})`
  padding: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${props => props.read ? 'transparent' : `${props.theme.primary}10`};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const HistoryIcon = styled.div`
  font-size: 16px;
  color: ${props => props.theme.primary};
`;

export const HistoryInfo = styled.div`
  flex: 1;
`;

export const HistoryTime = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 10px;
`;

export const VolumeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const VolumeSlider = styled.input`
  flex: 1;
`;

export const PermissionStatus = styled.div`
  background: ${props => props.granted ? `${props.theme.success}20` : `${props.theme.warning}20`};
  border: 1px solid ${props => props.granted ? props.theme.success : props.theme.warning};
  border-radius: 4px;
  padding: 8px 12px;
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PermissionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.white};
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  cursor: pointer;
`;

export const StatusBadge = styled.span`
  background: ${props => props.active ? props.theme.success : props.theme.border};
  color: ${props => props.active ? '#fff' : (props.theme.colors.white || '#ffffff')};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

export const HistoryActions = styled.div`
  display: flex;
  gap: 8px;
`;
