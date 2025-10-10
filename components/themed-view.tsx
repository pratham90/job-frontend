import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'background' | 'surface';
};

export function ThemedView({ style, lightColor, darkColor, type = 'background', ...otherProps }: ThemedViewProps) {
  const key = type === 'surface' ? ('surface' as any) : ('background' as any);
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, key);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
