import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface StatCardProps {
  label: string;
  value: number | string;
  emoji?: string;
  icon?: string;
  color?: string;
  bgColor?: string;
}

export function StatCard({
  label,
  value,
  emoji,
  color,
  bgColor,
}: StatCardProps): React.JSX.Element {
  return (
    <View style={[styles.card, { backgroundColor: bgColor ?? '#f8f9fa' }]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.value, { color: color ?? '#374151' }]}>{value}</Text>
      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    gap: 4,
    minWidth: 80,
  },
  emoji: {
    fontSize: 24,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
});
