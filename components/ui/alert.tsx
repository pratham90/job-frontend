import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type AlertProps = {
  children: React.ReactNode;
  variant?: 'default' | 'destructive';
  style?: any;
};

export function Alert({ children, variant = 'default', style }: AlertProps) {
  return (
    <View style={[styles.base, variant === 'destructive' && styles.destructive, style]}>
      {children}
    </View>
  );
}

export function AlertTitle({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[styles.title, style]}>{children}</Text>
  );
}

export function AlertDescription({ children, style }: { children: React.ReactNode; style?: any }) {
  return (
    <Text style={[styles.description, style]}>{children}</Text>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  destructive: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 2,
  },
  description: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
  },
});
