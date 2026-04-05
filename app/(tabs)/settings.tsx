import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProductsStore } from '../../src/features/products/products.store';
import { useProductActions } from '../../src/features/products/products.hooks';
import { useAuth, useLogout } from '../../src/features/auth/auth.hooks';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { exportToJSON, shareFile } from '../../src/services/backup';
import { APP_VERSION, GITHUB_URL, STORAGE_KEYS } from '../../src/constants';
import { i18n } from '../../src/i18n';
import * as Linking from 'expo-linking';

export default function SettingsScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const products = useProductsStore((s) => s.products);
  const babyInfo = useProductsStore((s) => s.babyInfo);
  const setBabyInfo = useProductsStore((s) => s.setBabyInfo);
  const { resetAllProgress } = useProductActions();
  const { user } = useAuth();
  const logout = useLogout();
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);

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
      {/* Gradient Header */}
      <LinearGradient
        colors={['#c471ed', '#f64f59']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>⚙️ {t('settings.title')}</Text>
        <Text style={styles.headerSubtitle}>{t('settings.about.title')}</Text>
      </LinearGradient>

      {/* Baby Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>👶 {t('settings.babyInfo.title')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{t('settings.babyInfo.name')}</Text>
            <TextInput
              placeholder={t('settings.babyInfo.namePlaceholder')}
              placeholderTextColor="#9ca3af"
              value={babyInfo.name}
              onChangeText={(text) => setBabyInfo({ name: text })}
              style={[
                styles.textInput,
                { color: theme.colors.onSurface, backgroundColor: '#f9fafb' },
              ]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{t('settings.babyInfo.birthDate')}</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              value={babyInfo.birthDate}
              onChangeText={(text) => setBabyInfo({ birthDate: text })}
              style={[
                styles.textInput,
                { color: theme.colors.onSurface, backgroundColor: '#f9fafb' },
              ]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{t('settings.babyInfo.complementaryStart')}</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              value={babyInfo.complementaryStart}
              onChangeText={(text) => setBabyInfo({ complementaryStart: text })}
              style={[
                styles.textInput,
                { color: theme.colors.onSurface, backgroundColor: '#f9fafb' },
              ]}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>{t('settings.babyInfo.weight')}</Text>
            <TextInput
              placeholder={t('settings.babyInfo.weightPlaceholder')}
              placeholderTextColor="#9ca3af"
              value={babyInfo.weight}
              onChangeText={(text) => setBabyInfo({ weight: text })}
              keyboardType="numeric"
              style={[
                styles.textInput,
                { color: theme.colors.onSurface, backgroundColor: '#f9fafb' },
              ]}
            />
          </View>

          {/* Baby info preview card */}
          {babyInfo.name || babyInfo.complementaryStart ? (
            <>
              <View style={styles.divider} />
              <View style={styles.babyPreview}>
                <Text style={styles.babyPreviewEmoji}>👶</Text>
                <View style={styles.babyPreviewInfo}>
                  {babyInfo.name ? (
                    <Text style={styles.babyPreviewName}>{babyInfo.name}</Text>
                  ) : null}
                  {babyInfo.complementaryStart ? (
                    <Text style={styles.babyPreviewDetail}>
                      🍽 {t('settings.babyInfo.complementaryStart')}: {babyInfo.complementaryStart}
                    </Text>
                  ) : null}
                  {babyInfo.weight ? (
                    <Text style={styles.babyPreviewDetail}>⚖️ {babyInfo.weight} кг</Text>
                  ) : null}
                </View>
              </View>
            </>
          ) : null}
        </View>
      </View>

      {/* Language */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>🌐 {t('settings.language')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleLanguageToggle}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.flagEmoji}>{isUkrainian ? '🇺🇦' : '🇺🇸'}</Text>
              <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                {isUkrainian ? 'Українська' : 'English'}
              </Text>
            </View>
            <Switch
              value={isUkrainian}
              onValueChange={handleLanguageToggle}
              trackColor={{ false: '#e5e7eb', true: '#c471ed' }}
              thumbColor={isUkrainian ? '#f64f59' : '#f3f4f6'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>💾 {t('settings.dataManagement.title')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity style={styles.settingRow} onPress={handleExport} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Text style={styles.actionEmoji}>📤</Text>
              <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                {t('settings.dataManagement.export')}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>ℹ️ {t('settings.about.title')}</Text>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.actionEmoji}>📱</Text>
              <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                {t('settings.about.version')}
              </Text>
            </View>
            <Text style={styles.versionText}>{APP_VERSION}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => Linking.openURL(GITHUB_URL)}
            activeOpacity={0.7}
          >
            <View style={styles.settingLeft}>
              <Text style={styles.actionEmoji}>🔗</Text>
              <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                {t('settings.about.github')}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      {/* User Info */}
      {user ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>👤 {t('auth.userInfo')}</Text>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.actionEmoji}>🧑</Text>
                <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                  {user.username}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Text style={styles.actionEmoji}>📧</Text>
                <Text style={[styles.settingText, { color: theme.colors.onSurface }]}>
                  {user.email}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}

      {/* Danger Zone */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: '#dc2626' }]}>⚠️ Danger Zone</Text>
        <TouchableOpacity
          style={[styles.dangerButton, { marginBottom: 12 }]}
          onPress={() => setLogoutDialogVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="logout" size={20} color="#dc2626" />
          <Text style={styles.dangerButtonText}>{t('auth.logout')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dangerButton]}
          onPress={() => setResetDialogVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="refresh" size={20} color="#dc2626" />
          <Text style={styles.dangerButtonText}>{t('settings.dataManagement.reset')}</Text>
        </TouchableOpacity>
      </View>

      <ConfirmDialog
        visible={logoutDialogVisible}
        message={t('auth.logoutConfirm')}
        onConfirm={() => {
          logout();
          setLogoutDialogVisible(false);
        }}
        onDismiss={() => setLogoutDialogVisible(false)}
        destructive
      />

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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flagEmoji: {
    fontSize: 22,
  },
  actionEmoji: {
    fontSize: 18,
  },
  settingText: {
    fontSize: 15,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
  },
  inputRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 6,
  },
  textInput: {
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  babyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    backgroundColor: '#fef9e7',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
  },
  babyPreviewEmoji: {
    fontSize: 32,
  },
  babyPreviewInfo: {
    flex: 1,
  },
  babyPreviewName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  babyPreviewDetail: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
});
