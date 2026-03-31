import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import {
  Text,
  Switch,
  TextInput,
  Button,
  Divider,
  Chip,
  useTheme,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useProductById, useProductActions } from '../../src/features/products/products.hooks';
import { RatingSelector } from '../../src/components/RatingSelector';
import { ConfirmDialog } from '../../src/components/ConfirmDialog';
import { formatDate } from '../../src/utils/date';
import { spacing } from '../../src/theme/spacing';
import { ProductRating } from '../../src/features/products/types';
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../src/utils/categories';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        <Text variant="bodyLarge">{t('errors.loadFailed')}</Text>
      </View>
    );
  }

  const lang = i18n.language;
  const name = lang === 'uk' ? product.nameUk : product.nameEn;
  const categoryColor = CATEGORY_COLORS[product.category];
  const categoryIcon = CATEGORY_ICONS[product.category];

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
        <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
          {name}
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          {product.nameUk !== name ? product.nameUk : product.nameEn}
        </Text>

        <View style={styles.chipRow}>
          <Chip
            icon={() => (
              <MaterialCommunityIcons
                name={categoryIcon as keyof typeof MaterialCommunityIcons.glyphMap}
                size={16}
                color={categoryColor}
              />
            )}
            style={{ backgroundColor: categoryColor + '20' }}
            textStyle={{ color: categoryColor }}
          >
            {t(`categories.${product.category}`)}
          </Chip>
          {product.isCustom && (
            <Chip icon="pencil" compact>
              Custom
            </Chip>
          )}
        </View>
      </View>

      <Divider />

      {/* Tried toggle */}
      <View style={styles.row}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {product.tried ? t('product.tried') : t('product.notTried')}
        </Text>
        <Switch
          value={product.tried}
          onValueChange={handleTriedToggle}
          color={theme.colors.primary}
        />
      </View>

      {product.tried && product.firstTriedDate && (
        <Text
          variant="bodySmall"
          style={[styles.dateText, { color: theme.colors.onSurfaceVariant }]}
        >
          {t('product.firstTried')}: {formatDate(product.firstTriedDate, lang)}
        </Text>
      )}

      {/* Favorite */}
      <View style={styles.row}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
          {t('product.favorite')}
        </Text>
        <Switch
          value={product.favorite}
          onValueChange={handleFavoriteToggle}
          color={theme.colors.primary}
        />
      </View>

      {/* Rating */}
      {product.tried && (
        <View style={styles.section}>
          <Text variant="labelLarge" style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>
            {t('product.rating.label')}
          </Text>
          <RatingSelector value={product.rating} onChange={handleRatingChange} />
        </View>
      )}

      <Divider />

      {/* Reaction notes */}
      <View style={styles.section}>
        <TextInput
          label={t('product.reactionNotes')}
          value={product.reactionNotes ?? ''}
          onChangeText={handleReactionNotesChange}
          multiline
          numberOfLines={3}
          mode="outlined"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <TextInput
          label={t('product.notes')}
          value={product.notes ?? ''}
          onChangeText={handleNotesChange}
          multiline
          numberOfLines={3}
          mode="outlined"
        />
      </View>

      {/* Delete (custom products only) */}
      {product.isCustom && (
        <Button
          mode="outlined"
          onPress={() => setDeleteDialogVisible(true)}
          style={styles.deleteButton}
          textColor="#B00020"
        >
          {t('product.delete')}
        </Button>
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
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  title: {
    fontWeight: 'bold',
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  dateText: {
    marginTop: -spacing.sm,
    marginBottom: spacing.sm,
  },
  section: {
    paddingVertical: spacing.sm,
  },
  label: {
    marginBottom: spacing.xs,
  },
  deleteButton: {
    marginTop: spacing.lg,
    borderColor: '#B00020',
  },
});
