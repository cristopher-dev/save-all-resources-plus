import { setLightness, darken, lighten, rgba } from 'polished';

// Paleta de colores moderna y accesible
export const colors = {
  // Colores primarios
  blue: '#1283c3',
  blueLight: '#60a5fa',
  blueDark: '#1e40af',
  
  // Colores secundarios  
  green: '#10b981',
  greenLight: '#34d399',
  greenDark: '#059669',
  
  // Estados
  red: '#ef4444',
  redLight: '#f87171',
  redDark: '#dc2626',
  
  yellow: '#f59e0b',
  yellowLight: '#fbbf24',
  yellowDark: '#d97706',
  
  // Neutrales
  black: '#000000',
  white: '#ffffff',
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  
  // Colores semánticos
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const THEME_KEYS = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const getShade = (value, baseShade, factor) => darken(factor * value, baseShade);

export const generateThemeConfig = (factor, baseShade, isDark = false) => {
  return {
    name: isDark ? THEME_KEYS.DARK : THEME_KEYS.LIGHT,
    isDark,
    factor,
    
    // Propiedades básicas
    white: colors.white,
    black: colors.black,
    elasticBezier: `cubic-bezier(0.1, 0.71, 0.28, 1.14)`,
    smoothBezier: `cubic-bezier(0.4, 0, 0.2, 1)`,
    borderRadius: 8,
    
    // Sistema de colores mejorado
    colors: {
      // Colores primarios
      primary: isDark ? colors.blueLight : colors.blue,
      primaryHover: isDark ? lighten(0.1, colors.blueLight) : darken(0.1, colors.blue),
      primaryLight: isDark ? rgba(colors.blueLight, 0.2) : rgba(colors.blue, 0.1),
      
      // Colores secundarios
      secondary: isDark ? colors.greenLight : colors.green,
      secondaryHover: isDark ? lighten(0.1, colors.greenLight) : darken(0.1, colors.green),
      secondaryLight: isDark ? rgba(colors.greenLight, 0.2) : rgba(colors.green, 0.1),
      
      // Estados
      success: isDark ? colors.greenLight : colors.green,
      successHover: isDark ? lighten(0.1, colors.greenLight) : darken(0.1, colors.green),
      successBackground: isDark ? rgba(colors.greenLight, 0.15) : colors.gray[50],
      successBorder: isDark ? rgba(colors.greenLight, 0.3) : colors.gray[200],
      
      warning: isDark ? colors.yellowLight : colors.yellow,
      warningHover: isDark ? lighten(0.1, colors.yellowLight) : darken(0.1, colors.yellow),
      warningBackground: isDark ? rgba(colors.yellowLight, 0.15) : '#fffbeb',
      warningBorder: isDark ? rgba(colors.yellowLight, 0.3) : '#fed7aa',
      
      error: isDark ? colors.redLight : colors.red,
      errorHover: isDark ? lighten(0.1, colors.redLight) : darken(0.1, colors.red),
      errorBackground: isDark ? rgba(colors.redLight, 0.15) : '#fef2f2',
      errorBorder: isDark ? rgba(colors.redLight, 0.3) : '#fecaca',
      
      info: isDark ? colors.blueLight : colors.info,
      infoBackground: isDark ? rgba(colors.blueLight, 0.15) : '#eff6ff',
      infoBorder: isDark ? rgba(colors.blueLight, 0.3) : '#bfdbfe',
      
      // Texto
      text: isDark ? colors.gray[100] : colors.gray[900],
      textSecondary: isDark ? colors.gray[300] : colors.gray[600],
      textMuted: isDark ? colors.gray[400] : colors.gray[500],
      textDisabled: isDark ? colors.gray[600] : colors.gray[400],
      
      // Fondos
      background: isDark ? colors.gray[900] : colors.white,
      backgroundSecondary: isDark ? colors.gray[800] : colors.gray[50],
      backgroundAlt: isDark ? colors.gray[800] : colors.gray[100],
      backgroundHover: isDark ? colors.gray[700] : colors.gray[100],
      
      // Superficies
      surface: isDark ? colors.gray[800] : colors.white,
      surfaceHover: isDark ? colors.gray[700] : colors.gray[50],
      surfaceActive: isDark ? colors.gray[600] : colors.gray[100],
      
      // Bordes
      border: isDark ? colors.gray[700] : colors.gray[200],
      borderLight: isDark ? colors.gray[800] : colors.gray[100],
      borderStrong: isDark ? colors.gray[600] : colors.gray[300],
      
      // Sombras
      shadow: isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)',
      shadowStrong: isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.15)',
    },
    
    // Espaciado y sizing
    spacing: {
      xs: '4px',
      sm: '8px', 
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
    
    // Tipografía
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.625,
      },
    },
    
    // Animaciones
    animations: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    
    // Z-index
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
    },
  };
};

export const setGreyscale = (baseShade, factor, stepCount = 30) => {
  return {
    ...Array(stepCount + 1)
      .fill(0)
      .map((i, index) => ({
        index,
        progress: index / stepCount,
      }))
      .reduce(
        (scaleCollection, scale) => ({
          ...scaleCollection,
          [`gray${scale.index}`]: getShade(scale.progress, baseShade, factor),
        }),
        {}
      ),
  };
};

export const BASE_SHADE = {
  [THEME_KEYS.LIGHT]: colors.white,
  [THEME_KEYS.DARK]: colors.gray[900],
};

export const FACTOR = {
  [THEME_KEYS.LIGHT]: 1,
  [THEME_KEYS.DARK]: -0.8,
};

export const THEMES = {
  [THEME_KEYS.LIGHT]: {
    ...generateThemeConfig(FACTOR[THEME_KEYS.LIGHT], BASE_SHADE[THEME_KEYS.LIGHT], false),
    grayScale: setGreyscale(BASE_SHADE[THEME_KEYS.LIGHT], 1),
    base: BASE_SHADE[THEME_KEYS.LIGHT],
  },
  [THEME_KEYS.DARK]: {
    ...generateThemeConfig(FACTOR[THEME_KEYS.DARK], BASE_SHADE[THEME_KEYS.DARK], true),
    grayScale: setGreyscale(BASE_SHADE[THEME_KEYS.DARK], FACTOR[THEME_KEYS.DARK]),
    base: BASE_SHADE[THEME_KEYS.DARK],
  },
};

// Utilidades de tema
export const getTheme = (key) => THEMES[key] || THEMES[THEME_KEYS.LIGHT];

export const createGlobalStyles = (theme) => `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text: ${theme.colors.text};
    --color-border: ${theme.colors.border};
    --shadow: 0 4px 6px -1px ${theme.colors.shadow};
    --border-radius: ${theme.borderRadius}px;
  }
`;

console.log('[DEVTOOL] Temas modernos cargados:', THEMES);
