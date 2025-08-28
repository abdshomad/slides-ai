export const appColors = {
  background: {
    base: { light: '#f8fafc', dark: '#0f172a' }, // slate-50, slate-900
    muted: { light: '#ffffff', dark: '#1e293b' }, // white, slate-800
    subtle: { light: '#f1f5f9', dark: '#334155' }, // slate-100, slate-700
    interactive: { light: '#e2e8f0', dark: '#475569' }, // slate-200, slate-600
    'interactive-hover': { light: '#cbd5e1', dark: '#525c6f' }, // slate-300, custom dark hover
  },
  text: {
    primary: { light: '#1e293b', dark: '#f8fafc' }, // slate-800, slate-50
    secondary: { light: '#64748b', dark: '#94a3b8' }, // slate-500, slate-400
    'on-accent': { light: '#ffffff', dark: '#ffffff' },
  },
  border: {
    primary: { light: '#e2e8f0', dark: '#334155' }, // slate-200, slate-700
    secondary: { light: '#cbd5e1', dark: '#475569' }, // slate-300, slate-600
    focus: { light: '#db2777', dark: '#f472b6' }, // pink-600, pink-400
  },
  accent: {
    DEFAULT: { light: '#db2777', dark: '#f472b6' }, // pink-600, pink-400
    hover: { light: '#be185d', dark: '#f05ea3' }, // pink-700, custom dark hover
  },
  special: {
    success: { light: '#16a34a', dark: '#4ade80' }, // green-600, green-400
    danger: { light: '#dc2626', dark: '#f87171' }, // red-600, red-400
    info: { light: '#4f46e5', dark: '#818cf8' }, // indigo-600, indigo-400
    gradient: { from: '#a855f7', to: '#d946ef' }, // purple-500, fuchsia-500 (used in header)
  },
};
