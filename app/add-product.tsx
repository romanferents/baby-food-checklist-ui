import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, TextInput } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProductActions } from '../src/features/products/products.hooks';
import { Product, ProductCategory } from '../src/features/products/types';
import { CATEGORY_ORDER, CATEGORY_META } from '../src/utils/categories';
import { MAX_CUSTOM_PRODUCTS } from '../src/constants';
import { useProductsStore } from '../src/features/products/products.store';

export default function AddProductScreen(): React.JSX.Element {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { addProduct } = useProductActions();
  const products = useProductsStore((s) => s.products);
  const customCount = products.filter((p) => p.isCustom).length;

  const [nameUk, setNameUk] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<ProductCategory>('vegetables');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!nameUk.trim()) return;
    if (customCount >= MAX_CUSTOM_PRODUCTS) return;

    const now = new Date().toISOString();
    const id = `custom_${Date.now()}`;

    const newProduct: Product = {
      id,
      nameUk: nameUk.trim(),
      nameEn: nameEn.trim() || nameUk.trim(),
      category,
      tried: false,
      favorite: false,
      isCustom: true,
      notes: notes.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    addProduct(newProduct);
    router.back();
  };

  const selectedMeta = CATEGORY_META[category];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.heading, { color: theme.colors.onBackground }]}>
          ✨ {t('addProduct.title')}
        </Text>
      </View>

      {/* Name inputs */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>🇺🇦 {t('addProduct.nameUk')}</Text>
        <TextInput
          placeholder={t('addProduct.nameUk')}
          placeholderTextColor="#9ca3af"
          value={nameUk}
          onChangeText={setNameUk}
          style={[
            styles.input,
            { backgroundColor: theme.colors.surface, color: theme.colors.onSurface },
          ]}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>🇬🇧 {t('addProduct.nameEn')}</Text>
        <TextInput
          placeholder={t('addProduct.nameEn')}
          placeholderTextColor="#9ca3af"
          value={nameEn}
          onChangeText={setNameEn}
          style={[
            styles.input,
            { backgroundColor: theme.colors.surface, color: theme.colors.onSurface },
          ]}
        />
      </View>

      {/* Category grid */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>📂 {t('addProduct.category')}</Text>
        <View style={styles.categoryGrid}>
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: isSelected ? meta.bgColor : theme.colors.surface,
                    borderColor: isSelected ? meta.color : '#e5e7eb',
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.7}
              >
                <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
                <Text
                  style={[styles.categoryText, { color: isSelected ? meta.color : '#6b7280' }]}
                  numberOfLines={1}
                >
                  {t(`categories.${cat}`)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>📝 {t('addProduct.notes')}</Text>
        <TextInput
          placeholder={t('addProduct.notes')}
          placeholderTextColor="#9ca3af"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: theme.colors.surface, color: theme.colors.onSurface },
          ]}
          textAlignVertical="top"
        />
      </View>

      {/* Save button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={!nameUk.trim()}
        activeOpacity={0.8}
        style={[styles.saveButtonOuter, !nameUk.trim() && { opacity: 0.5 }]}
      >
        <LinearGradient
          colors={['#ff8c69', '#ffb347']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.saveButton}
        >
          <MaterialCommunityIcons name="check" size={20} color="white" />
          <Text style={styles.saveButtonText}>{t('addProduct.save')}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '30%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    gap: 6,
  },
  categoryEmoji: {
    fontSize: 26,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButtonOuter: {
    marginTop: 8,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#ff8c69',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});
