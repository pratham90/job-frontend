
import { Slider as RNSlider } from '@react-native-community/slider';
import * as React from 'react';

type SliderProps = {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  disabled?: boolean;
  style?: any;
};

export function Slider({ value, onValueChange, minimumValue = 0, maximumValue = 100, step = 1, disabled, style }: SliderProps) {
  return (
    <RNSlider
      value={value}
      onValueChange={onValueChange}
      minimumValue={minimumValue}
      maximumValue={maximumValue}
      step={step}
      disabled={disabled}
      style={style}
      minimumTrackTintColor="#2563eb"
      maximumTrackTintColor="#e5e7eb"
      thumbTintColor="#2563eb"
    />
  );
}
