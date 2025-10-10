
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

type LabelProps = {
  children: React.ReactNode;
  style?: any;
};

export function Label({ children, style }: LabelProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
});
