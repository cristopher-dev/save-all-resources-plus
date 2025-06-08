import { useMemo } from 'react';
import { useAppTheme } from './useAppTheme';
import { isColorDark, getContrastTextColor, getContrastingStyles } from '../themes';

export const useContrastColor = () => {
  const theme = useAppTheme();
  
  return useMemo(() => ({
    // Función para obtener el color de texto contrastante
    getTextColor: (backgroundColor) => getContrastTextColor(backgroundColor, theme),
    
    // Función para obtener estilos completos con contraste
    getStyles: (backgroundColor) => getContrastingStyles(backgroundColor, theme),
    
    // Función para verificar si un color es oscuro
    isDark: (color) => isColorDark(color),
    
    // Colores de texto por defecto del tema
    colors: {
      text: theme.colors.text,
      textSecondary: theme.colors.textSecondary,
      textOnPrimary: getContrastTextColor(theme.colors.primary, theme),
      textOnSecondary: getContrastTextColor(theme.colors.secondary, theme),
      textOnSuccess: getContrastTextColor(theme.colors.success, theme),
      textOnWarning: getContrastTextColor(theme.colors.warning, theme),
      textOnError: getContrastTextColor(theme.colors.error, theme),
      white: theme.colors.white,
      black: theme.colors.black,
    }
  }), [theme]);
};
