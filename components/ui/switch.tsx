
import * as React from 'react';
import { Switch as RNSwitch } from 'react-native';

type SwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: any;
};

export function Switch({ value, onValueChange, disabled, style }: SwitchProps) {
  return (
    <RNSwitch
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      style={style}
      trackColor={{ false: '#e5e7eb', true: '#2563eb' }}
      thumbColor={value ? '#fff' : '#888'}
    />
  );
}
