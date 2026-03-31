import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useProductById, useProductActions } from '../../src/features/products/products.hooks';
import { RatingSelector } from '../../src/components/RatingSelector';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { formatDate } from '../../src/utils/date';
import { ProductRating } from '../../src/features/products/types';
import { CATEGORY_META } from '../../src/utils/categories';

export default function ProductDetailScreen(): React.JSX.Element {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const product = useProductById(id);
  const { updateProduct, deleteProduct } = useProductActions();
  const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontSize: 16 }}>{t('errors.loadFailed')}</Text>
      </View>
    );
  }

  const lang = i18n.language;
  const name = lang === 'uk' ? product.nameUk : product.nameEn;
  const altName = lang === 'uk' ? product.nameEn : product.nameUk;
  const meta = CATEGORY_META[product.category];

  const handleTriedToggle = () => {
    if (!product.tried) {
      updateProduct(product.id, {
        tried: true,
        firstTriedDate: new Date().toISOString(),
      });
    } else {
      updateProduct(product.id, {
        tried: false,
        firstTriedDate: undefined,
        rating: undefined,
      });
    }
  };

  const handleRatingChange = (rating: ProductRating | undefined) => {
    updateProduct(product.id, { rating });
  };

  const handleFavoriteToggle = () => {
    updateProduct(product.id, { favorite: !product.favorite });
  };

  const handleNotesChange = (text: string) => {
    updateProduct(product.id, { notes: text || undefined });
  };

  const handleReactionNotesChange = (text: string) => {
    updateProduct(product.id, { reactionNotes: text || undefined });
  };

  const handleDelete = () => {
    deleteProduct(product.id);
    router.back();
  };

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
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>{name}</Text>
          <Text style={styles.altName}>{altName}</Text>
        </View>
        <TouchableOpacity onPress={handleFavoriteToggle} style={styles.favoriteButton}>
          <MaterialCommunityIcons
            name={product.favorite ? 'heart' : 'heart-outline'}
            size={24}
            color={product.favorite ? '#e74c3c' : '#d1d5db'}
          />
        </TouchableOpacity>
      </View>

      {/* Category badge */}
      <View style={[styles.categoryBadge, { backgroundColor: meta.bgColor, borderColor: meta.borderColor }]}>
        <Text style={styles.categoryEmoji}>{meta.emoji}</Text>
        <Text style={[styles.categoryName, { color: meta.color }]}>
          {t(`categories.${product.category}`)}
        </Text>
        {product.isCustom && (
          <View style={styles.customTag}>
            <Text style={styles.customTagText}>✨ Custom</Text>
          </View>
        )}
      </View>

      {/* Tried toggle card */}
      <TouchableOpacity
        style={[
          styles.triedCard,
          {
            backgroundColor: product.tried ? '#dcfce7' : theme.colors.surface,
            borderColor: product.tried ? '#86efac' : '#e5e7eb',
          },
        ]}
        onPress={handleTriedToggle}
        activeOpacity={0.7}
      >
        <View style={styles.triedLeft}>
          <Text style={styles.triedEmoji}>{product.tried ? '✅' : '⬜'}</Text>
          <View>
            <Text style={[styles.triedText, { color: product.tried ? '#16a34a' : '#6b7280' }]}>
              {product.tried ? t('product.tried') : t('product.notTried')}
            </Text>
            {product.tried && product.firstTriedDate && (
              <Text style={styles.triedDate}>
                📅 {formatDate(product.firstTriedDate, lang)}
              </Text>
            )}
          </View>
        </View>
        <Switch
          value={product.tried}
          onValueChange={handleTriedToggle}
          trackColor={{ false: '#e5e7eb', true: '#86efac' }}
          thumbColor={product.tried ? '#16a34a' : '#f3f4f6'}
        />
      </TouchableOpacity>

      {/* Rating */}
      {product.tried && (
        <>
          {/* First tried date */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>📅 {t('product.firstTried')}</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#9ca3af"
              value={product.firstTriedDate ? product.firstTriedDate.split('T')[0] : ''}
              onChangeText={(text) => {
                updateProduct(product.id, { firstTriedDate: text ? new Date(text).toISOString() : undefined });
              }}
              style={[styles.dateInput, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]}
            />
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>🌟 {t('product.rating.label')}</Text>
            <RatingSelector value={product.rating} onChange={handleRatingChange} />
          </View>
        </>
      )}

      {/* Reaction notes */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>⚠️ {t('product.reactionNotes')}</Text>
        <TextInput
          placeholder={t('product.reactionNotes')}
          placeholderTextColor="#9ca3af"
          value={product.reactionNotes ?? ''}
          onChangeText={handleReactionNotesChange}
          multiline
          numberOfLines={3}
          style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]}
          textAlignVertical="top"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>📝 {t('product.notes')}</Text>
        <TextInput
          placeholder={t('product.notes')}
          placeholderTextColor="#9ca3af"
          value={product.notes ?? ''}
          onChangeText={handleNotesChange}
          multiline
          numberOfLines={3}
          style={[styles.textArea, { backgroundColor: theme.colors.surface, color: theme.colors.onSurface }]}
          textAlignVertical="top"
        />
      </View>

      {/* Delete (custom products) */}
      {product.isCustom && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setDeleteDialogVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="trash-can-outline" size={18} color="#dc2626" />
          <Text style={styles.deleteText}>{t('product.delete')}</Text>
        </TouchableOpacity>
      )}

      <ConfirmDialog
        visible={deleteDialogVisible}
        message={t('product.deleteConfirm')}
        onConfirm={handleDelete}
        onDismiss={() => setDeleteDialogVisible(false)}
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
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  altName: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  favoriteButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fef2f2',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    marginBottom: 16,
  },
  categoryEmoji: {
    fontSize: 18,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  customTag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  customTagText: {
    fontSize: 11,
    color: '#4338ca',
    fontWeight: '600',
  },
  triedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 16,
  },
  triedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  triedEmoji: {
    fontSize: 24,
  },
  triedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  triedDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  textArea: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    minHeight: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dateInput: {
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
    marginTop: 8,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#dc2626',
  },
});
