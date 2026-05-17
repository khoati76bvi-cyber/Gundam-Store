export type ThemeSettings = Record<string, string>;

const presetMap: Record<string, Record<string, string>> = {
  GUNDAM_DARK: {
    '--theme-bg': '#05070d', '--theme-panel': 'rgba(255,255,255,.055)', '--theme-text': '#f8fafc',
    '--theme-muted': 'rgba(255,255,255,.62)', '--theme-primary': '#ef233c', '--theme-accent': '#22d3ee', '--theme-glow': 'rgba(239,35,60,.35)'
  },
  CYBER_NEON: {
    '--theme-bg': '#020617', '--theme-panel': 'rgba(34,211,238,.08)', '--theme-text': '#f8fafc',
    '--theme-muted': 'rgba(225,245,255,.68)', '--theme-primary': '#22d3ee', '--theme-accent': '#a855f7', '--theme-glow': 'rgba(34,211,238,.38)'
  },
  PREMIUM_BLACK: {
    '--theme-bg': '#030303', '--theme-panel': 'rgba(255,255,255,.06)', '--theme-text': '#ffffff',
    '--theme-muted': 'rgba(255,255,255,.66)', '--theme-primary': '#d4af37', '--theme-accent': '#f97316', '--theme-glow': 'rgba(212,175,55,.32)'
  },
  LIGHT_CLEAN: {
    '--theme-bg': '#f7fafc', '--theme-panel': 'rgba(15,23,42,.055)', '--theme-text': '#0f172a',
    '--theme-muted': 'rgba(15,23,42,.66)', '--theme-primary': '#2563eb', '--theme-accent': '#dc2626', '--theme-glow': 'rgba(37,99,235,.22)'
  }
};

export function getThemeStyle(settings: ThemeSettings): React.CSSProperties {
  const preset = settings['theme.preset'] || 'GUNDAM_DARK';
  const base = { ...(presetMap[preset] || presetMap.GUNDAM_DARK) };
  if (settings['theme.primary']) base['--theme-primary'] = settings['theme.primary'];
  if (settings['theme.accent']) base['--theme-accent'] = settings['theme.accent'];
  if (settings['theme.bg']) base['--theme-bg'] = settings['theme.bg'];
  if (settings['theme.panel']) base['--theme-panel'] = settings['theme.panel'];
  return base as React.CSSProperties;
}

export function sectionEnabled(settings: ThemeSettings, key: string, fallback = true) {
  const v = settings[`section.${key}`];
  if (v === undefined) return fallback;
  return v === 'true' || v === '1' || v === 'on';
}
