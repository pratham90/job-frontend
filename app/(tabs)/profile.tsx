import LocationPreference from '../../components/LocationPreference';


import * as DocumentPicker from 'expo-document-picker';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProfileMobile from '../../components/ProfileMobile';
import ResumeUploadMobile from '../../components/ResumeUploadMobile';
import { useThemePreference } from '../../components/ThemePreferenceContext';
import TopHeader from '../../components/TopHeader';
import { LogOutIcon } from '../../components/ui/Icons';
import { useAuth } from '../../components/AuthContext';

  const [location, setLocation] = useState('delhi');

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProfileScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [resume, setResume] = useState<any | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { preference, setPreference } = useThemePreference();
  const insets = useSafeAreaInsets();
  const { logout, user } = useAuth();
  const [location, setLocation] = useState('delhi');

  useEffect(() => {
    const loadPhoto = async () => {
      if (user?.id) {
        const stored = await AsyncStorage.getItem(`photo_${user.id}`);
        setPhoto(stored || null);
      } else {
        setPhoto(null);
      }
    };
    loadPhoto();
  }, [user?.id]);

  const handlePhotoUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['image/jpeg', 'image/png'], copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;
    const file = result.assets[0];
    setPhoto(file.uri);
    if (user?.id && file.uri) {
      await AsyncStorage.setItem(`photo_${user.id}`, file.uri);
    }
  };

  // Upload and parse resume
  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'], copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;
    setUploading(true);
    setProgress(0);
    try {
      const file = result.assets[0];
      const formData = new FormData();
      formData.append('file', {
        uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
        name: file.name || 'resume.pdf',
        type: file.mimeType || 'application/pdf',
      } as any);
  formData.append('clerk_id', user?.id || '');
  formData.append('location', location);

      const response = await fetch('https://resume-parse-hpgv.onrender.com/api/users/upload', {
        method: 'POST',
        body: formData,
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid response from server: ' + text);
      }
      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Failed to upload/parse resume.');
      }
      const profile = data.profile || data.result || null;
      setResume(profile);
      // Persist resume for this user
      if (user?.id && profile) {
        await AsyncStorage.setItem(`resume_${user.id}`, JSON.stringify(profile));
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to upload/parse resume.');
    } finally {
      setUploading(false);
      setProgress(100);
    }
  };

  // Load resume for user on mount/user change
  useEffect(() => {
    const loadResume = async () => {
      if (user?.id) {
        const stored = await AsyncStorage.getItem(`resume_${user.id}`);
        if (stored) {
          try {
            setResume(JSON.parse(stored));
          } catch {
            setResume(null);
          }
        } else {
          setResume(null);
        }
      } else {
        setResume(null);
      }
    };
    loadResume();
  }, [user?.id]);


  return (
    <LinearGradient colors={['#bed9f3ff', '#d5d7daff', '#dcdcdcff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradient}>
      <TopHeader
        title="My Profile"
        right={
          <TouchableOpacity onPress={logout} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LogOutIcon size={20} color="#ef4444" style={{ marginRight: 4 }} />
            <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Logout</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: Math.max(16, SCREEN_WIDTH * 0.05), paddingBottom: Math.max(24, insets.bottom + 72) }]}> 
  <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.card, { maxWidth: 500, width: '100%' }]}> 
          <View style={{ marginBottom: 24, width: '100%' }}>
            <ResumeUploadMobile uploading={uploading} progress={progress} />
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <TouchableOpacity onPress={handleUpload} style={{ backgroundColor: '#2563eb', borderRadius: 8 }}>
                <Text style={{ color: '#fff', padding: 10, fontWeight: 'bold' }}>
                  Upload Resume
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <LocationPreference location={location} setLocation={setLocation} />
          {/* ...existing code... */}
          {/* Show resume if available, pass photo and upload handler to ProfileMobile */}
          {resume && <ProfileMobile {...resume} photo={photo} onPhotoPress={handlePhotoUpload} />}
          
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    alignItems: 'center',
  },
});
