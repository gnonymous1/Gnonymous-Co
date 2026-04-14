/**
 * Apex Content OS - World-Class UI Theme Configuration
 * Neon Cybernetic Design System v3.0
 */

// Enhanced Color Palette with AI Intelligence
export const themeColors = {
  // Canvas & Surfaces
  canvas: '#050508',
  surface0: '#08080d',
  surface1: '#0e0e18',
  surface2: '#13131f',
  surface3: '#18182a',

  // Glass Layers with Enhanced Depth
  glassFill: 'rgba(255,255,255,0.038)',
  glassFillMd: 'rgba(255,255,255,0.055)',
  glassFillHi: 'rgba(255,255,255,0.080)',
  glassFillXl: 'rgba(255,255,255,0.120)',
  glassBorder: 'rgba(255,255,255,0.075)',
  glassBorderHi: 'rgba(255,255,255,0.120)',
  glassBorderXl: 'rgba(255,255,255,0.180)',

  // AI Brand Gradient Palette
  brand: '#7c3aed',
  brandMid: '#9333ea',
  brandHi: '#a855f7',
  brandUltra: '#c084fc',
  brandGlow: 'rgba(124,58,237,0.35)',
  brandGlowStrong: 'rgba(124,58,237,0.55)',

  // Enhanced Accent Colors
  cyan: '#06b6d4',
  green: '#10b981',
  amber: '#f59e0b',
  rose: '#f43f5e',
  blue: '#3b82f6',
  pink: '#ec4899',
  purple: '#8b5cf6',
  indigo: '#6366f1',

  // Text Hierarchy
  text1: '#f0f0f8',
  text2: '#9090a8',
  text3: '#505064',
  text4: '#30303c',

  // Radius System
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '22px',
    '2xl': '28px',
    '3xl': '36px',
    full: '9999px'
  },

  // Shadows with Depth
  shadow: {
    sm: '0 1px 4px rgba(0,0,0,0.4)',
    md: '0 4px 20px rgba(0,0,0,0.5)',
    lg: '0 12px 48px rgba(0,0,0,0.55)',
    xl: '0 20px 80px rgba(0,0,0,0.6)',
    brand: '0 0 32px -8px rgba(124,58,237,0.3)',
    brandStrong: '0 0 48px -12px rgba(124,58,237,0.5)'
  },

  // Animation Easing
  easing: {
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// Category Color Mapping for Tool Groups
export const categoryColors = {
  seo: {
    primary: '#6366f1', // Indigo
    secondary: '#818cf8',
    glow: 'rgba(99, 102, 241, 0.3)'
  },
  youtube: {
    primary: '#ef4444', // Red
    secondary: '#f87171',
    glow: 'rgba(239, 68, 68, 0.3)'
  },
  tiktok: {
    primary: '#06b6d4', // Cyan
    secondary: '#22d3ee',
    glow: 'rgba(6, 182, 212, 0.3)'
  },
  ai: {
    primary: '#10b981', // Emerald
    secondary: '#34d399',
    glow: 'rgba(16, 185, 129, 0.3)'
  },
  monetization: {
    primary: '#4ade80', // Green
    secondary: '#22c55e',
    glow: 'rgba(74, 222, 128, 0.3)'
  },
  factory: {
    primary: '#f472b6', // Pink
    secondary: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.3)'
  },
  missions: {
    primary: '#c084fc', // Purple
    secondary: '#a855f7',
    glow: 'rgba(192, 132, 252, 0.3)'
  },
  agency: {
    primary: '#fbbf24', // Amber
    secondary: '#facc15',
    glow: 'rgba(251, 191, 36, 0.3)'
  }
};

// AI Model Color Mapping
export const modelColors = {
  gemini: {
    primary: '#a78bfa',
    secondary: '#c4b5fd',
    text: '#c4b5fd'
  },
  openrouter: {
    primary: '#22d3ee',
    secondary: '#67e8f9',
    text: '#67e8f9'
  },
  nvidia: {
    primary: '#34d399',
    secondary: '#6ee7b7',
    text: '#6ee7b7'
  }
};

// Enhanced Gradient Presets
export const gradients = {
  primary: 'linear-gradient(135deg, #7c3aed, #9333ea, #a855f7)',
  cyan: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  emerald: 'linear-gradient(135deg, #10b981, #06b6d4)',
  amber: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  rose: 'linear-gradient(135deg, #f43f5e, #ec4899)',
  blue: 'linear-gradient(135deg, #3b82f6, #6366f1)',
  purple: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
  indigo: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  glass: 'linear-gradient(145deg, rgba(255,255,255,0.038), rgba(255,255,255,0.055))'
};

// Animation Configuration
export const animations = {
  fadeUp: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOutExpo' }
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOutExpo' }
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.94 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: 'easeOutBack' }
  },
  stagger: {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOutExpo' }
  }
};

// Typography Configuration
export const typography = {
  display: {
    size: 'clamp(2.2rem, 5vw, 3.8rem)',
    weight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1.05
  },
  hero: {
    size: 'clamp(1.6rem, 3.5vw, 2.8rem)',
    weight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.1
  },
  title: {
    size: '1.35rem',
    weight: 700,
    letterSpacing: '-0.02em',
    lineHeight: 1.2
  },
  subtitle: {
    size: '1.05rem',
    weight: 600,
    letterSpacing: '-0.01em'
  },
  body: {
    size: '0.875rem',
    weight: 400,
    lineHeight: 1.65
  },
  caption: {
    size: '0.75rem',
    color: 'var(--text-3)'
  },
  label: {
    size: '0.6875rem',
    weight: 700,
    letterSpacing: '0.09em',
    transform: 'uppercase'
  },
  mono: {
    family: "'JetBrains Mono', ui-monospace, monospace",
    size: '0.8125em'
  }
};

// Export comprehensive theme object
export const apexTheme = {
  colors: themeColors,
  categories: categoryColors,
  models: modelColors,
  gradients: gradients,
  animations: animations,
  typography: typography
};

export default apexTheme;