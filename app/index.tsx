import LoginScreen from '@/components/LoginScreen';
import SignupScreen from '@/components/SignupScreen';
import React, { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppEntrySplash() {
  // Optionally show a splash or loading indicator
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

export function AuthGate() {
  // Toggle between login and signup
  const [showSignup, setShowSignup] = useState(false);

  return showSignup ? (
    <SignupScreen onShowLogin={() => setShowSignup(false)} />
  ) : (
    <LoginScreen onShowSignup={() => setShowSignup(true)} />
  );
}


