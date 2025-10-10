import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from './AuthContext';

type TopHeaderProps = {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  colors?: string[]; // supports 2-3 stops
};

export default function TopHeader({ title, subtitle, right, colors }: TopHeaderProps) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  return (
  <View style={[styles.container, { paddingTop: Math.max(32, insets.top + 22) }]}> 
      <LinearGradient
        colors={((colors && colors.length >= 2) ? colors : ['#f8fafc', '#e5e7eb', '#f1f5f9']) as unknown as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Soft highlight overlay to add depth */}
      <LinearGradient
        colors={["rgba(255,255,255,0.32)", "rgba(255,255,255,0)"] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 40 }}
      />
      {/* Decorative gradient doodles */}
      <LinearGradient colors={['rgba(103, 168, 253, 0.5)', 'transparent'] as [string, string]} style={[styles.doodle, { top: 10, left: -40, transform: [{ rotate: '20deg' }] }]} />
      <LinearGradient colors={['rgba(77, 123, 192, 0.5)', 'transparent'] as [string, string]} style={[styles.doodle, { top: 40, right: -30, transform: [{ rotate: '-15deg' }] }]} />
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 26,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderBottomWidth: Platform.select({ ios: 0.2, default: 0.4 }),
    borderBottomColor: 'rgba(15,23,42,0.06)',
    minHeight: 110,
  },
  title: { fontSize: 25, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#334155', marginTop: 4 },
  doodle: { position: 'absolute', width: 160, height: 80, borderRadius: 24, opacity: 0.4 },
});


