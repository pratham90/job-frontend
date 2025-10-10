import React, { useRef } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, SharedValue, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { BriefcaseIcon, HeartIcon, SparklesIcon, StarIcon } from './ui/Icons';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

type DotProps = { index: number; scrollX: SharedValue<number> };
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  iconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#222', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#2563eb', marginBottom: 8, textAlign: 'center' },
  desc: { color: '#666', textAlign: 'center', marginBottom: 20, fontSize: 15 },
  dots: { position: 'absolute', bottom: 90, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#2563eb', marginHorizontal: 6 },
  navRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 16 },
  navBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 8 },
  navBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  outlineBtn: { backgroundColor: '#f1f5fd', borderWidth: 1, borderColor: '#2563eb' },
  skipBtn: { alignItems: 'center', marginBottom: 16 },
  skipText: { color: '#888', fontSize: 14 },
});

const Dot = ({ index, scrollX }: DotProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = scrollX.value / width;
    const scale = interpolate(input, [index - 1, index, index + 1], [0.8, 1.4, 0.8]);
    const opacity = interpolate(input, [index - 1, index, index + 1], [0.4, 1, 0.4]);
    return { transform: [{ scale }], opacity };
  });
  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const slides = [
  {
    icon: SparklesIcon,
    title: 'Welcome to JobSeeker',
    subtitle: 'Your AI-powered job discovery companion',
    description: 'Swipe through personalized job recommendations just like your favorite dating app, but for your career!',
    gradient: ['#a21caf', '#db2777']
  },
  {
    icon: BriefcaseIcon,
    title: 'Smart Matching',
    subtitle: 'Jobs that fit you perfectly',
    description: 'Our AI analyzes your resume and finds opportunities that match your skills, experience, and career goals.',
    gradient: ['#2563eb', '#06b6d4']
  },
  {
    icon: HeartIcon,
    title: 'Swipe to Apply',
    subtitle: 'Love it or leave it',
    description: 'Swipe right to apply, left to pass, or save your favorites for later. It\'s that simple!',
    gradient: ['#db2777', '#ef4444']
  },
  {
    icon: StarIcon,
    title: 'Track Your Success',
    subtitle: 'Never lose track of applications',
    description: 'Monitor your application progress, schedule interviews, and land your dream job!',
    gradient: ['#f59e42', '#fbbf24']
  }
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const scrollX = useSharedValue(0);
  const scrollRef = useRef<Animated.ScrollView>(null);
  const [current, setCurrent] = React.useState(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (ev) => {
      scrollX.value = ev.contentOffset.x;
    },
  });

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * width, animated: true });
    setCurrent(idx);
  };

  const next = () => {
    if (current < slides.length - 1) {
      goTo(current + 1);
    } else {
      onComplete();
    }
  };


  const prev = () => {
    if (current > 0) goTo(current - 1);
  };


  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    iconWrap: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
    title: { fontSize: 24, fontWeight: '700', marginBottom: 8, color: '#222', textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#2563eb', marginBottom: 8, textAlign: 'center' },
    desc: { color: '#666', textAlign: 'center', marginBottom: 20, fontSize: 15 },
    dots: { position: 'absolute', bottom: 90, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: '#2563eb', marginHorizontal: 6 },
    navRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 16 },
    navBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 8 },
    navBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    outlineBtn: { backgroundColor: '#f1f5fd', borderWidth: 1, borderColor: '#2563eb' },
    skipBtn: { alignItems: 'center', marginBottom: 16 },
    skipText: { color: '#888', fontSize: 14 },
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(ev: any) => {
          const idx = Math.round(ev.nativeEvent.contentOffset.x / width);
          setCurrent(idx);
        }}
      >
        {slides.map((slide, i) => {
          const Icon = slide.icon;
          return (
            <View style={[styles.page, { width }]} key={i}>
              <View style={[styles.iconWrap, { backgroundColor: slide.gradient[0] }]}> {/* Could use LinearGradient for more accuracy */}
                <Icon width={64} height={64} color="#fff" />
              </View>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
              <Text style={styles.desc}>{slide.description}</Text>
            </View>
          );
        })}
      </Animated.ScrollView>
      {/* Dots */}
      <View style={styles.dots}>
        {slides.map((_, i) => (
          <Dot key={i} index={i} scrollX={scrollX} />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navRow}>
        {current > 0 && (
          <TouchableOpacity style={[styles.navBtn, styles.outlineBtn]} onPress={prev}>
            <Text style={[styles.navBtnText, { color: '#2563eb' }]}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.navBtn, { backgroundColor: slides[current].gradient[0] }]}
          onPress={next}
        >
          <Text style={styles.navBtnText}>{current === slides.length - 1 ? '🚀 Get Started' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
      {current < slides.length - 1 && (
        <TouchableOpacity onPress={onComplete} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip onboarding</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

export default OnboardingScreen;