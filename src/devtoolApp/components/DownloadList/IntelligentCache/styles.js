import styled from 'styled-components';

export const CacheContainer = styled.div`
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 16px;
  overflow: hidden;
  background-color: ${props => props.theme.backgroundSecondary};
`;

export const CacheHeader = styled.div.withConfig({
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

export const CacheTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

export const CacheContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'expanded'
})`
  display: ${props => props.expanded ? 'block' : 'none'};
  padding: 16px;
`;

export const CacheSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const CacheSectionTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CacheStats = styled.div`
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

export const CacheActions = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: ${props => props.size === 'small' ? '4px 8px' : '8px 12px'};
  border: none;
  border-radius: 6px;
  font-size: ${props => props.size === 'small' ? '11px' : '12px'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
    ${props => {
    switch (props.color) {
      case 'primary':
        return `
          background-color: ${props.theme.colors.primary};
          color: ${props.theme.colors.white};
          &:hover { background-color: ${props.theme.colors.primaryHover}; }
        `;
      case 'warning':
        return `
          background-color: ${props.theme.colors.warning};
          color: ${props.theme.colors.black};
          &:hover { background-color: ${props.theme.colors.warningHover}; }
        `;
      case 'danger':
        return `
          background-color: ${props.theme.colors.error};
          color: ${props.theme.colors.white};
          &:hover { background-color: ${props.theme.colors.errorHover}; }
        `;
      case 'success':
        return `
          background-color: ${props.theme.colors.success};
          color: ${props.theme.colors.white};
          &:hover { background-color: ${props.theme.colors.successHover}; }
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

export const CacheList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
`;

export const CacheItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.expired ? props.theme.colors.error : props.theme.border};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  ${props => props.expired && `
    background-color: #fff5f5;
    opacity: 0.7;
  `}
    &:hover {
    border-color: ${props => props.expired ? props.theme.colors.error : props.theme.colors.primary};
    transform: translateY(-1px);
  }
`;

export const CacheItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CacheItemName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.theme.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
`;

export const CacheItemMeta = styled.div`
  font-size: 11px;
  color: ${props => props.theme.textSecondary};
`;

export const CacheItemActions = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 12px;
`;

export const CacheSettings = styled.div`
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

export const SettingInput = styled.input`
  padding: 6px 8px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 12px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
    &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const CachePolicy = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PolicyButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`  padding: 6px 12px;
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.border};
  border-radius: 4px;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.background};
  color: ${props => props.active ? props.theme.colors.white : props.theme.text};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
    &:hover {
    border-color: ${props => props.theme.colors.primary};
    ${props => !props.active && `background: ${props.theme.surfaceHover};`}
  }
  
  small {
    font-size: 9px;
    opacity: 0.8;
  }
`;

export const CacheMetrics = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MetricBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.border};
  border-radius: 4px;
  overflow: hidden;
`;

export const MetricLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.text};
  margin-bottom: 4px;
  font-weight: 500;
`;

export const CompressionStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

export const CompressionCard = styled.div`
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 12px;
  text-align: center;
`;
