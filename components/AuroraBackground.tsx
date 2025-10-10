import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

type AuroraBackgroundProps = {
  children?: React.ReactNode;
};

export default function AuroraBackground({ children }: AuroraBackgroundProps) {
  const t1 = useSharedValue(0);
  const t2 = useSharedValue(0);
  const t3 = useSharedValue(0);

  React.useEffect(() => {
    t1.value = withRepeat(withTiming(1, { duration: 12000 }), -1, true);
    t2.value = withRepeat(withTiming(1, { duration: 16000 }), -1, true);
    t3.value = withRepeat(withTiming(1, { duration: 20000 }), -1, true);
  }, [t1, t2, t3]);

  const b1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: -80 + 160 * t1.value },
      { translateY: -20 + 40 * t1.value },
      { scale: 1 + 0.1 * Math.sin(t1.value * Math.PI) },
    ],
  }));
  const b2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: 40 - 80 * t2.value },
      { translateY: 60 - 120 * t2.value },
      { scale: 1 + 0.12 * Math.cos(t2.value * Math.PI) },
    ],
  }));
  const b3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: -30 + 60 * t3.value },
      { translateY: 80 - 160 * t3.value },
      { scale: 1 + 0.08 * Math.sin(t3.value * Math.PI) },
    ],
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={["#eef2ff", "#f8fafc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.blob, styles.blobBlue, b1]} />
      <Animated.View style={[styles.blob, styles.blobPurple, b2]} />
      <Animated.View style={[styles.blob, styles.blobPink, b3]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  blob: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 180,
    opacity: 0.28,
    filter: 'blur(60px)' as any,
  },
  blobBlue: {
    backgroundColor: '#60a5fa',
    top: 60,
    left: -40,
  },
  blobPurple: {
    backgroundColor: '#a78bfa',
    right: -60,
    top: 140,
  },
  blobPink: {
    backgroundColor: '#f472b6',
    left: 80,
    bottom: 60,
  },
});


