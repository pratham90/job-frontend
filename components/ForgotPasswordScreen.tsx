import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator } from 'react-native';
import { useSignIn } from '@clerk/clerk-expo';
import { Button } from './ui/Button';

export default function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const { signIn } = useSignIn();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequest = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await signIn.create({ identifier: email });
      await signIn.prepareFirstFactor({ strategy: 'reset_password_email_code' });
      setStep('reset');
      setSuccess('A reset code has been sent to your email.');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to send reset code');
    }
    setLoading(false);
  };

  const handleReset = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code, password });
      setSuccess('Password reset successful! You can now log in.');
    } catch (err: any) {
      setError(err?.errors?.[0]?.message || err?.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {step === 'request' ? (
        <>
          <Text style={styles.subtitle}>Enter your email to receive a reset code.</Text>
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <Button title={loading ? 'Sending...' : 'Send Reset Code'} onPress={handleRequest} disabled={loading || !email} style={styles.button} />
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>Enter the code sent to your email and your new password.</Text>
          <TextInput style={styles.input} placeholder="Reset code" value={code} onChangeText={setCode} autoCapitalize="none" />
          <TextInput style={styles.input} placeholder="New password" value={password} onChangeText={setPassword} secureTextEntry />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}
          <Button title={loading ? 'Resetting...' : 'Reset Password'} onPress={handleReset} disabled={loading || !code || !password} style={styles.button} />
        </>
      )}
      <Button title="Back to Login" onPress={onBack} style={styles.button} />
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
  success: {
    color: '#22c55e',
    textAlign: 'center',
    marginBottom: 8,
  },
});
