import React, { createContext, ReactNode, useContext } from 'react';
import { useAuth as useClerkAuth, useSignIn, useSignUp, useUser, ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-expo';
import Constants from 'expo-constants';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, signOut } = useClerkAuth();
  const { signIn, setActive: setActiveFromSignIn } = useSignIn();
  const { signUp, setActive: setActiveFromSignUp } = useSignUp();
  const { user } = useUser();

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn.create({ identifier: email, password });
      await setActiveFromSignIn({ session: res.createdSessionId });
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.errors?.[0]?.message || err?.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      console.log('Clerk signUp.create payload:', { email_address: email, password });
      const res = await signUp.create({ email_address: email, password });
      console.log('Clerk signUp.create result:', res);
      // Always trigger email verification after create
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      console.log('Clerk signUp: prepareEmailAddressVerification called');
      return {
        success: false,
        message: 'A verification code has been sent. Please check your Clerk dashboard (Users > your email) for the code and enter it in the app (code entry screen needed).'
      };
      // If you want to implement in-app code entry, add a screen to call signUp.attemptEmailAddressVerification({ code })
    } catch (err: any) {
      console.error('Clerk signUp.create error:', err);
      return { success: false, message: err?.errors?.[0]?.message || err?.message || 'Sign-up failed' };
    }
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
