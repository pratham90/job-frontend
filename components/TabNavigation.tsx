
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BookmarkIcon, BriefcaseIcon, HomeIcon, UserIcon } from './ui/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  applicationCount?: number;
  savedCount?: number;
}

export function TabNavigation({ activeTab, onTabChange, applicationCount = 0, savedCount = 0 }: TabNavigationProps) {
  const tabs = [
    { id: 'home', label: 'Discover', icon: HomeIcon },
    { id: 'applied', label: 'Applied', icon: BriefcaseIcon, count: applicationCount },
    { id: 'saved', label: 'Saved', icon: BookmarkIcon, count: savedCount },
    { id: 'profile', label: 'Profile', icon: UserIcon },
  ];

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={styles.fabBarContainer}
    >
      <View style={styles.fabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.tabButton}
              activeOpacity={0.8}
              onPress={() => onTabChange(tab.id)}
            >
              <View style={[styles.iconWrapper, isActive && styles.iconActive]}>
                <Icon color={isActive ? '#2563eb' : '#888'} size={26} />
                {tab.count > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.count > 99 ? '99+' : tab.count}</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.label, isActive && styles.labelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fabBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    zIndex: 100,
  },
  fabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 12,
    minWidth: SCREEN_WIDTH * 0.85,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  iconWrapper: {
    position: 'relative',
    marginBottom: 2,
  },
  iconActive: {
    borderRadius: 16,
    backgroundColor: '#e0e7ff',
    padding: 4,
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: '#2563eb',
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    zIndex: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});