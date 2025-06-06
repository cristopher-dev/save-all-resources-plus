// Componentes UI utilitarios modernos
import styled, { css } from 'styled-components';

// Card componente reutilizable
export const Card = styled.div`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-lg);
  padding: ${props => props.padding || '20px'};
  box-shadow: var(--shadow-sm);
  transition: var(--transition-default);
  
  &:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  ${props => props.variant === 'elevated' && css`
    box-shadow: var(--shadow-lg);
    border: none;
  `}
  
  ${props => props.variant === 'outlined' && css`
    border: 2px solid ${props.theme.colors.border};
    box-shadow: none;
  `}
  
  ${props => props.clickable && css`
    cursor: pointer;
    user-select: none;
    
    &:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }
  `}
`;

// Container con máximo ancho
export const Container = styled.div`
  width: 100%;
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${props => props.padding || '24px'};
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// Grid responsivo
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: ${props => props.gap || '24px'};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

// Flex utilitarios
export const Flex = styled.div`
  display: flex;
  align-items: ${props => props.align || 'center'};
  justify-content: ${props => props.justify || 'flex-start'};
  gap: ${props => props.gap || '12px'};
  flex-direction: ${props => props.direction || 'row'};
  flex-wrap: ${props => props.wrap || 'nowrap'};
  
  ${props => props.responsive && css`
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
    }
  `}
`;

// Texto con variantes
export const Text = styled.span`
  color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.textSecondary;
      case 'muted': return props.theme.colors.textMuted;
      case 'success': return props.theme.colors.success;
      case 'warning': return props.theme.colors.warning;
      case 'error': return props.theme.colors.error;
      default: return props.theme.colors.text;
    }
  }};
  
  font-size: ${props => {
    switch(props.size) {
      case 'xs': return '12px';
      case 'sm': return '14px';
      case 'lg': return '18px';
      case 'xl': return '20px';
      default: return '16px';
    }
  }};
  
  font-weight: ${props => {
    switch(props.weight) {
      case 'light': return '300';
      case 'medium': return '500';
      case 'semibold': return '600';
      case 'bold': return '700';
      default: return '400';
    }
  }};
  
  ${props => props.truncate && css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `}
  
  ${props => props.center && css`
    text-align: center;
  `}
`;

// Badge/Chip componente
export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  
  ${props => {
    switch(props.variant) {
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
      case 'primary':
        return css`
          background: ${props.theme.colors.primaryLight};
          color: ${props.theme.colors.primary};
        `;
      default:
        return css`
          background: ${props.theme.colors.backgroundAlt};
          color: ${props.theme.colors.textSecondary};
          border: 1px solid ${props.theme.colors.border};
        `;
    }
  }}
`;

// Divider
export const Divider = styled.hr`
  border: none;
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: ${props => props.margin || '16px 0'};
  
  ${props => props.gradient && css`
    background: linear-gradient(
      to right,
      transparent,
      ${props.theme.colors.border},
      transparent
    );
  `}
`;

// Loading skeleton
export const Skeleton = styled.div`
  background: linear-gradient(
    90deg,
    ${props => props.theme.colors.backgroundAlt} 25%,
    ${props => props.theme.colors.backgroundHover} 50%,
    ${props => props.theme.colors.backgroundAlt} 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-sm);
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

// Input moderno
export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: var(--border-radius-md);
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 14px;
  font-family: inherit;
  transition: var(--transition-default);
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primaryLight};
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${props => props.theme.colors.backgroundAlt};
  }
`;

// Animaciones utilitarias
export const FadeIn = styled.div`
  animation: fadeIn 0.3s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const SlideIn = styled.div`
  animation: slideIn 0.3s ease-out;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
