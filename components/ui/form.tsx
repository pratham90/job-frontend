
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type FormProps = {
  children: React.ReactNode;
  style?: any;
  onSubmit?: () => void;
};

export function Form({ children, style, onSubmit }: FormProps) {
  // onSubmit can be handled by parent or by a button
  return <View style={style}>{children}</View>;
}

type FormItemProps = {
  children: React.ReactNode;
  style?: any;
};

export function FormItem({ children, style }: FormItemProps) {
  return <View style={[styles.item, style]}>{children}</View>;
}

type FormLabelProps = {
  children: React.ReactNode;
  style?: any;
};

export function FormLabel({ children, style }: FormLabelProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

type FormDescriptionProps = {
  children: React.ReactNode;
  style?: any;
};

export function FormDescription({ children, style }: FormDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>;
}

type FormMessageProps = {
  children: React.ReactNode;
  style?: any;
};

export function FormMessage({ children, style }: FormMessageProps) {
  if (!children) return null;
  return <Text style={[styles.message, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  item: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  description: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: '#dc2626',
    marginTop: 2,
  },
});
