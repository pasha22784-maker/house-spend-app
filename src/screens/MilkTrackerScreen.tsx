import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, getDaysInMonth, startOfMonth, addDays, isSameMonth } from 'date-fns';
import { theme } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { MonthPicker } from '../components/MonthPicker';
import { Expense } from '../types';

export const MilkTrackerScreen = () => {
  const { state, addExpense } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  
  const [ghosiaQty, setGhosiaQty] = useState('3');
  const [guddoQty, setGuddoQty] = useState('3');

  const daysInMonth = getDaysInMonth(currentDate);
  const startDay = startOfMonth(currentDate);
  
  const days = Array.from({ length: daysInMonth }).map((_, i) => addDays(startDay, i));

  const monthExpenses = useMemo(() => {
    return state.expenses.filter((e: Expense) => isSameMonth(new Date(e.date), currentDate));
  }, [state.expenses, currentDate]);

  const getMilkData = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const ghosia = monthExpenses.find((e: Expense) => e.date === dateStr && e.category === 'Milk - Ghosia');
    const guddo = monthExpenses.find((e: Expense) => e.date === dateStr && e.category === 'Milk - Guddo');
    
    const isCustom = !!(ghosia || guddo);
    const gQty = isCustom ? (ghosia?.qty || 0) : 3;
    const guQty = isCustom ? (guddo?.qty || 0) : 3;

    return {
      ghosia: gQty,
      guddo: guQty,
      hasEntry: true,
      isCustom
    };
  };

  const handleDayPress = (date: Date) => {
    const data = getMilkData(date);
    setGhosiaQty(data.ghosia.toString());
    setGuddoQty(data.guddo.toString());
    setSelectedDay(date);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!selectedDay) return;
    
    const dateStr = format(selectedDay, 'yyyy-MM-dd');
    const gQty = parseFloat(ghosiaQty) || 0;
    const guQty = parseFloat(guddoQty) || 0;
    const unitPrice = state.settings.milkUnitPrice;
    
    if (gQty > 0) {
      addExpense({
        date: dateStr,
        category: 'Milk - Ghosia',
        person: 'Ghosia',
        qty: gQty,
        amount: gQty * unitPrice,
        note: 'Milk entry'
      });
    }
    
    if (guQty > 0) {
      addExpense({
        date: dateStr,
        category: 'Milk - Guddo',
        person: 'Guddo',
        qty: guQty,
        amount: guQty * unitPrice,
        note: 'Milk entry'
      });
    }
    
    setModalVisible(false);
  };

  const totals = useMemo(() => {
    let gQty = 0, guQty = 0;
    monthExpenses.forEach((e: Expense) => {
      if (e.category === 'Milk - Ghosia') gQty += (e.qty || 0);
      if (e.category === 'Milk - Guddo') guQty += (e.qty || 0);
    });
    
    const unitPrice = state.settings.milkUnitPrice;
    const sub = state.settings.subscriptionFee;
    
    return {
      gQty,
      guQty,
      gCost: (gQty * unitPrice) + (gQty > 0 ? sub / 2 : 0),
      guCost: (guQty * unitPrice) + (guQty > 0 ? sub / 2 : 0)
    };
  }, [monthExpenses, state.settings]);

  return (
    <View style={styles.container}>
      <MonthPicker selectedDate={currentDate} onDateChange={setCurrentDate} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {days.map((day, i) => {
            const data = getMilkData(day);
            return (
              <TouchableOpacity 
                key={i} 
                style={[styles.dayCell, data.hasEntry && styles.dayCellActive]}
                onPress={() => handleDayPress(day)}
              >
                <Text style={styles.dayText}>{format(day, 'd')}</Text>
                {data.hasEntry && (
                  <View style={styles.qtyContainer}>
                    <Text style={styles.qtyTextGhosia}>{data.ghosia}L</Text>
                    <Text style={styles.qtyTextGuddo}>{data.guddo}L</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Month Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ghosia Total Qty:</Text>
            <Text style={styles.summaryValue}>{totals.gQty} L</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ghosia Cost:</Text>
            <Text style={styles.summaryValue}>Rs {totals.gCost}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guddo Total Qty:</Text>
            <Text style={styles.summaryValue}>{totals.guQty} L</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Guddo Cost:</Text>
            <Text style={styles.summaryValue}>Rs {totals.guCost}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Milk Entry for {selectedDay ? format(selectedDay, 'dd MMM') : ''}</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ghosia Qty (L)</Text>
              <TextInput
                style={styles.input}
                value={ghosiaQty}
                onChangeText={setGhosiaQty}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Guddo Qty (L)</Text>
              <TextInput
                style={styles.input}
                value={guddoQty}
                onChangeText={setGuddoQty}
                keyboardType="numeric"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.m },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dayCell: { 
    width: '13%', 
    aspectRatio: 1, 
    backgroundColor: theme.colors.surface, 
    marginVertical: 4, 
    borderRadius: theme.borderRadius.s,
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border
  },
  dayCellActive: { borderColor: theme.colors.success, backgroundColor: '#00C85320' },
  dayText: { color: theme.colors.text, fontSize: 12, fontWeight: 'bold' },
  qtyContainer: { marginTop: 2, alignItems: 'center' },
  qtyTextGhosia: { color: theme.colors.primary, fontSize: 10, fontWeight: 'bold' },
  qtyTextGuddo: { color: theme.colors.secondary, fontSize: 10, fontWeight: 'bold' },
  summaryContainer: { marginTop: 24, backgroundColor: theme.colors.card, padding: 16, borderRadius: theme.borderRadius.m },
  summaryTitle: { ...theme.typography.h3, color: theme.colors.text, marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: theme.colors.textSecondary, fontSize: 14 },
  summaryValue: { color: theme.colors.text, fontSize: 14, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: theme.colors.surface, padding: 20, borderRadius: theme.borderRadius.m },
  modalTitle: { ...theme.typography.h3, color: theme.colors.text, marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { color: theme.colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: theme.colors.background, color: theme.colors.text, padding: 12, borderRadius: theme.borderRadius.s, borderWidth: 1, borderColor: theme.colors.border },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  cancelButton: { padding: 12, marginRight: 12 },
  saveButton: { backgroundColor: theme.colors.primary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: theme.borderRadius.s },
  buttonText: { color: theme.colors.text, fontWeight: 'bold' }
});
