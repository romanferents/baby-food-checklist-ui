import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ProgressBar, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { spacing } from '../theme/spacing';

interface ProgressHeaderProps {
  tried: number;
  total: number;
}

export function ProgressHeader({ tried, total }: ProgressHeaderProps): React.JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();
  const percentage = total > 0 ? tried / total : 0;
  const percentageDisplay = Math.round(percentage * 100);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}>
      <View style={styles.row}>
        <Text variant="titleMedium" style={{ color: theme.colors.onPrimaryContainer }}>
          {t('statistics.overallProgress')}
        </Text>
        <Text variant="titleLarge" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
          {percentageDisplay}%
        </Text>
      </View>

      <ProgressBar
        progress={percentage}
        color={theme.colors.primary}
        style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
      />

      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onPrimaryContainer, marginTop: spacing.xs }}
      >
        {tried} / {total} {t('statistics.totalTried').toLowerCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 12,
    margin: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
});
