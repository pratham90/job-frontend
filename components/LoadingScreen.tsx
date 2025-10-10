
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';


          
          

        



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loaderWrap: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  text: {
    marginTop: 16,
    fontSize: 18,
    color: '#2563eb',
    fontWeight: 'bold',
  },
});


export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn} style={styles.loaderWrap}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.text}>Loading...</Text>
      </Animated.View>
    </View>
  );
}
