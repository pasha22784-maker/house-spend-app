import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import { SyncButton } from '../components/SyncButton';
import { GoogleDriveService } from '../services/googleDrive';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SettingsScreen = () => {
  const { state, updateSettings } = useAppContext();
  const { settings } = state;

  const [milkPrice, setMilkPrice] = useState(settings.milkUnitPrice?.toString() || '44');
  const [subscription, setSubscription] = useState(settings.subscriptionFee?.toString() || '399');
  const [salary, setSalary] = useState(settings.totalSalary?.toString() || '60000');
  
  const [newPerson, setNewPerson] = useState('');
  const [syncTime, setSyncTime] = useState<string | null>(null);

  useEffect(() => {
    GoogleDriveService.getLastSyncTime().then(setSyncTime);
  }, []);

  const handleUpdateNumber = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    updateSettings({ [key]: num });
  };

  const handleAddPerson = () => {
    if (newPerson.trim() && !settings.persons.includes(newPerson.trim())) {
      updateSettings({ persons: [...settings.persons, newPerson.trim()] });
      setNewPerson('');
    }
  };

  const handleDeletePerson = (person: string) => {
    updateSettings({ persons: settings.persons.filter((p: string) => p !== person) });
  };

  const handleSync = async () => {
    const result = await GoogleDriveService.sync(state.expenses, settings);
    if (result.success) {
      setSyncTime(result.timestamp);
      Alert.alert('Success', 'Data synced with Google Drive');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleClearData = () => {
    Alert.alert('Clear Data', 'Are you sure you want to clear all data? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.clear();
        Alert.alert('Data Cleared', 'App data has been cleared. Please restart the app.');
      }}
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      
      <View style={styles.header}>
        <MaterialCommunityIcons name="cog" size={32} color={theme.colors.primary} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <Text style={styles.sectionTitle}>Expense Configuration</Text>
      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Milk Unit Price (Rs)</Text>
          <TextInput
            style={styles.input}
            value={milkPrice}
            onChangeText={(val) => { setMilkPrice(val); handleUpdateNumber('milkUnitPrice', val); }}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Subscription Fee (Rs)</Text>
          <TextInput
            style={styles.input}
            value={subscription}
            onChangeText={(val) => { setSubscription(val); handleUpdateNumber('subscriptionFee', val); }}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Total Salary (Rs)</Text>
          <TextInput
            style={styles.input}
            value={salary}
            onChangeText={(val) => { setSalary(val); handleUpdateNumber('totalSalary', val); }}
            keyboardType="numeric"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Persons</Text>
      <View style={styles.card}>
        {settings.persons.map((person: string) => (
          <View key={person} style={styles.personRow}>
            <Text style={styles.personName}>{person}</Text>
            <TouchableOpacity onPress={() => handleDeletePerson(person)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        ))}
        <View style={styles.addPersonRow}>
          <TextInput
            style={[styles.input, styles.flexInput]}
            value={newPerson}
            onChangeText={setNewPerson}
            placeholder="Add new person..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddPerson}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Google Drive Sync</Text>
      <View style={styles.card}>
        <View style={styles.syncRow}>
          <Text style={styles.syncLabel}>Enable Sync</Text>
          <Switch
            value={settings.googleDriveSyncEnabled}
            onValueChange={(val) => updateSettings({ googleDriveSyncEnabled: val })}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>
        {settings.googleDriveSyncEnabled && (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Spreadsheet ID</Text>
              <TextInput
                style={styles.input}
                value={settings.spreadsheetId || ''}
                onChangeText={(val) => updateSettings({ spreadsheetId: val })}
                placeholder="Google Sheet ID"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>
            <SyncButton onSync={handleSync} />
            {syncTime && <Text style={styles.syncTime}>Last synced: {new Date(syncTime).toLocaleString()}</Text>}
          </>
        )}
      </View>

      <Text style={styles.sectionTitle}>Data Management</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <MaterialCommunityIcons name="delete-alert" size={20} color={theme.colors.text} />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutText}>App Version: 1.0.0</Text>
        <Text style={styles.aboutText}>Developed for House Spend App</Text>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContent: { padding: theme.spacing.m, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.l },
  headerTitle: { ...theme.typography.h1, color: theme.colors.text, marginLeft: theme.spacing.s },
  sectionTitle: { ...theme.typography.h3, color: theme.colors.text, marginVertical: theme.spacing.s },
  card: { backgroundColor: theme.colors.card, padding: theme.spacing.m, borderRadius: theme.borderRadius.m, marginBottom: theme.spacing.l },
  inputRow: { marginBottom: theme.spacing.m },
  inputLabel: { color: theme.colors.textSecondary, marginBottom: theme.spacing.xs },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.text, padding: 12, borderRadius: theme.borderRadius.s, borderWidth: 1, borderColor: theme.colors.border },
  personRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, padding: 12, borderRadius: theme.borderRadius.s, marginBottom: 8 },
  personName: { color: theme.colors.text, fontSize: 16 },
  addPersonRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  flexInput: { flex: 1, marginRight: 8 },
  addButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: theme.borderRadius.s },
  addButtonText: { color: theme.colors.text, fontWeight: 'bold' },
  syncRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  syncLabel: { color: theme.colors.text, fontSize: 16 },
  syncTime: { color: theme.colors.textSecondary, fontSize: 12, marginTop: 8, textAlign: 'center' },
  dangerButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.error, padding: 12, borderRadius: theme.borderRadius.s },
  dangerButtonText: { color: theme.colors.text, fontWeight: 'bold', marginLeft: 8 },
  aboutSection: { alignItems: 'center', marginTop: theme.spacing.l },
  aboutText: { color: theme.colors.textSecondary, fontSize: 12, marginBottom: 4 }
});
