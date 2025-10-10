
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type ProgressProps = {
  value: number;
  style?: any;
};

export function Progress({ value, style }: ProgressProps) {
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.bar, { width: `${value}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: 8,
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
});
