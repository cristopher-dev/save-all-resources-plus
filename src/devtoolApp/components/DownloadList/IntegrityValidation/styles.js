import styled, { keyframes } from 'styled-components';

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const progressAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

export const IntegrityContainer = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const IntegrityHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const HeaderTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const StatusBadge = styled.span`
  background: ${props => props.active ? props.theme.success : props.theme.border};
  color: ${props => props.active ? '#fff' : props.theme.text};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
`;

export const ConfigSection = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
`;

export const HashSection = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const HashTypeSelector = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const HashOption = styled.button`
  background: ${props => props.selected ? props.theme.primary : 'transparent'};
  color: ${props => props.selected ? '#fff' : props.theme.text};
  border: 1px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => !props.selected ? `${props.theme.primary}20` : props.theme.primary};
  }
`;

export const HashInput = styled.input`
  background: ${props => props.theme.inputBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.text};
  font-size: 11px;
  padding: 8px;
  font-family: monospace;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

export const HashResult = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

export const ValidationSection = styled.div``;

export const ValidationCard = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ValidationHeader = styled.div`
  margin-bottom: 16px;
`;

export const ValidationContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FileUploadArea = styled.div`
  border: 2px dashed ${props => props.dragOver ? props.theme.primary : props.theme.border};
  border-radius: 6px;
  padding: 24px;
  text-align: center;
  background: ${props => props.dragOver ? `${props.theme.primary}10` : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    background: ${props => props.theme.primary}10;
  }
`;

export const ValidationResult = styled.div`
  margin-top: 12px;
`;

export const ResultItem = styled.div`
  background: ${props => props.valid ? `${props.theme.success}20` : `${props.theme.error}20`};
  border: 1px solid ${props => props.valid ? props.theme.success : props.theme.error};
  border-radius: 4px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ResultIcon = styled.div`
  font-size: 20px;
  animation: ${pulse} 2s infinite;
`;

export const ResultText = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: ${props => props.theme.text};
`;

export const AutoVerifySection = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
`;

export const SettingField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SettingLabel = styled.label`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: 500;
`;

export const SettingInput = styled.input`
  background: ${props => props.theme.inputBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.text};
  font-size: 12px;
  padding: 8px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.progress}%;
  background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.primary});
  background-size: 200% 100%;
  animation: ${progressAnimation} 2s linear infinite;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.div`
  text-align: center;
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
`;

export const HistorySection = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 16px;
`;

export const HistoryList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
`;

export const HistoryItem = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;
  background: ${props => 
    props.status === 'invalid' ? `${props.theme.error}10` :
    props.status === 'valid' ? `${props.theme.success}05` : 'transparent'
  };
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: ${props => props.theme.primary}20;
  }
`;

export const HistoryMeta = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ActionButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryHover || props.theme.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 11px;
  font-weight: 500;
`;

export const AlertContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: ${props => props.theme.warning}20;
  border: 1px solid ${props => props.theme.warning};
  border-radius: 4px;
`;

export const AlertIcon = styled.span`
  font-size: 12px;
`;

export const AlertMessage = styled.span`
  font-size: 10px;
  color: ${props => props.theme.warning};
  font-weight: 500;
`;
