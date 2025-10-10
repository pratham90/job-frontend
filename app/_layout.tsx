import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import AuroraBackground from '@/components/AuroraBackground';
import { AuthProvider, useAuth } from '@/components/AuthContext';
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import LoginScreen from '@/components/LoginScreen';
import SignupScreen from '@/components/SignupScreen';
import { ThemePreferenceProvider, useThemePreference } from '@/components/ThemePreferenceContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = React.useState(false);
  if (!user) {
    return showSignup ? (
      <SignupScreen onShowLogin={() => setShowSignup(false)} />
    ) : (
      <LoginScreen onShowSignup={() => setShowSignup(true)} />
    );
  }
  return <>{children}</>;
}

function ThemedRoot() {
  const systemScheme = useColorScheme();
  const { preference } = useThemePreference();
  const resolved = preference === 'system' ? systemScheme : preference;
  return (
    <ThemeProvider value={resolved === 'dark' ? DarkTheme : DefaultTheme}>
      <AuroraBackground />
      <AuthGate>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
      </AuthGate>
      <StatusBar style={resolved === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}
export default function Layout() {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
  <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <AuthProvider>
          <ThemePreferenceProvider>
            <ThemedRoot />
          </ThemePreferenceProvider>
        </AuthProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  );
}
