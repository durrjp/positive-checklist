import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS, Easing } from 'react-native-reanimated';

const PARTICLE_COLORS = ['#8A6B4F', '#7C8560', '#7A4F44', '#4F6B7A', '#8A6F2A'];
const PARTICLE_COUNT = 8;

interface ConfettiBurstProps {
  onDone: () => void;
}

export function ConfettiBurst({ onDone }: ConfettiBurstProps) {
  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, index) => (
        <Particle
          key={index}
          index={index}
          color={PARTICLE_COLORS[index % PARTICLE_COLORS.length]}
          onDone={index === PARTICLE_COUNT - 1 ? onDone : undefined}
        />
      ))}
    </View>
  );
}

function Particle({ index, color, onDone }: { index: number; color: string; onDone?: () => void }) {
  const progress = useSharedValue(0);
  const angle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const distance = 26;

  useEffect(() => {
    progress.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) }, (finished) => {
      if (finished && onDone) {
        runOnJS(onDone)();
      }
    });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateX: Math.cos(angle) * distance * progress.value },
      { translateY: Math.sin(angle) * distance * progress.value },
      { scale: 1 - progress.value * 0.5 },
    ],
  }));

  return <Animated.View style={[styles.particle, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  container: { position: 'absolute', left: 6, top: 6, width: 0, height: 0 },
  particle: { position: 'absolute', width: 6, height: 6, borderRadius: 3 },
});
