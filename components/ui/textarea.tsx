
import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

type TextareaProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  style?: any;
  editable?: boolean;
};

export function Textarea(props: TextareaProps) {
  return <TextInput {...props} style={[styles.textarea, props.style]} multiline numberOfLines={4} />;
}

const styles = StyleSheet.create({
  textarea: {
    minHeight: 64,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    fontSize: 16,
    marginVertical: 4,
    textAlignVertical: 'top',
  },
});
