import styled, { css, keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const StatusWrapper = styled.div`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

export const StatusCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-xl);
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: var(--transition-default);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const StatusHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .spinning {
    animation: ${spin} 1s linear infinite;
  }
  
  svg {
    color: ${props => props.theme.colors.primary};
  }
`;

export const StatusTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

export const MessageCard = styled.div`
  padding: 12px 16px;
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
  
  ${props => {
    switch(props.$variant) {
      case 'success':
        return css`
          background: ${props.theme.colors.successBackground};
          color: ${props.theme.colors.success};
          border: 1px solid ${props.theme.colors.successBorder};
        `;
      case 'warning':
        return css`
          background: ${props.theme.colors.warningBackground};
          color: ${props.theme.colors.warning};
          border: 1px solid ${props.theme.colors.warningBorder};
        `;
      case 'error':
        return css`
          background: ${props.theme.colors.errorBackground};
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.errorBorder};
        `;
      default:
        return css`
          background: ${props.theme.colors.infoBackground};
          color: ${props.theme.colors.info};
          border: 1px solid ${props.theme.colors.infoBorder};
        `;
    }
  }}
  
  span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 20px;
`;

export const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.primary} 0%,
    ${props => props.theme.colors.secondary} 100%
  );
  border-radius: 2px;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
`;

export const ResourceCard = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: ${props => props.theme.colors.backgroundSecondary};
  border: 1px solid ${props => props.theme.colors.borderLight};
  border-radius: var(--border-radius-md);
  transition: var(--transition-default);
  
  &:hover {
    background: ${props => props.theme.colors.backgroundHover};
    border-color: ${props => props.theme.colors.border};
    transform: translateY(-1px);
  }
`;

export const ResourceIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color}20;
  color: ${props => props.color};
  border-radius: var(--border-radius-md);
  flex-shrink: 0;
`;

export const ResourceInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ResourceCount = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  line-height: 1.2;
`;

export const ResourceLabel = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 400;
  margin-top: 2px;
`;
