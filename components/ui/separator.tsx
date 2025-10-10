
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

type SeparatorProps = {
  orientation?: 'horizontal' | 'vertical';
  style?: any;
};

export function Separator({ orientation = 'horizontal', style }: SeparatorProps) {
  return (
    <View
      style={[
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    width: '100%',
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
});
