import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { ExpenseCard } from '../components/ExpenseCard';
import { theme } from '../constants/theme';

export const ExpensesListScreen = () => {
  const { state, deleteExpense } = useAppContext();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Expenses</Text>
      <FlatList
        data={[...state.expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ExpenseCard 
            expense={item} 
            onDelete={() => deleteExpense(item.id)} 
          />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.m,
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.xl,
  },
});
