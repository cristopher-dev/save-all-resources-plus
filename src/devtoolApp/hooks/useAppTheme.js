import { useEffect, useMemo } from 'react';
import { getTheme, THEME_KEYS } from '../themes';

export const useAppTheme = () => {
  const theme = window.theme;
  
  const currentTheme = useMemo(() => {
    try {
      // Asegurar que tenemos una clave de tema válida
      const themeKey = theme || THEME_KEYS.LIGHT;
      console.log('[DEVTOOL] useAppTheme: Using theme key:', themeKey);
      
      const resolvedTheme = getTheme(themeKey);
      
      // Verificar que el tema tiene la estructura esperada
      if (!resolvedTheme || !resolvedTheme.colors) {
        console.error('[DEVTOOL] useAppTheme: Invalid theme structure:', resolvedTheme);
        // Usar tema por defecto
        return getTheme(THEME_KEYS.LIGHT);
      }
      
      console.log('[DEVTOOL] useAppTheme: Theme resolved successfully:', themeKey);
      return resolvedTheme;
    } catch (error) {
      console.error('[DEVTOOL] useAppTheme: Error resolving theme:', error);
      // Fallback al tema claro
      return getTheme(THEME_KEYS.LIGHT);
    }
  }, [theme]);

  useEffect(() => {
    try {
      if (currentTheme && currentTheme.colors && currentTheme.colors.background) {
        document.body.style.backgroundColor = currentTheme.colors.background;
      }
    } catch (error) {
      console.error('[DEVTOOL] useAppTheme: Error setting background color:', error);
    }
  }, [currentTheme]);

  window.debugTheme = currentTheme;

  return currentTheme;
};
