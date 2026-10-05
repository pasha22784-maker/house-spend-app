import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface SummaryCardProps {
  title: string;
  amount: number | string;
  subtitle?: string;
  isPrimary?: boolean;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, subtitle, isPrimary }) => {
  return (
    <LinearGradient
      colors={isPrimary ? [theme.colors.primary, '#4b43c6'] : [theme.colors.card, theme.colors.surface]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>
        {typeof amount === 'number' ? `₹${amount.toFixed(2)}` : amount}
      </Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  amount: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
