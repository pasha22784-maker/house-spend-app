import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const MonthPicker = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: 'white'}}>MonthPicker Component</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  }
});
