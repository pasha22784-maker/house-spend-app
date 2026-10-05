import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>No expenses yet</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
