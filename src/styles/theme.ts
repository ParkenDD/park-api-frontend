export const theme = {
  colors: {
    primary: '#1f5fa8',
    primaryDark: '#164781',
    text: '#1d2733',
    muted: '#5b6675',
    border: '#d8dee6',
    background: '#ffffff',
    surface: '#f4f6f9',
    overlay: 'rgba(255, 255, 255, 0.94)',
    free: '#2e9e44',
    scarce: '#e0a400',
    full: '#c7362b',
    unknown: '#1f5fa8',
  },
  fonts: {
    body: "'Open Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  },
  radius: '6px',
  shadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
  headerHeight: '64px',
  contentWidth: '880px',
  breakpoints: {
    mobile: '720px',
  },
};

export type Theme = typeof theme;
