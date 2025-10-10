import * as Haptics from 'expo-haptics';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { JobProvider } from '../../components/JobContext';
import { BookmarkIcon, FileTextIcon, StarIcon, UserIcon } from '../../components/ui/Icons';

const TAB_CONFIG = [
  { name: 'index', label: 'Discover', icon: StarIcon },
  { name: 'applied', label: 'Applied', icon: FileTextIcon },
  { name: 'saved', label: 'Saved', icon: BookmarkIcon },
  { name: 'profile', label: 'Profile', icon: UserIcon },
];

function CustomTabBar({ state, navigation }: any) {
  const activeIndex = state.index;
  // Only call hooks at the top level for each tab (4 tabs)
  const anim0 = useSharedValue(activeIndex === 0 ? 1 : 0);
  const anim1 = useSharedValue(activeIndex === 1 ? 1 : 0);
  const anim2 = useSharedValue(activeIndex === 2 ? 1 : 0);
  const anim3 = useSharedValue(activeIndex === 3 ? 1 : 0);
  // Move anims inside useEffect to avoid dependency warning
  const iconAnim0 = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.2 * anim0.value },
      { translateY: -8 * anim0.value },
    ],
    shadowColor: '#2563eb',
    shadowOpacity: 0.15 * anim0.value,
    shadowRadius: 8 * anim0.value,
    shadowOffset: { width: 0, height: 4 * anim0.value },
  }));
  const iconAnim1 = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.2 * anim1.value },
      { translateY: -8 * anim1.value },
    ],
    shadowColor: '#2563eb',
    shadowOpacity: 0.15 * anim1.value,
    shadowRadius: 8 * anim1.value,
    shadowOffset: { width: 0, height: 4 * anim1.value },
  }));
  const iconAnim2 = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.2 * anim2.value },
      { translateY: -8 * anim2.value },
    ],
    shadowColor: '#2563eb',
    shadowOpacity: 0.15 * anim2.value,
    shadowRadius: 8 * anim2.value,
    shadowOffset: { width: 0, height: 4 * anim2.value },
  }));
  const iconAnim3 = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 + 0.2 * anim3.value },
      { translateY: -8 * anim3.value },
    ],
    shadowColor: '#2563eb',
    shadowOpacity: 0.15 * anim3.value,
    shadowRadius: 8 * anim3.value,
    shadowOffset: { width: 0, height: 4 * anim3.value },
  }));
  const iconAnims = [iconAnim0, iconAnim1, iconAnim2, iconAnim3];
  const dotAnim0 = useAnimatedStyle(() => ({
    transform: [{ scale: anim0.value }],
    opacity: anim0.value,
  }));
  const dotAnim1 = useAnimatedStyle(() => ({
    transform: [{ scale: anim1.value }],
    opacity: anim1.value,
  }));
  const dotAnim2 = useAnimatedStyle(() => ({
    transform: [{ scale: anim2.value }],
    opacity: anim2.value,
  }));
  const dotAnim3 = useAnimatedStyle(() => ({
    transform: [{ scale: anim3.value }],
    opacity: anim3.value,
  }));
  const dotAnims = [dotAnim0, dotAnim1, dotAnim2, dotAnim3];

  React.useEffect(() => {
    const anims = [anim0, anim1, anim2, anim3];
    anims.forEach((a, idx) => {
      a.value = withSpring(idx === activeIndex ? 1 : 0, { damping: 20 });
    });
  }, [activeIndex]);

  return (
    <View style={styles.tabBarContainer}>
      <Animated.View style={[styles.glassBg, { opacity: 1 }]} />
      {TAB_CONFIG.map((tab, idx) => {
        const isActive = idx === activeIndex;
        return (
          <Pressable
            key={tab.name}
            style={styles.tabBtn}
            onPress={() => {
              navigation.navigate(tab.name);
              if (Platform.OS === 'ios') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Animated.View style={[styles.iconWrap, iconAnims[idx]]}>
              {React.createElement(tab.icon, {
                size: isActive ? 30 : 26,
                color: isActive ? '#3b82f6' : '#9aa0a6',
                style: [{
                  shadowColor: isActive ? '#60a5fa' : 'transparent',
                  shadowOpacity: isActive ? 0.3 : 0,
                  shadowRadius: isActive ? 10 : 0,
                  shadowOffset: { width: 0, height: 2 },
                }],
              })}
              {isActive && (
                <Animated.View style={[styles.activeDot, dotAnims[idx]]} />
              )}
            </Animated.View>
            <Text style={[styles.tabLabel, isActive && { color: '#3b82f6', fontWeight: '700', fontSize: 14, letterSpacing: 0.6 }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabLayout() {
  return (
    <JobProvider>
      <Tabs
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tabs.Screen name="index" options={{ title: 'Discover' }} />
        <Tabs.Screen name="applied" options={{ title: 'Applied' }} />
        <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </JobProvider>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    minHeight: 64,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  glassBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: -1,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  // marginBottom: 2, // removed duplicate
    position: 'relative',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(240,246,255,0.9)',
    marginBottom: 2,
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
    shadowColor: '#60a5fa',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  tabLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
});
