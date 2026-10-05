import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

import { HomeScreen } from '../screens/HomeScreen';
import { AddExpenseScreen } from '../screens/AddExpenseScreen';
import { ExpensesListScreen } from '../screens/ExpensesListScreen';
import { MilkTrackerScreen } from '../screens/MilkTrackerScreen';
import { SummaryScreen } from '../screens/SummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Expenses" 
        component={ExpensesListScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="format-list-bulleted" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Summary" 
        component={SummaryScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="chart-pie" size={24} color={color} />
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cog" size={24} color={color} />
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
        <Stack.Screen name="MilkTracker" component={MilkTrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
