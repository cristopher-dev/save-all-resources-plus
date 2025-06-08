import styled, { css, keyframes } from 'styled-components';
import { lighten } from 'polished';

const toggleSlide = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(24px); }
`;

const togglePulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

export const ToggleWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  pointer-events: ${(props) => (props.$noInteraction ? 'none' : 'all')};
  transition: var(--transition-default);
  opacity: ${(props) => (props.$noInteraction ? 0.6 : 1)};
  
  &:hover {
    transform: ${(props) => (props.$noInteraction ? 'none' : 'scale(1.02)')};
  }
`;

export const ToggleSwitch = styled.div`
  position: relative;
  width: 52px;
  height: 28px;
  background: ${(props) => {
    if (props.$isToggled) {
      const activeColor = props.$activeColor 
        ? props.theme.colors[props.$activeColor] || props.$activeColor 
        : props.theme.colors.primary;
      return activeColor;
    }
    return props.theme.colors.border;
  }};
  border-radius: 14px;
  border: 2px solid ${(props) => {
    if (props.$isToggled) {
      const activeColor = props.$activeColor 
        ? props.theme.colors[props.$activeColor] || props.$activeColor 
        : props.theme.colors.primary;
      return activeColor;
    }
    return props.theme.colors.borderStrong;
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${(props) => props.$isToggled 
    ? `0 0 0 2px ${props.theme.colors.primaryLight}` 
    : 'inset 0 2px 4px rgba(0, 0, 0, 0.1)'
  };
  
  &::before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${(props) => (props.$isToggled ? '26px' : '2px')};
    width: 20px;
    height: 20px;
    background: ${(props) => props.theme.colors.white};
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: ${(props) => (props.$isToggled ? 'scale(1.1)' : 'scale(1)')};
  }
  
  &:hover::before {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    animation: ${togglePulse} 0.6s ease-in-out;
  }
`;

export const ToggleLabel = styled.span`
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => {
    if (props.$isToggled) {
      return props.theme.colors.text;
    }
    return props.theme.colors.textSecondary;
  }};
  transition: var(--transition-default);
  line-height: 1.4;
`;

// Mantenemos el estilo anterior para compatibilidad, pero lo mejoramos
export const LegacyToggleWrapper = styled.div`
  position: relative;
  padding: 12px 12px 12px 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  user-select: none;
  pointer-events: ${(props) => (props.$noInteraction ? 'none' : 'all')};
  border-radius: var(--border-radius-md);
  
  &:hover {
    background: ${(props) => props.theme.colors.backgroundHover};
    transform: translateX(2px);
  }
  
  &::before {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    content: '';
    display: inline-block;
    border: 2px solid;
    position: absolute;
    top: calc(50% - 6px);
    left: 4px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &::after {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    content: '';
    display: inline-block;
    position: absolute;
    top: calc(50% - 4px);
    left: 6px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  ${(props) => {
    // Función para validar si un color es válido
    const isValidColor = (color) => {
      if (!color || typeof color !== 'string') return false;
      // Verificar si es un color hexadecimal válido
      if (color.startsWith('#')) {
        return /^#([0-9A-F]{3}){1,2}$/i.test(color);
      }
      // Verificar si es un color rgb/rgba válido
      if (color.startsWith('rgb')) {
        return /^rgba?\([\d\s,%.]+\)$/i.test(color);
      }
      // Verificar colores CSS nombrados básicos
      const namedColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'gray', 'black', 'white'];
      return namedColors.includes(color.toLowerCase());
    };
    
    // Obtener el color base con validación
    let baseColor = props.theme.colors?.primary || '#1283c3'; // Color por defecto
    
    // Si se especifica un color activo, intentar usarlo
    if (props.$activeColor) {
      const themeColor = props.theme.colors?.[props.$activeColor] || props.theme[props.$activeColor];
      if (isValidColor(themeColor)) {
        baseColor = themeColor;
      }
    }
    
    // Asegurarse de que el color base es válido antes de aplicar lighten
    if (!isValidColor(baseColor)) {
      console.warn('Invalid base color detected:', baseColor, 'Using fallback color');
      baseColor = '#1283c3'; // Color azul por defecto
    }

    const activeColor = (() => {
      try {
        return lighten(props.theme.factor > 0 ? 0 : 0.1, baseColor);
      } catch (error) {
        console.warn('Error applying lighten to color:', baseColor, error);
        return baseColor;
      }
    })();
    
    return props.$isToggled
      ? css`
          color: ${activeColor};
          &::before {
            border-color: ${activeColor};
            background: ${activeColor}20;
          }
          &::after {
            background-color: ${activeColor};
            transform: scale(1);
            box-shadow: 0 0 8px ${activeColor}50;
          }
        `
      : css`
          color: ${props.theme.colors?.textSecondary || props.theme.grayScale?.gray5 || '#6b7280'};
          &::before {
            border-color: ${props.theme.colors?.textSecondary || props.theme.grayScale?.gray5 || '#6b7280'};
            background: transparent;
          }
          &::after {
            background-color: transparent;
            transform: scale(0);
          }
          &:hover {
            color: ${props.theme.colors?.text || props.theme.grayScale?.gray9 || '#111827'};
            &::before {
              border-color: ${props.theme.colors?.text || props.theme.grayScale?.gray9 || '#111827'};
            }
          }
        `;
  }}
`;
