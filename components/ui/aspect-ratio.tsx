
import * as React from 'react';
import { View } from 'react-native';

type AspectRatioProps = {
  ratio: number;
  style?: any;
  children: React.ReactNode;
};

export function AspectRatio({ ratio, style, children }: AspectRatioProps) {
  return (
    <View style={[{ aspectRatio: ratio }, style]}>
      {children}
    </View>
  );
}
