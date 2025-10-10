
import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface ButtonProps {
  title?: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  disabled = false,
  style,
  icon,
  variant = 'primary',
  children,
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondary;
      case 'outline':
        return styles.outline;
      default:
        return styles.primary;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, getVariantStyle(), disabled && styles.disabled, style]}
      activeOpacity={0.7}
    >
      {icon && <View style={{ marginRight: 8 }}>{icon}</View>}
      {title && <Text style={styles.text}>{title}</Text>}
      {children && typeof children === 'string' ? <Text style={styles.text}>{children}</Text> : children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minHeight: 44,
    marginVertical: 4,
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: '#f1f5fd',
  },
  outline: {
    borderWidth: 1,
    borderColor: '#2563eb',
    backgroundColor: '#fff',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});