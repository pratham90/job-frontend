
import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type AvatarProps = {
  source: ImageSourcePropType;
  size?: number;
  style?: object;
  fallbackText?: string;
};

export function Avatar({ source, size = 40, style, fallbackText }: AvatarProps) {
  if (source) {
    return (
      <Image
        source={source}
        style={[
          styles.avatar,
          { width: size, height: size, borderRadius: size / 2 },
          style,
        ]}
        resizeMode="cover"
      />
    );
  }
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
        style,
      ]}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: size / 2 }}>{fallbackText || '?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
});
