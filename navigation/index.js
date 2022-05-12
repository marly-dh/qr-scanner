import React from 'react';
import UserStack from './userStack';
import AuthStack from './authStack';
import {Text} from "react-native";
import {useAuth} from "../contexts/Auth";
import {NavigationContainer} from "@react-navigation/native";
import Status from "../components/Status";

export default function RootNavigation() {
  const {authData, loading} = useAuth(); // i get the userData and the loading values from the Auth context (see contexts/Auth)

  if (loading) {
    return <Status>Loading</Status>; // show loading while fetching data
  }

  // returns UserStack or AuthStack based on if you are logged in
  return (
    <NavigationContainer>
      {authData?.user ? <UserStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}