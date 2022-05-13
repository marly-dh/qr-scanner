import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SignInScreen from '../screens/SignIn';

const Stack = createStackNavigator();

export default function AuthStack() {
  // this navigator simply just refers to the SignIn screen
  return (
      <Stack.Navigator>
        <Stack.Screen name="Welkom" component={SignInScreen} />
      </Stack.Navigator>
  );
}