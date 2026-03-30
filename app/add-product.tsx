import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, TextInput, Button, SegmentedButtons, useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useProductActions } from '../src/features/products/products.hooks';
import { Product, ProductCategory } from '../src/features/products/types';
import { CATEGORY_ORDER } from '../src/utils/categories';
import { spacing } from '../src/theme/spacing';
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

  const categoryOptions = CATEGORY_ORDER.map((cat) => ({
    value: cat,
    label: t(`categories.${cat}`).slice(0, 10) + '…',
  }));

  const handleSave = () => {
    if (!nameUk.trim()) return;

    if (customCount >= MAX_CUSTOM_PRODUCTS) {
      return;
    }

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text variant="headlineMedium" style={[styles.heading, { color: theme.colors.onBackground }]}>
        {t('addProduct.title')}
      </Text>

      <TextInput
        label={t('addProduct.nameUk')}
        value={nameUk}
        onChangeText={setNameUk}
        mode="outlined"
        style={styles.input}
      />

      <TextInput
        label={t('addProduct.nameEn')}
        value={nameEn}
        onChangeText={setNameEn}
        mode="outlined"
        style={styles.input}
      />

      <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
        {t('addProduct.category')}
      </Text>

      <View style={styles.categoryGrid}>
        {CATEGORY_ORDER.map((cat) => (
          <Button
            key={cat}
            mode={category === cat ? 'contained' : 'outlined'}
            onPress={() => setCategory(cat)}
            style={styles.catButton}
            compact
          >
            {t(`categories.${cat}`)}
          </Button>
        ))}
      </View>

      <TextInput
        label={t('addProduct.notes')}
        value={notes}
        onChangeText={setNotes}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleSave}
        disabled={!nameUk.trim()}
        style={styles.saveButton}
      >
        {t('addProduct.save')}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: spacing.lg,
  },
  input: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.sm,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  catButton: {
    marginBottom: spacing.xs,
  },
  saveButton: {
    marginTop: spacing.md,
  },
});
