import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import { CategoryPicker } from '../components/CategoryPicker';
import { PersonPicker } from '../components/PersonPicker';
import { theme } from '../constants/theme';

export const AddExpenseScreen = () => {
  const { addExpense } = useAppContext();
  const navigation = useNavigation();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Misc Expense');
  const [person, setPerson] = useState('Ghosia');
  const [note, setNote] = useState('');
  const [qty, setQty] = useState('');

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    try {
      await addExpense({
        date: new Date().toISOString(),
        category,
        person,
        amount: Number(amount),
        note,
        qty: qty ? Number(qty) : undefined,
      });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', 'Failed to save expense');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="0.00"
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <CategoryPicker selectedCategory={category} onSelect={setCategory} />
      
      <PersonPicker selectedPerson={person} onSelect={setPerson} />

      {(category.includes('Milk')) && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Quantity (Liters)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={qty}
            onChangeText={setQty}
            placeholder="3"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={note}
          onChangeText={setNote}
          placeholder="What was this for?"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Expense</Text>
      </TouchableOpacity>
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
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.l,
    marginTop: theme.spacing.xl,
  },
  inputGroup: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    alignItems: 'center',
    marginTop: theme.spacing.m,
  },
  saveButtonText: {
    color: '#fff',
    ...theme.typography.h3,
  }
});
