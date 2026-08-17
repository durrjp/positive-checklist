export const displayFont = {
  regular: 'Fredoka_500Medium',
  semiBold: 'Fredoka_600SemiBold',
  bold: 'Fredoka_700Bold',
} as const;

export const typography = {
  pageTitle: { fontSize: 27, fontFamily: displayFont.semiBold },
  cardTitle: { fontSize: 17.5, fontFamily: displayFont.semiBold },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.44,
  },
};
