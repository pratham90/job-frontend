import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useAuth } from './AuthContext';
import EmailVerificationScreen from './EmailVerificationScreen';
import { Button } from './ui/Button';

function DoodleCubes({ style }: { style?: any }) {
  return (
    <>
      <View style={[{ position: 'absolute', width: 120, height: 60, top: 0, left: -30, opacity: 0.32, zIndex: 0 }, style]}>
        <LinearGradient
          colors={['#67a8fd', 'transparent']}
          style={{ width: '100%', height: '100%', borderRadius: 18, transform: [{ rotate: '18deg' }] }}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        />
      </View>
      <View style={[{ position: 'absolute', width: 100, height: 50, bottom: 0, right: -20, opacity: 0.22, zIndex: 0 }, style]}>
        <LinearGradient
          colors={['#4d7bc0', 'transparent']}
          style={{ width: '100%', height: '100%', borderRadius: 16, transform: [{ rotate: '-15deg' }] }}
          start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }}
        />
      </View>
    </>
  );
}

export default function SignupScreen({ onShowLogin }: { onShowLogin?: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    setLoading(true);
    const result = await signup(email, password);
    setLoading(false);
    if (result.success) {
      setError('');
      router.replace('/(tabs)/profile');
    } else if (result.message?.includes('verification code')) {
      setShowVerification(true);
      setError('');
    } else {
      setError(result.message || 'Sign-up failed');
    }
  };

  if (showVerification) {
    return <EmailVerificationScreen email={email} onSuccess={() => router.replace('/(tabs)/profile')} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Doodle background */}
      <DoodleCubes />
      <Animated.View
        entering={FadeIn.duration(500)}
        exiting={FadeOut.duration(300)}
        style={[styles.card, { overflow: 'hidden', zIndex: 1 }]}
      >
        {/* Card doodle */}
        <DoodleCubes style={{ top: -20, left: -30, opacity: 0.18, width: 80, height: 40 }} />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join and find your next role</Text>
        {/* Clerk sign-up only needs email and password */}
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? (
          <Animated.Text entering={FadeIn} exiting={FadeOut} style={styles.error}>{error}</Animated.Text>
        ) : null}
        <Button title={loading ? 'Creating...' : 'Sign Up'} onPress={handleSignup} disabled={loading} style={styles.button} />
        <TouchableOpacity onPress={onShowLogin} style={{ marginTop: 16 }}>
          <Text style={{ color: '#2563eb', textAlign: 'center' }}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
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
    alignItems: 'stretch',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3b82f6', marginBottom: 8, textAlign: 'center' },
  subtitle: { color: '#64748b', fontSize: 15, marginBottom: 18, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 15, backgroundColor: '#f1f5fd' },
  button: { marginTop: 8, marginBottom: 8 },
  error: { color: '#ef4444', textAlign: 'center', marginBottom: 8 },
});


