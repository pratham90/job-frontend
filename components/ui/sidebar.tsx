import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('sidebar_open').then(val => {
      if (val !== null) setOpen(val === 'true');
    });
  }, []);

  const toggleSidebar = () => {
    setOpen(prev => {
      AsyncStorage.setItem('sidebar_open', (!prev).toString());
      return !prev;
    });
  };

  return (
    <View style={[styles.sidebar, !open && styles.sidebarCollapsed]}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.toggleBtn}>
        <Text style={styles.toggleText}>{open ? 'Hide' : 'Show'} Sidebar</Text>
      </TouchableOpacity>
      {open && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 220,
    backgroundColor: '#f1f5fd',
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: '#e5e7eb',
    height: '100%',
  },
  sidebarCollapsed: {
    width: 60,
  },
  toggleBtn: {
    padding: 8,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginBottom: 12,
  },
  toggleText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
});


