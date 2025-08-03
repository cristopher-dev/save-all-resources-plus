// Paleta de colores moderna, clara y hermosa
export const colors = {
  // Colores primarios - tonos claros y vibrantes
  blue: '#60a5fa',
  blueLight: '#93c5fd',
  blueDark: '#3b82f6',
  
  // Colores secundarios - verdes frescos
  green: '#34d399',
  greenLight: '#6ee7b7',
  greenDark: '#10b981',
  
  // Estados - colores suaves y amigables
  red: '#f87171',
  redLight: '#fca5a5',
  redDark: '#ef4444',
  
  yellow: '#fbbf24',
  yellowLight: '#fcd34d',
  yellowDark: '#f59e0b',
  
  // Neutrales - grises más claros y suaves
  black: '#1f2937',
  white: '#ffffff',
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Colores semánticos - más claros y amigables
  success: '#34d399',
  warning: '#fbbf24',
  error: '#f87171',
  info: '#60a5fa',
};

// Utilidades de color nativas
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbaToString = (r, g, b, a = 1) => `rgba(${r}, ${g}, ${b}, ${a})`;

const lighten = (amount, color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  const { r, g, b } = rgb;
  const newR = Math.min(255, Math.round(r + (255 - r) * amount));
  const newG = Math.min(255, Math.round(g + (255 - g) * amount));
  const newB = Math.min(255, Math.round(b + (255 - b) * amount));
  return `rgb(${newR}, ${newG}, ${newB})`;
};

const darken = (amount, color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  const { r, g, b } = rgb;
  const newR = Math.max(0, Math.round(r * (1 - amount)));
  const newG = Math.max(0, Math.round(g * (1 - amount)));
  const newB = Math.max(0, Math.round(b * (1 - amount)));
  return `rgb(${newR}, ${newG}, ${newB})`;
};

const rgba = (color, alpha) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return rgbaToString(rgb.r, rgb.g, rgb.b, alpha);
};

const getLuminance = (color) => {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
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
      // Colores primarios - más vibrantes y claros
      primary: isDark ? colors.blueLight : colors.blue,
      primaryHover: isDark ? lighten(0.15, colors.blueLight) : lighten(0.1, colors.blue),
      primaryLight: isDark ? rgba(colors.blueLight, 0.25) : rgba(colors.blue, 0.15),
      
      // Colores secundarios - verdes frescos
      secondary: isDark ? colors.greenLight : colors.green,
      secondaryHover: isDark ? lighten(0.15, colors.greenLight) : lighten(0.1, colors.green),
      secondaryLight: isDark ? rgba(colors.greenLight, 0.25) : rgba(colors.green, 0.15),
      
      // Estados - colores más suaves y amigables
      success: isDark ? colors.greenLight : colors.green,
      successHover: isDark ? lighten(0.15, colors.greenLight) : lighten(0.1, colors.green),
      successBackground: isDark ? rgba(colors.greenLight, 0.2) : '#f0fdf4',
      successBorder: isDark ? rgba(colors.greenLight, 0.4) : '#bbf7d0',
      
      warning: isDark ? colors.yellowLight : colors.yellow,
      warningHover: isDark ? lighten(0.15, colors.yellowLight) : lighten(0.1, colors.yellow),
      warningBackground: isDark ? rgba(colors.yellowLight, 0.2) : '#fffbeb',
      warningBorder: isDark ? rgba(colors.yellowLight, 0.4) : '#fde68a',
      
      error: isDark ? colors.redLight : colors.red,
      errorHover: isDark ? lighten(0.15, colors.redLight) : lighten(0.1, colors.red),
      errorBackground: isDark ? rgba(colors.redLight, 0.2) : '#fef2f2',
      errorBorder: isDark ? rgba(colors.redLight, 0.4) : '#fecaca',
      
      info: isDark ? colors.blueLight : colors.info,
      infoBackground: isDark ? rgba(colors.blueLight, 0.2) : '#eff6ff',
      infoBorder: isDark ? rgba(colors.blueLight, 0.4) : '#bfdbfe',
        // Texto - TODAS LAS FUENTES EN BLANCO
      text: colors.white,
      textSecondary: colors.white,
      textMuted: colors.white,
      textDisabled: colors.white,
      
      // Fondos - más claros y aireados
      background: isDark ? colors.gray[800] : '#fafafa',
      backgroundSecondary: isDark ? colors.gray[700] : '#f5f5f5',
      backgroundAlt: isDark ? colors.gray[700] : '#ffffff',
      backgroundHover: isDark ? colors.gray[600] : '#f0f0f0',
      
      // Superficies - más luminosas
      surface: isDark ? colors.gray[700] : colors.white,
      surfaceHover: isDark ? colors.gray[600] : '#f8f8f8',
      surfaceActive: isDark ? colors.gray[500] : '#f0f0f0',
      
      // Bordes - más suaves
      border: isDark ? colors.gray[600] : colors.gray[200],
      borderLight: isDark ? colors.gray[700] : colors.gray[100],
      borderStrong: isDark ? colors.gray[500] : colors.gray[300],
      
      // Sombras - más delicadas
      shadow: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.08)',
      shadowStrong: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.12)',
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
export const getTheme = (key) => {
  console.log('[DEVTOOL] getTheme: Requested key:', key);
  console.log('[DEVTOOL] getTheme: Available themes:', Object.keys(THEMES));
  
  let theme = THEMES[key] || THEMES[THEME_KEYS.LIGHT];
  
  // Validación más estricta de la estructura del tema
  if (!theme || !theme.colors) {
    console.error('[DEVTOOL] getTheme: Invalid theme structure for key:', key, 'Theme:', theme);
    // Crear un tema básico de emergencia con estructura completa
    theme = {
      name: 'emergency',
      isDark: false,
      factor: 1,
      white: '#ffffff',
      black: '#000000',
      elasticBezier: 'cubic-bezier(0.1, 0.71, 0.28, 1.14)',
      smoothBezier: 'cubic-bezier(0.4, 0, 0.2, 1)',
      borderRadius: 8,
      colors: {
        primary: '#1283c3',
        primaryHover: '#0d6ba3',
        primaryLight: '#e3f2fd',
        secondary: '#10b981',
        secondaryHover: '#059669',
        secondaryLight: '#ecfdf5',
        success: '#10b981',
        successHover: '#059669',
        successBackground: '#ecfdf5',
        successBorder: '#a7f3d0',
        warning: '#f59e0b',
        warningHover: '#d97706',
        warningBackground: '#fffbeb',
        warningBorder: '#fed7aa',
        error: '#ef4444',
        errorHover: '#dc2626',
        errorBackground: '#fef2f2',
        errorBorder: '#fecaca',
        info: '#3b82f6',
        infoBackground: '#eff6ff',
        infoBorder: '#bfdbfe',
        text: '#111827',
        textSecondary: '#4b5563',
        textMuted: '#6b7280',
        textDisabled: '#9ca3af',
        background: '#ffffff',
        backgroundSecondary: '#f9fafb',
        backgroundAlt: '#f3f4f6',
        backgroundHover: '#f3f4f6',
        surface: '#ffffff',
        surfaceHover: '#f9fafb',
        surfaceActive: '#f3f4f6',
        border: '#e5e7eb',
        borderLight: '#f3f4f6',
        borderStrong: '#d1d5db',
        shadow: 'rgba(0, 0, 0, 0.1)',
        shadowStrong: 'rgba(0, 0, 0, 0.15)',
        white: '#ffffff',
        black: '#000000'
      },
      grayScale: {
        gray0: '#ffffff',
        gray1: '#f9fafb',
        gray2: '#f3f4f6',
        gray3: '#e5e7eb',
        gray4: '#d1d5db',
        gray5: '#9ca3af',
        gray9: '#111827',
        gray10: '#374151',
        gray20: '#6b7280'
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px'
      },
      typography: {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        fontSize: {
          xs: '12px',
          sm: '14px',
          base: '16px',
          lg: '18px',
          xl: '20px',
          '2xl': '24px'
        },
        fontWeight: {
          light: 300,
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.625
        }
      },
      animations: {
        fast: '150ms',
        normal: '250ms',
        slow: '350ms'
      },
      zIndex: {
        dropdown: 1000,
        sticky: 1020,
        fixed: 1030,
        modal: 1040,
        popover: 1050,
        tooltip: 1060
      }
    };
  }
  
  // Segunda validación para asegurar propiedades críticas
  if (!theme.colors || !theme.colors.primary) {
    console.error('[DEVTOOL] getTheme: Theme missing critical colors property');
    theme.colors = theme.colors || {};
    theme.colors.primary = theme.colors.primary || '#1283c3';
    theme.colors.background = theme.colors.background || '#ffffff';
    theme.colors.text = theme.colors.text || '#000000';
    theme.colors.white = theme.colors.white || '#ffffff';
    theme.colors.surface = theme.colors.surface || '#ffffff';
    theme.colors.border = theme.colors.border || '#e5e7eb';
  }
  
  console.log('[DEVTOOL] getTheme: Returning theme for key:', key, 'Theme name:', theme.name);
  return theme;
};

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
