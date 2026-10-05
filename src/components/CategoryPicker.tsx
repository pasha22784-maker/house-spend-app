import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../constants/theme';
import { CATEGORIES } from '../constants/categories';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelect: (cat: string) => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({ selectedCategory, onSelect }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, selectedCategory === cat && styles.pillSelected]}
            onPress={() => onSelect(cat)}
          >
            <Text style={[styles.pillText, selectedCategory === cat && styles.pillTextSelected]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  pill: {
    paddingHorizontal: theme.spacing.m,
    paddingVertical: theme.spacing.s,
    borderRadius: theme.borderRadius.round,
    backgroundColor: theme.colors.surface,
    marginRight: theme.spacing.s,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
