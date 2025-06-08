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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  user-select: none;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
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
  color: #667eea;
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
          background-color: #667eea;
          color: white;
          &:hover { background-color: #5a6fd8; }
        `;
      case 'warning':
        return `
          background-color: #feca57;
          color: #333;
          &:hover { background-color: #feb941; }
        `;
      case 'danger':
        return `
          background-color: #ff6b6b;
          color: white;
          &:hover { background-color: #ff5252; }
        `;
      case 'success':
        return `
          background-color: #4ecdc4;
          color: white;
          &:hover { background-color: #45b7b8; }
        `;
      default:
        return `
          background-color: ${props.theme.border};
          color: ${props.theme.text};
          &:hover { background-color: ${props.theme.surfaceHover}; }
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
  border: 1px solid ${props => props.expired ? '#ff6b6b' : props.theme.border};
  border-radius: 6px;
  transition: all 0.2s ease;
  
  ${props => props.expired && `
    background-color: #fff5f5;
    opacity: 0.7;
  `}
  
  &:hover {
    border-color: ${props => props.expired ? '#ff5252' : '#667eea'};
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
    border-color: #667eea;
  }
`;

export const CachePolicy = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const PolicyButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#667eea' : props.theme.border};
  border-radius: 4px;
  background: ${props => props.active ? '#667eea' : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  
  &:hover {
    border-color: #667eea;
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
