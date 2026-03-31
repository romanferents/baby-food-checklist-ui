import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../src/i18n';
import { lightTheme } from '../src/theme';
import { useProductActions } from '../src/features/products/products.hooks';

function AppContent(): React.JSX.Element {
  const { initializeProducts } = useProductActions();

  useEffect(() => {
    initializeProducts();
  }, [initializeProducts]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: true, title: '' }} />
      <Stack.Screen
        name="add-product"
        options={{ headerShown: true, title: '', presentation: 'modal' }}
      />
    </Stack>
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
