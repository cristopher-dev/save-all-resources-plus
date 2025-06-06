import styled, { css, keyframes } from 'styled-components';
import { darken, lighten } from 'polished';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const getVariantStyles = (variant, theme) => {
  switch (variant) {
    case 'primary':
      return css`
        background: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primaryHover};
          border-color: ${theme.colors.primaryHover};
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
        
        &:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: var(--shadow-sm);
        }
      `;
      
    case 'secondary':
      return css`
        background: ${theme.colors.secondary};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.secondary};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.secondaryHover};
          border-color: ${theme.colors.secondaryHover};
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }
      `;
      
    case 'ghost':
      return css`
        background: transparent;
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.backgroundHover};
          border-color: ${theme.colors.borderStrong};
        }
      `;
      
    case 'outline':
      return css`
        background: transparent;
        color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.primaryLight};
          color: ${theme.colors.primary};
        }
      `;
      
    case 'danger':
      return css`
        background: ${theme.colors.error};
        color: ${theme.colors.white};
        border: 1px solid ${theme.colors.error};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.errorHover};
          border-color: ${theme.colors.errorHover};
        }
      `;
      
    default:
      return css`
        background: ${theme.colors.backgroundAlt};
        color: ${theme.colors.text};
        border: 1px solid ${theme.colors.border};
        
        &:hover:not(:disabled) {
          background: ${theme.colors.backgroundHover};
        }
      `;
  }
};

const getSizeStyles = (size) => {
  switch (size) {
    case 'sm':
      return css`
        padding: 6px 12px;
        font-size: 12px;
        min-height: 32px;
      `;
    case 'lg':
      return css`
        padding: 12px 24px;
        font-size: 16px;
        min-height: 48px;
      `;
    default: // md
      return css`
        padding: 8px 16px;
        font-size: 14px;
        min-height: 40px;
      `;
  }
};

export const ButtonWrapper = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  outline: none;
  border-radius: var(--border-radius-md);
  transition: var(--transition-default);
  
  ${props => getVariantStyles(props.variant || 'primary', props.theme)}
  ${props => getSizeStyles(props.size || 'md')}
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
  
  &:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
  
  // Spinner
  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
  
  .loading {
    opacity: 0.7;
  }
  
  // Ripple effect
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
  
  // Icon support
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;
