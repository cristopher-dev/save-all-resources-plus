import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const CompressionContainer = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  background-color: ${props => props.theme.backgroundSecondary};
`;

export const CompressionHeader = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: ${props => props.theme.colors.white};
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: linear-gradient(135deg, ${props => props.theme.colors.primaryHover} 0%, ${props => props.theme.colors.secondaryHover} 100%);
  }
`;

export const CompressionTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

export const CompressionContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: ${props => props.expanded ? 'block' : 'none'};
  padding: 16px;
`;

export const CompressionSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CompressionSectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CompressionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 12px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StatIcon = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 18px;
`;

export const StatValue = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

export const StatLabel = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FormatOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
`;

export const FormatOption = styled.div`
  border: 2px solid ${props => props.selected ? props.theme.colors.primary : props.theme.border};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? props.theme.colors.primaryLight : props.theme.background};
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

export const FormatIcon = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 8px;
`;

export const FormatName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.text};
  text-align: center;
  margin-bottom: 4px;
`;

export const FormatDescription = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  line-height: 1.4;
`;

export const CompressionSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SettingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const SettingLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.theme.text};
  min-width: 120px;
`;

export const SettingSelect = styled.select`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const SettingInput = styled.input`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const SettingCheckbox = styled.input`
  margin: 0;
  transform: scale(1.2);
`;

export const AdvancedOptions = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 16px;
  background: ${props => props.theme.background};
`;

export const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionTitle = styled.h5`
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.text};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const CompressionActions = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: ${props => props.size === 'small' ? '6px 10px' : '10px 16px'};
  border: none;
  border-radius: 6px;
  font-size: ${props => props.size === 'small' ? '11px' : '12px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
    ${props => {
    switch (props.color) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${props.theme.colors.primary} 0%, ${props.theme.colors.secondary} 100%);
          color: ${props.theme.colors.white};
          &:hover { background: linear-gradient(135deg, ${props.theme.colors.primaryHover} 0%, ${props.theme.colors.secondaryHover} 100%); }
        `;
      case 'secondary':
        return `
          background-color: ${props.theme.colors.border};
          color: ${props.theme.colors.text};
          &:hover { background-color: ${props.theme.colors.surfaceHover}; }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: ${props.theme.colors.white};
          &:hover { background-color: ${props.theme.colors.errorHover}; }
        `;
      default:
        return `
          background-color: ${props.theme.colors.border};
          color: ${props.theme.colors.text};
          &:hover { background-color: ${props.theme.colors.surfaceHover}; }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const CompressionProgress = styled.div`
  margin-top: 16px;
`;

export const ProgressText = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text};
  margin-bottom: 8px;
  font-weight: 500;
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const CompressionResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

export const ResultInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ResultSize = styled.div`
  font-size: 12px;
  color: ${props => props.theme.textSecondary};
  margin-top: 4px;
`;

export const ResultActions = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 12px;
`;

export const CompressionPreview = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  overflow: hidden;
`;

export const PreviewTable = styled.div`
  display: table;
  width: 100%;
`;

export const PreviewRow = styled.div`
  display: table-row;
  ${props => props.header && `
    background: ${props.theme.backgroundSecondary};
    font-weight: 600;
  `}
`;

export const PreviewCell = styled.div`
  display: table-cell;
  padding: 8px 12px;
  border-bottom: 1px solid ${props => props.theme.border};
  font-size: 12px;
  color: ${props => props.theme.text};
  
  &:first-child {
    font-weight: 500;
    width: 40%;
  }
`;
