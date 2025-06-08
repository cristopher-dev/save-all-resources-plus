import styled, { css } from 'styled-components';
import { lighten } from 'polished';

export const ToggleWrapper = styled.div`
  position: relative;
  padding: 10px 10px 10px 20px;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.15s ease-out;
  user-select: none;
  pointer-events: ${(props) => (props.$noInteraction ? 'none' : 'all')};
  &::before {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    content: '';
    display: inline-block;
    border: 2px solid;
    position: absolute;
    top: calc(0px + 11px);
    left: 0;
    transition: all 0.15s ease-out;
  }
  &::after {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    content: '';
    display: inline-block;
    position: absolute;
    top: calc(4px + 11px);
    left: 4px;
    transition: all 0.3s ${(props) => props.theme.elasticBezier};
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
          }
          &::after {
            background-color: ${activeColor};
            transform: scale(1);
          }
        `
      : css`
          color: ${props.theme.colors?.textSecondary || props.theme.grayScale?.gray5 || '#6b7280'};
          &::before {
            border-color: ${props.theme.colors?.textSecondary || props.theme.grayScale?.gray5 || '#6b7280'};
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
