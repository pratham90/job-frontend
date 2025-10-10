
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type RadioGroupProps = {
  options: { label: string; value: string }[];
  value: string;
  onValueChange: (value: string) => void;
  style?: any;
};

export function RadioGroup({ options, value, onValueChange, style }: RadioGroupProps) {
  return (
    <View style={[styles.group, style]}>
      {options.map(opt => (
        <Pressable
          key={opt.value}
          style={styles.item}
          onPress={() => onValueChange(opt.value)}
        >
          <View style={[styles.circle, value === opt.value && styles.selected]} />
          <Text style={styles.label}>{opt.label}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: 'column',
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2563eb',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  selected: {
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 16,
    color: '#222',
  },
});
