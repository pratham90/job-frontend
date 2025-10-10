import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { Button } from './ui/Button';

export default function EmailVerificationScreen({ email, onSuccess }: { email: string; onSuccess: () => void }) {
  const { signUp, setActive } = useSignUp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await signUp.attemptEmailAddressVerification({ code });
      if (res.status === 'complete' && res.createdSessionId) {
        await setActive({ session: res.createdSessionId });
        onSuccess();
        return;
      }
      setError('Verification failed. Try again.');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || 'Verification failed');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>Enter the code sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Verification code"
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title={loading ? 'Verifying...' : 'Verify'} onPress={handleVerify} disabled={loading || !code} style={styles.button} />
      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#f1f5fd',
    width: 220,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
    width: 220,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
});
