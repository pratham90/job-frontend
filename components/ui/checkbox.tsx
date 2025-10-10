
import * as React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
};

export function Checkbox({ checked, onChange, disabled, style }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onChange(!checked)}
      style={[styles.box, checked && styles.checked, disabled && styles.disabled, style]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
    >
      {checked && <View style={styles.check} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#888',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  check: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
