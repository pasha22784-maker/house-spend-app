import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { isSameMonth } from 'date-fns';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { MonthPicker } from '../components/MonthPicker';
import { SummaryCard } from '../components/SummaryCard';
import { Expense } from '../types';

export const SummaryScreen = () => {
  const { state } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthExpenses = useMemo(() => {
    return state.expenses.filter((e: Expense) => isSameMonth(new Date(e.date), currentDate));
  }, [state.expenses, currentDate]);

  const monthInstallments = state.installments || [];
  const monthSchoolFees = state.schoolFees || [];
  const monthPolicies = state.policies || [];

  const { totalSalary, milkUnitPrice, subscriptionFee } = state.settings;

  const totals = useMemo(() => {
    let gMilkQty = 0, guMilkQty = 0;
    let groceries = 0;
    let miscGhosia = 0, miscGuddo = 0;

    monthExpenses.forEach((e: Expense) => {
      if (e.category === 'Milk - Ghosia') gMilkQty += (e.qty || 0);
      else if (e.category === 'Milk - Guddo') guMilkQty += (e.qty || 0);
      else if (e.category === 'Groceries') groceries += e.amount;
      else if (e.person === 'Ghosia') miscGhosia += e.amount;
      else if (e.person === 'Guddo') miscGuddo += e.amount;
    });

    const gMilkCost = (gMilkQty * milkUnitPrice) + (gMilkQty > 0 ? subscriptionFee / 2 : 0);
    const guMilkCost = (guMilkQty * milkUnitPrice) + (guMilkQty > 0 ? subscriptionFee / 2 : 0);

    const installmentsCost = monthInstallments.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const schoolFeesCost = monthSchoolFees.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const policiesCost = monthPolicies.reduce((acc: number, curr: any) => acc + curr.amount, 0);

    const totalExpensesGhosia = gMilkCost + miscGhosia + installmentsCost + schoolFeesCost + policiesCost;
    const totalExpensesGuddo = guMilkCost + miscGuddo;
    const totalExpenses = totalExpensesGhosia + totalExpensesGuddo + groceries;

    return {
      gMilkQty, guMilkQty, gMilkCost, guMilkCost, groceries, miscGhosia, miscGuddo,
      totalExpensesGhosia, totalExpensesGuddo, totalExpenses,
      transferToGhosia: totalSalary - totalExpensesGhosia
    };
  }, [monthExpenses, monthInstallments, monthSchoolFees, monthPolicies, totalSalary, milkUnitPrice, subscriptionFee]);

  const chartData = [
    { name: 'Ghosia', amount: totals.totalExpensesGhosia, color: theme.colors.primary, legendFontColor: theme.colors.text, legendFontSize: 12 },
    { name: 'Guddo', amount: totals.totalExpensesGuddo, color: theme.colors.secondary, legendFontColor: theme.colors.text, legendFontSize: 12 },
    { name: 'Groceries', amount: totals.groceries, color: theme.colors.success, legendFontColor: theme.colors.text, legendFontSize: 12 },
  ].filter(item => item.amount > 0);

  return (
    <View style={styles.container}>
      <MonthPicker selectedDate={currentDate} onDateChange={setCurrentDate} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Overview</Text>
        <SummaryCard title="Total Salary" amount={totalSalary} isPrimary={true} />
        <SummaryCard title="Total Expenses" amount={totals.totalExpenses} />
        <SummaryCard title="Transfer to Ghosia" amount={totals.transferToGhosia} />

        <Text style={styles.sectionTitle}>Expense Breakdown</Text>
        {chartData.length > 0 ? (
          <PieChart
            data={chartData}
            width={340}
            height={200}
            chartConfig={{ color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})` }}
            accessor={"amount"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        ) : (
          <Text style={styles.emptyText}>No expenses this month</Text>
        )}

        <Text style={styles.sectionTitle}>Milk Summary</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Milk Unit Price: Rs {milkUnitPrice}</Text>
          <Text style={styles.cardText}>Subscription Fee: Rs {subscriptionFee}</Text>
          <View style={styles.divider} />
          <Text style={styles.cardText}>Total Milk Ghosia: {totals.gMilkQty} L (Rs {totals.gMilkCost})</Text>
          <Text style={styles.cardText}>Total Milk Guddo: {totals.guMilkQty} L (Rs {totals.guMilkCost})</Text>
        </View>

        <Text style={styles.sectionTitle}>Other Expenses</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>Total Groceries: Rs {totals.groceries}</Text>
          <Text style={styles.cardText}>Misc Expenses Ghosia: Rs {totals.miscGhosia}</Text>
          <Text style={styles.cardText}>Misc Expenses Guddo: Rs {totals.miscGuddo}</Text>
        </View>

        <Text style={styles.sectionTitle}>Installments</Text>
        {monthInstallments.length > 0 ? monthInstallments.map((i: any) => (
          <View key={i.id} style={styles.card}>
            <Text style={styles.cardTitle}>{i.itemName}</Text>
            <Text style={styles.cardText}>Amount: Rs {i.amount} ({i.currentInstallment}/{i.totalInstallments})</Text>
          </View>
        )) : <Text style={styles.emptyText}>No installments</Text>}

        <Text style={styles.sectionTitle}>School Fees</Text>
        {monthSchoolFees.length > 0 ? monthSchoolFees.map((s: any) => (
          <View key={s.id} style={styles.card}>
            <Text style={styles.cardTitle}>{s.monthTerm}</Text>
            <Text style={styles.cardText}>Amount: Rs {s.amount} - {s.status}</Text>
          </View>
        )) : <Text style={styles.emptyText}>No school fees</Text>}

        <Text style={styles.sectionTitle}>Policies</Text>
        {monthPolicies.length > 0 ? monthPolicies.map((p: any) => (
          <View key={p.id} style={styles.card}>
            <Text style={styles.cardTitle}>{p.policyName}</Text>
            <Text style={styles.cardText}>Premium: Rs {p.amount} - {p.status}</Text>
          </View>
        )) : <Text style={styles.emptyText}>No policies</Text>}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.m, paddingBottom: 40 },
  sectionTitle: { ...theme.typography.h2, color: theme.colors.text, marginVertical: theme.spacing.m },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.s },
  cardTitle: { ...theme.typography.h3, color: theme.colors.text, marginBottom: theme.spacing.xs },
  cardText: { color: theme.colors.textSecondary, fontSize: 14, marginVertical: 2 },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 8 },
  emptyText: { color: theme.colors.textSecondary, fontStyle: 'italic', marginBottom: theme.spacing.m }
});
