import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Text, List, Switch, Button, TextInput, Divider, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProductsStore } from '../../src/features/products/products.store';
import { useProductActions } from '../../src/features/products/products.hooks';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { exportToJSON, importFromJSON, shareFile } from '../../src/services/backup';
import { APP_VERSION, GITHUB_URL, STORAGE_KEYS } from '../../src/constants';
import { spacing } from '../../src/theme/spacing';
import { i18n } from '../../src/i18n';
import { useColorScheme } from '../../src/hooks/useColorScheme';
import * as Linking from 'expo-linking';

export default function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const colorScheme = useColorScheme();
  const products = useProductsStore((s) => s.products);
  const { resetAllProgress, importProducts } = useProductActions();
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  const isUkrainian = i18n.language === 'uk';

  const handleLanguageToggle = async () => {
    const newLang = isUkrainian ? 'en' : 'uk';
    await i18n.changeLanguage(newLang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang);
  };

  const handleExport = async () => {
    const json = exportToJSON(products);
    await shareFile(json, 'baby-food-checklist.json');
  };

  const handleReset = () => {
    resetAllProgress();
    setResetDialogVisible(false);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={[styles.heading, { color: theme.colors.onBackground }]}>
        {t('settings.title')}
      </Text>

      {/* Language */}
      <List.Section>
        <List.Subheader>{t('settings.language')}</List.Subheader>
        <List.Item
          title={isUkrainian ? 'Українська 🇺🇦' : 'English 🇺🇸'}
          right={() => (
            <Switch
              value={isUkrainian}
              onValueChange={handleLanguageToggle}
              color={theme.colors.primary}
            />
          )}
        />
      </List.Section>

      <Divider />

      {/* Data Management */}
      <List.Section>
        <List.Subheader>{t('settings.dataManagement.title')}</List.Subheader>
        <List.Item
          title={t('settings.dataManagement.export')}
          left={(props) => <List.Icon {...props} icon="export" />}
          onPress={handleExport}
        />
        <List.Item
          title={t('settings.dataManagement.reset')}
          left={(props) => <List.Icon {...props} icon="refresh" color="#B00020" />}
          titleStyle={{ color: '#B00020' }}
          onPress={() => setResetDialogVisible(true)}
        />
      </List.Section>

      <Divider />

      {/* About */}
      <List.Section>
        <List.Subheader>{t('settings.about.title')}</List.Subheader>
        <List.Item
          title={t('settings.about.version')}
          description={APP_VERSION}
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title={t('settings.about.github')}
          left={(props) => <List.Icon {...props} icon="github" />}
          onPress={() => Linking.openURL(GITHUB_URL)}
        />
      </List.Section>

      <ConfirmDialog
        visible={resetDialogVisible}
        message={t('settings.dataManagement.resetConfirm')}
        onConfirm={handleReset}
        onDismiss={() => setResetDialogVisible(false)}
        destructive
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontWeight: 'bold',
    padding: spacing.md,
  },
});
