import styled from 'styled-components';
import { THEME_KEYS } from '../../themes';

export const HeaderWrapper = styled.header`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-md);
  padding: 24px;
  margin-bottom: 24px;
  transition: var(--transition-default);
  
  &:hover {
    box-shadow: var(--shadow-lg);
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 16px;
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
`;

export const BrandSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex: 1;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

export const BrandTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  background: linear-gradient(
    135deg, 
    ${props => props.theme.colors.primary} 0%, 
    ${props => props.theme.colors.secondary} 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const BrandSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-weight: 400;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

export const StatusBadge = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'variant'
})`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: var(--border-radius-md);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  
  ${props => {
    switch(props.variant) {
      case 'success':
        return `
          background: ${props.theme.colors.successBackground};
          color: ${props.theme.colors.success};
          border: 1px solid ${props.theme.colors.successBorder};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warningBackground};
          color: ${props.theme.colors.warning};
          border: 1px solid ${props.theme.colors.warningBorder};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.errorBackground};
          color: ${props.theme.colors.error};
          border: 1px solid ${props.theme.colors.errorBorder};
        `;
      default:
        return `
          background: ${props.theme.colors.backgroundAlt};
          color: ${props.theme.colors.textSecondary};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;



export const ActionSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;
