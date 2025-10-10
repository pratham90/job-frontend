
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TableProps = {
  headers: string[];
  data: (string | number)[][];
  style?: any;
};

export function Table({ headers, data, style }: TableProps) {
  return (
    <View style={[styles.table, style]}>
      <View style={styles.headerRow}>
        {headers.map((header, idx) => (
          <Text key={idx} style={styles.headerCell}>{header}</Text>
        ))}
      </View>
      {data.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((cell, cellIdx) => (
            <Text key={cellIdx} style={styles.cell}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  headerCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    color: '#222',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cell: {
    flex: 1,
    padding: 10,
    color: '#222',
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
  },
});
