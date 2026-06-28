// ── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Single source of truth for all visual decisions in ITAMAE

export const COLOR = {
  bg:       '#080808',
  surface:  '#0d0d0d',
  card:     '#111111',
  border:   '#1e1e1e',
  borderSub:'#1a1a1a',
  hover:    '#1a1a1a',

  gold:     '#c9a84c',
  goldDark: '#9a7020',
  goldLight:'#e8c86a',

  text:     '#e0e0e0',
  textSub:  '#999',
  textMuted:'#555',
  textDim:  '#404040',
  textGhost:'#333',

  green:    '#4a8a4a',
  greenDim: '#2a4a2a',
  red:      '#8a4a4a',
  blue:     '#4a6a8a',
}

export const FONT = {
  display: "'Cinzel', serif",
  body:    "'Inter', -apple-system, sans-serif",
}

export const RADIUS = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
}

// ── SHARED STYLE OBJECTS ─────────────────────────────────────────────────────
// These are reusable inline-style snippets consumed by all components.

export const S = {
  // Layout
  app: {
    display: 'flex',
    minHeight: '100vh',
    background: COLOR.bg,
    fontFamily: FONT.body,
    color: COLOR.text,
  },

  sidebar: {
    width: 220,
    minHeight: '100vh',
    background: COLOR.surface,
    borderRight: `1px solid ${COLOR.borderSub}`,
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    zIndex: 100,
    overflowY: 'auto',
  },

  sidebarLogo: {
    padding: '28px 20px 20px',
    borderBottom: `1px solid ${COLOR.borderSub}`,
  },

  logoKanji: {
    fontSize: 11,
    letterSpacing: '0.22em',
    color: COLOR.gold,
    fontWeight: 600,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  logoName: {
    fontSize: 22,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '-0.02em',
    fontFamily: FONT.display,
  },

  sidebarProfile: {
    padding: '16px 20px',
    borderBottom: `1px solid ${COLOR.borderSub}`,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #1e1e1e, #2a2a2a)',
    border: `1px solid ${COLOR.gold}33`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    marginBottom: 4,
    flexShrink: 0,
    overflow: 'hidden',
  },

  navItem: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? COLOR.hover : 'transparent',
    borderLeft: active ? `2px solid ${COLOR.gold}` : '2px solid transparent',
    color: active ? '#f0f0f0' : '#666',
    fontSize: 13,
    fontWeight: active ? 500 : 400,
  }),

  main: {
    marginLeft: 220,
    flex: 1,
    padding: '32px 40px',
    minHeight: '100vh',
    maxWidth: 'calc(100vw - 220px)',
  },

  // Typography
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#f0f0f0',
    letterSpacing: '-0.03em',
    marginBottom: 4,
    fontFamily: FONT.display,
  },

  pageSubtitle: {
    fontSize: 13,
    color: COLOR.textMuted,
    marginBottom: 28,
    letterSpacing: '0.02em',
  },

  // Cards
  card: {
    background: COLOR.card,
    border: `1px solid ${COLOR.border}`,
    borderRadius: RADIUS.lg,
    padding: 24,
  },

  cardTitle: {
    fontSize: 11,
    letterSpacing: '0.15em',
    color: COLOR.textMuted,
    textTransform: 'uppercase',
    marginBottom: 14,
    fontWeight: 600,
  },

  // Grid helper (call as function)
  grid: (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: 16,
  }),

  // XP bar
  xpBar: {
    height: 6,
    background: COLOR.border,
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },

  xpFill: (pct) => ({
    height: '100%',
    width: `${Math.min(100, pct * 100)}%`,
    background: `linear-gradient(90deg, ${COLOR.goldDark}, ${COLOR.gold}, ${COLOR.goldLight})`,
    borderRadius: 3,
    transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
  }),

  // Buttons
  btn: {
    background: COLOR.hover,
    border: `1px solid #2e2e2e`,
    borderRadius: RADIUS.md,
    color: COLOR.gold,
    fontSize: 13,
    fontWeight: 500,
    padding: '9px 18px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  btnPrimary: {
    background: `linear-gradient(135deg, ${COLOR.goldDark}, ${COLOR.gold})`,
    border: 'none',
    borderRadius: RADIUS.md,
    color: COLOR.bg,
    fontSize: 13,
    fontWeight: 700,
    padding: '10px 20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  btnDanger: {
    background: '#1a0a0a',
    border: '1px solid #3a1a1a',
    borderRadius: RADIUS.md,
    color: '#8a4a4a',
    fontSize: 13,
    fontWeight: 500,
    padding: '9px 18px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },

  // Form elements
  input: {
    background: COLOR.surface,
    border: `1px solid #222`,
    borderRadius: RADIUS.md,
    color: COLOR.text,
    fontSize: 13,
    padding: '9px 12px',
    outline: 'none',
    width: '100%',
  },

  textarea: {
    background: COLOR.surface,
    border: `1px solid #222`,
    borderRadius: RADIUS.md,
    color: COLOR.text,
    fontSize: 13,
    padding: '10px 12px',
    outline: 'none',
    width: '100%',
    resize: 'vertical',
    minHeight: 80,
    fontFamily: 'inherit',
  },

  select: {
    background: COLOR.surface,
    border: `1px solid #222`,
    borderRadius: RADIUS.md,
    color: COLOR.text,
    fontSize: 13,
    padding: '9px 12px',
    outline: 'none',
    width: '100%',
    cursor: 'pointer',
  },

  label: {
    fontSize: 11,
    color: COLOR.textMuted,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: 6,
  },

  // Badges & tags
  badge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    background: `${color}18`,
    border: `1px solid ${color}40`,
    borderRadius: RADIUS.sm,
    padding: '2px 8px',
    fontSize: 11,
    color,
  }),

  tag: {
    background: COLOR.hover,
    border: `1px solid #222`,
    borderRadius: RADIUS.sm,
    padding: '2px 8px',
    fontSize: 11,
    color: '#666',
    display: 'inline-block',
  },

  // Modal
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
  },

  modalBox: {
    background: COLOR.card,
    border: '1px solid #2a2a2a',
    borderRadius: RADIUS.xl,
    padding: 32,
    width: 'min(560px, 90vw)',
    maxHeight: '85vh',
    overflowY: 'auto',
  },

  // Toast
  toast: (visible) => ({
    position: 'fixed',
    bottom: 32,
    right: 32,
    background: COLOR.card,
    border: `1px solid ${COLOR.gold}44`,
    borderRadius: RADIUS.lg,
    padding: '14px 20px',
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(12px)',
    transition: 'all 0.3s',
    zIndex: 2000,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }),
}
