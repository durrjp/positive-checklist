import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { Easing } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { displayFont } from '../theme/typography';

interface SplashAnimationProps {
  onDone: () => void;
}

const REVEAL_MS = 750;
const HOLD_MS = 1050;
const FADE_MS = 400;

export function SplashAnimation({ onDone }: SplashAnimationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), HOLD_MS);
    const doneTimer = setTimeout(onDone, HOLD_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  return (
    <MotiView
      style={styles.overlay}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ type: 'timing', duration: FADE_MS }}
    >
      <MotiText
        style={styles.wordmark}
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: REVEAL_MS, easing: Easing.out(Easing.cubic) }}
      >
        Little Wins
      </MotiText>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  wordmark: {
    fontSize: 48,
    fontFamily: displayFont.bold,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
});
