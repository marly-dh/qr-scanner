import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Scanner from '../screens/Scanner';

const Stack = createStackNavigator();

export default function UserStack() {
  return (
      <Stack.Navigator>
        <Stack.Screen name="Scanner" component={Scanner} />
      </Stack.Navigator>
  );
}