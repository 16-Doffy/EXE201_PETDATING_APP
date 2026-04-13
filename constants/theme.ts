// Design Tokens
export const Colors = {
  primary: '#FF8C42', secondary: '#A78BFA', success: '#34D399', error: '#F87171',
  background: '#FFFAF5', surface: '#FFFFFF',
  pastelOrange: '#FFD6B0', pastelPurple: '#EDE9FE', pastelGreen: '#D1FAE5', pastelPink: '#FCE7F3',
  textPrimary: '#3B2F4A', textSecondary: '#8B7FA8', textMuted: '#B8A9D1', textInverse: '#FFFFFF',
  border: '#F0EBF8', divider: '#F0EBF8', shadowColor: '#3B2F4A',
  tabActive: '#FF8C42', tabInactive: '#B8A9D1',
  // Swipe feedback colors
  swipeYes: '#4ADE80', swipeNo: '#F87171', swipeSuper: '#60A5FA',
  cardOverlay: 'rgba(0,0,0,0.52)',
  unreadBg: 'rgba(255,140,66,0.08)',
  matchPink: '#FF6B9D',
};
export const Spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, huge: 48 };
export const BorderRadius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 9999, card: 20, btn: 16, chip: 24 };
export const FontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, xxl: 24, xxxl: 28, display: 34 };
export const Shadows = {
  card: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 20, elevation: 5 },
  btn: { shadowColor: '#FF8C42', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
};
