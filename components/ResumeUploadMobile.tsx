import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { FileTextIcon } from './ui/Icons';

export default function ResumeUploadMobile({ uploading, progress }: { uploading: boolean; progress: number }) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={styles.card}
    >
      <View style={styles.iconWrap}>
        <FileTextIcon width={30} height={30} color="#2563eb" />
      </View>
      <Text style={styles.title}>Upload Resume</Text>
      {uploading ? (
        <View style={styles.progressWrap}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.progressText}>{progress}% complete</Text>
        </View>
      ) : (
        <Text style={styles.desc}>Tap the button below to select and upload your resume (PDF, DOC, DOCX)</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 24,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    marginTop: 32,
  },
  iconWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    
    backgroundColor: '#f1f5fd',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    textAlign: 'center',
  },
  desc: {
    color: '#888',
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  progressWrap: {
    alignItems: 'center',
    marginTop: 12,
  },
  progressText: {
    color: '#2563eb',
    fontSize: 15,
    marginTop: 8,
  },
});
