import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { theme } from '../constants/theme';
import { ExpenseCard } from '../components/ExpenseCard';
import { SummaryCard } from '../components/SummaryCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { isSameMonth } from 'date-fns';

export const HomeScreen = () => {
  const { state } = useAppContext();
  const navigation = useNavigation<any>();

  const currentMonthExpenses = state.expenses.filter(e => isSameMonth(new Date(e.date), new Date()));
  const totalExpenses = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const ghosiaTotal = currentMonthExpenses.filter(e => e.person === 'Ghosia').reduce((sum, e) => sum + e.amount, 0);
  const guddoTotal = currentMonthExpenses.filter(e => e.person === 'Guddo').reduce((sum, e) => sum + e.amount, 0);

  const recentExpenses = [...state.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Dashboard</Text>
      </View>

      <SummaryCard 
        title="Current Month Total" 
        amount={totalExpenses} 
        isPrimary 
      />

      <View style={styles.row}>
        <SummaryCard title="Ghosia" amount={ghosiaTotal} />
        <SummaryCard title="Guddo" amount={guddoTotal} />
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('AddExpense')}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.primary }]}>
            <MaterialCommunityIcons name="plus" size={24} color="#fff" />
          </View>
          <Text style={styles.actionText}>Expense</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('MilkTracker')}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.secondary }]}>
            <MaterialCommunityIcons name="cup-water" size={24} color="#fff" />
          </View>
          <Text style={styles.actionText}>Milk</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Summary')}>
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.success }]}>
            <MaterialCommunityIcons name="chart-pie" size={24} color="#fff" />
          </View>
          <Text style={styles.actionText}>Summary</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Recent Expenses</Text>
      {recentExpenses.map(expense => (
        <ExpenseCard key={expense.id} expense={expense} />
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  header: {
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.xl,
  },
  greeting: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: theme.spacing.l,
    padding: theme.spacing.m,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.m,
  },
  actionBtn: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.s,
  },
  actionText: {
    ...theme.typography.caption,
    color: theme.colors.text,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.m,
    marginTop: theme.spacing.m,
  }
});
