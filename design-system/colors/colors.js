/**
 * Color Palette - Data Gems Chrome Extension
 * Design System Colors extracted from Figma
 * JavaScript export for programmatic access
 */

export const colors = {
  // Primary Scale - Blue Brand Colors
  primary: {
    10: '#f5fcff',
    20: '#e6f8ff',
    30: '#cff1ff',
    40: '#afe9ff',
    50: '#7fdeff',
    60: '#4accf9',
    70: '#13b3eb',
    80: '#0e93c4',
    90: '#0a7096',
  },

  // Secondary Scale - Warm Tan/Beige Colors
  secondary: {
    10: '#fefbf6',
    20: '#fcf4e8',
    30: '#faeacf',
    40: '#f9ddb5',
    50: '#f9d8a3',
    60: '#f3be76',
    70: '#c77f28',
    80: '#c77f28',
    90: '#a5661f',
  },

  // Neutral Scale - Gray Colors
  neutral: {
    10: '#ffffff',
    20: '#f8fafb',
    30: '#e6eaec',
    40: '#ccd2d6',
    50: '#98a0a6',
    60: '#6c757c',
    70: '#50585e',
    80: '#343a3f',
    90: '#1e2225',
  },

  // Semantic Colors
  semantic: {
    success: '#6fe6a8',
    warning: '#f8e87a',
    error: '#f57464',
    info: '#a8e1ff',
  },

  // Gradients - Aurora, Mist, Sundown
  gradients: {
    aurora: 'linear-gradient(45deg, #C9A2FF 42.75%, #7FDEFF 100%)',
    mist: 'linear-gradient(to bottom, #f5fcff, #f3e8ff)',
    sundown: 'linear-gradient(133deg, #F9D8A3 16.05%, #F57464 76.12%)',
  },
};

// Semantic Color Mappings
export const semanticColors = {
  primary: colors.primary[60],
  primaryLight: colors.primary[40],
  primaryDark: colors.primary[80],

  background: colors.neutral[10],
  backgroundSecondary: colors.neutral[20],
  backgroundTertiary: colors.secondary[10],

  text: {
    primary: colors.neutral[80],
    secondary: colors.neutral[60],
    tertiary: colors.neutral[50],
    inverse: colors.neutral[10],
  },

  border: {
    default: colors.neutral[40],
    light: colors.neutral[30],
    dark: colors.neutral[50],
  },

  surface: {
    default: colors.neutral[10],
    hover: colors.neutral[20],
    active: colors.primary[20],
  },

  success: colors.semantic.success,
  warning: colors.semantic.warning,
  error: colors.semantic.error,
  info: colors.semantic.info,
};

// Export as default
export default {
  colors,
  semanticColors,
};
