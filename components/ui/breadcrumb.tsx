
import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type BreadcrumbProps = {
  items: {
    label: string;
    onPress?: () => void;
    isCurrent?: boolean;
  }[];
  style?: any;
};

export function Breadcrumb({ items, style }: BreadcrumbProps) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <BreadcrumbItem
            label={item.label}
            onPress={item.onPress}
            isCurrent={item.isCurrent}
          />
          {idx < items.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))}
    </View>
  );
}

type BreadcrumbItemProps = {
  label: string;
  onPress?: () => void;
  isCurrent?: boolean;
};

function BreadcrumbItem({ label, onPress, isCurrent }: BreadcrumbItemProps) {
  if (isCurrent) {
    return <Text style={[styles.item, styles.current]}>{label}</Text>;
  }
  return (
    <Pressable onPress={onPress} style={styles.item}>
      <Text style={styles.link}>{label}</Text>
    </Pressable>
  );
}

function BreadcrumbSeparator() {
  return <Text style={styles.separator}>{'>'}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  item: {
    marginHorizontal: 2,
    fontSize: 14,
    color: '#2563eb',
  },
  link: {
    color: '#2563eb',
    textDecorationLine: 'underline',
  },
  current: {
    color: '#222',
    fontWeight: 'bold',
  },
  separator: {
    marginHorizontal: 2,
    color: '#888',
    fontSize: 14,
  },
});
