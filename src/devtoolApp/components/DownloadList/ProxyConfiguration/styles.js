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

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const ProxyContainer = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const ProxyHeader = styled.div`
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

export const ProxyCard = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
  transition: box-shadow 0.2s ease;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ProxyTypeSelector = styled.div`
  margin-bottom: 16px;
`;

export const ProxyOption = styled.button`
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

export const ProxyForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
`;

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const FormLabel = styled.label`
  color: ${props => props.theme.textSecondary};
  font-size: 12px;
  font-weight: 500;
`;

export const FormInput = styled.input`
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
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    opacity: 0.7;
  }
`;

export const FormSelect = styled.select`
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

export const AuthSection = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 16px;
`;

export const AuthToggle = styled.div`
  margin-bottom: 12px;
`;

export const TestSection = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 16px;
`;

export const TestButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primaryHover || props.theme.primary};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const TestResult = styled.div`
  background: ${props => props.success ? `${props.theme.success}20` : `${props.theme.error}20`};
  border: 1px solid ${props => props.success ? props.theme.success : props.theme.error};
  border-radius: 4px;
  padding: 12px;
  margin-top: 8px;
  font-size: 12px;
  animation: ${fadeIn} 0.3s ease-out;
`;

export const PresetSection = styled.div``;

export const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
`;

export const PresetCard = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

export const PresetTitle = styled.h5`
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 500;
`;

export const PresetDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 11px;
  line-height: 1.4;
`;

export const ProxyRules = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 12px;
`;

export const RuleItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const RuleInput = styled.input`
  flex: 1;
  background: ${props => props.theme.inputBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  color: ${props => props.theme.text};
  font-size: 11px;
  padding: 6px 8px;
`;

export const RuleButton = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.primaryHover || props.theme.primary};
  }
`;

export const AdvancedSettings = styled.div`
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

export const StatusIndicator = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => {
    switch (props.type) {
      case 'success': return props.theme.success;
      case 'error': return props.theme.error;
      case 'warning': return props.theme.warning;
      default: return props.theme.textSecondary;
    }
  }};
  animation: ${props => props.type === 'success' ? pulse : 'none'} 2s infinite;
`;

export const ConnectionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: ${props => props.theme.cardBackground || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
`;

export const StatItem = styled.div`
  text-align: center;
`;

export const StatValue = styled.div`
  color: ${props => props.theme.primary};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 10px;
  font-weight: 500;
`;
