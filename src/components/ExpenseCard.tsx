import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Expense } from '../types';
import { theme } from '../constants/theme';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ExpenseCardProps {
  expense: Expense;
  onPress?: () => void;
  onDelete?: () => void;
}

export const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onPress, onDelete }) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <LinearGradient
        colors={[theme.colors.card, theme.colors.surface]}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.category}>{expense.category}</Text>
          <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.date}>{format(new Date(expense.date), 'MMM dd, yyyy')}</Text>
          <View style={styles.personBadge}>
            <Text style={styles.personText}>{expense.person}</Text>
          </View>
        </View>
        {(expense.qty || expense.note) && (
          <View style={styles.footer}>
            {expense.qty && <Text style={styles.qty}>Qty: {expense.qty}</Text>}
            {expense.note && <Text style={styles.note}>{expense.note}</Text>}
          </View>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <MaterialCommunityIcons name="delete" size={20} color={theme.colors.danger} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.m,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  category: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  amount: {
    ...theme.typography.h3,
    color: theme.colors.secondary,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  personBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.s,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.round,
  },
  personText: {
    ...theme.typography.caption,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: theme.spacing.s,
    paddingTop: theme.spacing.s,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  qty: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  note: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing.m,
    right: theme.spacing.xl, // In case we want to show it alongside amount, we'd adjust layout. Here it's a bit clunky overlapping, so let's rethink or just show it if provided.
  }
});
