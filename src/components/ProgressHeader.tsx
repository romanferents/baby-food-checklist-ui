import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import Svg, { Circle } from 'react-native-svg';
import { spacing } from '../theme/spacing';

interface ProgressHeaderProps {
  tried: number;
  total: number;
}

export function ProgressHeader({ tried, total }: ProgressHeaderProps): React.JSX.Element {
  const { t } = useTranslation();
  const percentage = total > 0 ? tried / total : 0;
  const percentageDisplay = Math.round(percentage * 100);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <LinearGradient
      colors={['#ff8c69', '#ffb347', '#ffd166']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>🍼 {t('products.title')}</Text>
          <Text style={styles.subtitle}>{t('statistics.overallProgress')}</Text>
        </View>
      </View>

      <View style={styles.progressRow}>
        {/* Circle */}
        <View style={styles.circleContainer}>
          <Svg width={72} height={72} viewBox="0 0 72 72">
            <Circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={6}
            />
            <Circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeDashoffset}
              rotation="-90"
              origin="36, 36"
            />
          </Svg>
          <View style={styles.circleLabel}>
            <Text style={styles.circlePct}>{percentageDisplay}%</Text>
          </View>
        </View>

        {/* Numbers */}
        <View style={styles.numbersContainer}>
          <Text style={styles.triedCount}>
            {tried}
            <Text style={styles.ofTotal}> {t('statistics.of') ?? 'of'} {total}</Text>
          </Text>
          <Text style={styles.triedLabel}>{t('statistics.totalTried').toLowerCase()}</Text>
          {/* Progress bar */}
          <View style={styles.barTrack}>
            <View style={[styles.barFill, { width: `${percentageDisplay}%` }]} />
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circleContainer: {
    width: 72,
    height: 72,
    position: 'relative',
  },
  circleLabel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlePct: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  numbersContainer: {
    flex: 1,
  },
  triedCount: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    lineHeight: 36,
  },
  ofTotal: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
  },
  triedLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  barTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
});
