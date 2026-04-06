import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter, Redirect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../src/theme/spacing';
import { useAuthActions, useAuth } from '../src/features/auth/auth.hooks';
import { loginUser, ApiError } from '../src/services/api';
import { useProductsStore } from '../src/features/products/products.store';

export default function LoginScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { setAuth } = useAuthActions();
  const apiBaseUrl = useProductsStore((s) => s.apiBaseUrl);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const validate = (): boolean => {
    if (!username.trim()) {
      setError(t('auth.validation.usernameRequired'));
      return false;
    }
    if (!password) {
      setError(t('auth.validation.passwordRequired'));
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await loginUser(apiBaseUrl, { username: username.trim(), password });
      setAuth(response.token, {
        userId: response.userId,
        username: response.username,
        email: response.email,
      });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError && (err.status === 403 || err.status === 400)) {
        setError(t('auth.errors.invalidCredentials'));
      } else {
        setError(t('auth.errors.networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[styles.flex, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#f093fb', '#f5576c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>🍼</Text>
          <Text style={styles.headerTitle}>{t('auth.login.title')}</Text>
        </LinearGradient>

        <View style={styles.form}>
          <TextInput
            label={t('auth.login.username')}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setError('');
            }}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel={t('auth.login.username')}
          />

          <TextInput
            label={t('auth.login.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            mode="outlined"
            secureTextEntry={secureEntry}
            right={
              <TextInput.Icon
                icon={secureEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureEntry(!secureEntry)}
                accessibilityLabel={
                  secureEntry
                    ? t('auth.validation.showPassword')
                    : t('auth.validation.hidePassword')
                }
              />
            }
            style={styles.input}
            accessibilityLabel={t('auth.login.password')}
          />

          {error ? (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel={t('auth.login.submit')}
            accessibilityRole="button"
          >
            {t('auth.login.submit')}
          </Button>

          <View style={styles.linkRow}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {t('auth.login.noAccount')}{' '}
            </Text>
            <Text
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => router.push('/register')}
              accessibilityRole="link"
            >
              {t('auth.login.register')}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: 'white',
  },
  form: {
    padding: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.sm,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
});
