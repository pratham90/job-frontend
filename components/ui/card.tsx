import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function Card({ style, children, onPress, ...props }: any) {
  // Animation for touch feedback
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  return (
    <Animated.View
      entering={FadeIn.duration(500)}
      exiting={FadeOut}
      style={[styles.cardShadow, animatedStyle, style]}
    >
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.97); }}
        onPressOut={() => { scale.value = withSpring(1); }}
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && { opacity: 0.96 }]}
        android_ripple={{ color: '#e0e7ff' }}
        {...props}
      >
        <View style={styles.gradientBg} />
        {children}
      </Pressable>
    </Animated.View>
  );
}

function CardHeader({ style, children, ...props }: any) {
  return (
    <View style={[styles.cardHeader, style]} {...props}>
      {children}
    </View>
  );
}

function CardTitle({ style, children, ...props }: any) {
  return (
    <Text style={[styles.cardTitle, style]} {...props}>
      {children}
    </Text>
  );
}

function CardDescription({ style, children, ...props }: any) {
  return (
    <Text style={[styles.cardDescription, style]} {...props}>
      {children}
    </Text>
  );
}

function CardAction({ style, children, ...props }: any) {
  return (
    <View style={[styles.cardAction, style]} {...props}>
      {children}
    </View>
  );
}

function CardContent({ style, children, ...props }: any) {
  return (
    <View style={[styles.cardContent, style]} {...props}>
      {children}
    </View>
  );
}

function CardFooter({ style, children, ...props }: any) {
  return (
    <View style={[styles.cardFooter, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    marginBottom: 16,
    borderRadius: 18,
    shadowColor: '#6366f1',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    padding: 0,
    minHeight: 60,
    justifyContent: 'center',
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    borderRadius: 18,
    opacity: 0.18,
    backgroundColor: 'linear-gradient(135deg, #a5b4fc 0%, #f0abfc 100%)', // fallback for web, will be ignored on native
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  cardDescription: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  cardAction: {
    alignSelf: 'flex-end',
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 4,
  },
});

export {
  CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
};
