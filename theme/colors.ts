export const colors = {
  background: '#F0EAE2',
  surface: '#FBF8F3',
  border: '#E3D8C8',
  textPrimary: '#4A4038',
  textSecondary: '#8A7F72',
  textSecondaryAlt: '#9A8E7D',
  accent: '#8A6B4F',
  strikethrough: '#B8AC9C',
} as const;

export interface GoalColorOption {
  name: string;
  tint: string;
  shade: string;
}

export const goalColorPalette: GoalColorOption[] = [
  { name: 'Clay', tint: '#D8C3B0', shade: '#6B4E36' },
  { name: 'Olive', tint: '#C7CBB8', shade: '#5B6444' },
  { name: 'Mauve', tint: '#C9B8B0', shade: '#7A4F44' },
  { name: 'Dusty Blue', tint: '#B9C4CC', shade: '#4F6B7A' },
  { name: 'Honey', tint: '#D9C48A', shade: '#8A6F2A' },
  { name: 'Rose Clay', tint: '#D9B3AE', shade: '#8A5850' },
  { name: 'Sage', tint: '#B8C4A8', shade: '#5F7048' },
  { name: 'Taupe Plum', tint: '#C4B8C7', shade: '#6E5A72' },
];

export function getGoalColorShade(tint: string): string {
  const match = goalColorPalette.find((option) => option.tint === tint);
  return match ? match.shade : colors.textPrimary;
}
