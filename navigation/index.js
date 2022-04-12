import React from 'react';
import UserStack from './userStack';
import AuthStack from './authStack';
import {Text} from "react-native";
import {useAuth} from "../contexts/Auth";
import {NavigationContainer} from "@react-navigation/native";

export default function RootNavigation() {
  const {authData, loading} = useAuth();

  if (loading) {
    return <Text>Loading....</Text>; // show loading while fetching data
  }

  // returns UserStack or AuthStack based on if you are logged in
  return (
    <NavigationContainer>
      {authData?.user ? <UserStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}