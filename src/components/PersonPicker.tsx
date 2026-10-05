import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { PERSONS } from '../constants/categories';

interface PersonPickerProps {
  selectedPerson: string;
  onSelect: (person: string) => void;
}

export const PersonPicker: React.FC<PersonPickerProps> = ({ selectedPerson, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Person</Text>
      <View style={styles.row}>
        {PERSONS.map(person => (
          <TouchableOpacity
            key={person}
            style={[styles.pill, selectedPerson === person && styles.pillSelected]}
            onPress={() => onSelect(person)}
          >
            <Text style={[styles.pillText, selectedPerson === person && styles.pillTextSelected]}>
              {person}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.m,
  },
  label: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.s,
  },
  row: {
    flexDirection: 'row',
  },
  pill: {
    flex: 1,
    paddingVertical: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  pillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  pillText: {
    color: theme.colors.text,
  },
  pillTextSelected: {
    fontWeight: 'bold',
  }
});
