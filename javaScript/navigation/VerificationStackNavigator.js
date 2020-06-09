import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginPage from '../view/authView/LoginPage';

const Stack = createStackNavigator();

export default function VerificationStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="LoginPage" component={LoginPage} />
    </Stack.Navigator>
  );
}
