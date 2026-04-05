import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/i18n';
import { lightTheme } from '../src/theme';
import { useProductActions } from '../src/features/products/products.hooks';
import { useAuth } from '../src/features/auth/auth.hooks';

function AuthGate({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, router]);

  return <>{children}</>;
}

function AppContent(): React.JSX.Element {
  const { initializeProducts } = useProductActions();

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  return (
    <AuthGate>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: true, title: '' }} />
        <Stack.Screen
          name="add-product"
          options={{ headerShown: true, title: '', presentation: 'modal' }}
        />
      </Stack>
    </AuthGate>
  );
}

export default function RootLayout(): React.JSX.Element {
  const theme = lightTheme;

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <AppContent />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
