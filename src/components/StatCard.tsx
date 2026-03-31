import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing } from '../theme/spacing';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  color?: string;
}

export function StatCard({ label, value, icon, color }: StatCardProps): React.JSX.Element {
  const theme = useTheme();
  const iconColor = color ?? theme.colors.primary;

  return (
    <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
      <MaterialCommunityIcons
        name={icon as keyof typeof MaterialCommunityIcons.glyphMap}
        size={28}
        color={iconColor}
      />
      <Text variant="headlineSmall" style={[styles.value, { color: iconColor }]}>
        {value}
      </Text>
      <Text
        variant="bodySmall"
        style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Surface>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
    minWidth: 80,
  },
  value: {
    fontWeight: 'bold',
  },
});
