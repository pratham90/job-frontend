import * as React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: any;
};

export function Toggle({ value, onValueChange, label, disabled, style }: ToggleProps) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      style={[styles.toggle, value && styles.active, disabled && styles.disabled, style]}
      accessibilityRole="button"
      accessibilityState={{ pressed: value, disabled }}
      disabled={disabled}
    >
      {label && <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  toggle: {
    minWidth: 40,
    minHeight: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
  },
  active: {
    backgroundColor: '#2563eb',
  },
  label: {
    color: '#222',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabled: {
    opacity: 0.5,
  },
});
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
