import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, TextInput, Button, HelperText, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing } from '../src/theme/spacing';
import { useAuthActions } from '../src/features/auth/auth.hooks';
import { registerUser, ApiError } from '../src/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../src/constants';

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { setAuth } = useAuthActions();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [secureEntry, setSecureEntry] = useState(true);
  const [secureConfirm, setSecureConfirm] = useState(true);

  const validate = (): boolean => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError(t('auth.validation.usernameRequired'));
      return false;
    }
    if (trimmedUsername.length < 3 || trimmedUsername.length > 50) {
      setError(t('auth.validation.usernameLength'));
      return false;
    }
    if (!USERNAME_REGEX.test(trimmedUsername)) {
      setError(t('auth.validation.usernameFormat'));
      return false;
    }
    if (!email.trim()) {
      setError(t('auth.validation.emailRequired'));
      return false;
    }
    if (!EMAIL_REGEX.test(email.trim()) || email.trim().length > 200) {
      setError(t('auth.validation.emailInvalid'));
      return false;
    }
    if (!password) {
      setError(t('auth.validation.passwordRequired'));
      return false;
    }
    if (password.length < 6 || password.length > 100) {
      setError(t('auth.validation.passwordLength'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('auth.validation.passwordMismatch'));
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      const apiUrl = (await AsyncStorage.getItem(STORAGE_KEYS.API_URL)) ?? '';
      const response = await registerUser(apiUrl, {
        username: username.trim(),
        email: email.trim(),
        password,
      });
      setAuth(response.token, {
        userId: response.userId,
        username: response.username,
        email: response.email,
      });
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(t('auth.errors.networkError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

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
          colors={['#a18cd1', '#fbc2eb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>🍼</Text>
          <Text style={styles.headerTitle}>{t('auth.register.title')}</Text>
        </LinearGradient>

        <View style={styles.form}>
          <TextInput
            label={t('auth.register.username')}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              clearError();
            }}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            accessibilityLabel={t('auth.register.username')}
          />

          <TextInput
            label={t('auth.register.email')}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              clearError();
            }}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            style={styles.input}
            accessibilityLabel={t('auth.register.email')}
          />

          <TextInput
            label={t('auth.register.password')}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError();
            }}
            mode="outlined"
            secureTextEntry={secureEntry}
            right={
              <TextInput.Icon
                icon={secureEntry ? 'eye-off' : 'eye'}
                onPress={() => setSecureEntry(!secureEntry)}
                accessibilityLabel={secureEntry ? 'Show password' : 'Hide password'}
              />
            }
            style={styles.input}
            accessibilityLabel={t('auth.register.password')}
          />

          <TextInput
            label={t('auth.register.confirmPassword')}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              clearError();
            }}
            mode="outlined"
            secureTextEntry={secureConfirm}
            right={
              <TextInput.Icon
                icon={secureConfirm ? 'eye-off' : 'eye'}
                onPress={() => setSecureConfirm(!secureConfirm)}
                accessibilityLabel={secureConfirm ? 'Show password' : 'Hide password'}
              />
            }
            style={styles.input}
            accessibilityLabel={t('auth.register.confirmPassword')}
          />

          {error ? (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          ) : null}

          <Button
            mode="contained"
            onPress={handleRegister}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
            accessibilityLabel={t('auth.register.submit')}
            accessibilityRole="button"
          >
            {t('auth.register.submit')}
          </Button>

          <View style={styles.linkRow}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              {t('auth.register.hasAccount')}{' '}
            </Text>
            <Text
              style={{ color: theme.colors.primary, fontWeight: '600' }}
              onPress={() => router.push('/login')}
              accessibilityRole="link"
            >
              {t('auth.register.login')}
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
