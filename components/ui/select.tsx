import * as React from 'react';
import { View, Text, Pressable, Modal, StyleSheet, FlatList } from 'react-native';

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  style?: any;
};

export function Select({ options, value, onValueChange, placeholder = 'Select...', style }: SelectProps) {
  const [visible, setVisible] = React.useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label || placeholder;
  return (
    <>
      <Pressable style={[styles.trigger, style]} onPress={() => setVisible(true)}>
        <Text style={styles.triggerText}>{selectedLabel}</Text>
      </Pressable>
      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onValueChange(item.value);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </Pressable>
              )}
            />
            <Pressable onPress={() => setVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginVertical: 4,
  },
  triggerText: {
    fontSize: 16,
    color: '#222',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: 280,
    maxHeight: 400,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  optionText: {
    fontSize: 16,
    color: '#2563eb',
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'flex-end',
    padding: 8,
  },
  closeText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
});