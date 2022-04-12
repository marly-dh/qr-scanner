import React from 'react';
import { useAuthentication } from '../hooks/useAuthentication';
import UserStack from './userStack';
import AuthStack from './authStack';
import {Text} from "react-native";
import {useAuth} from "../contexts/Auth";
import {NavigationContainer} from "@react-navigation/native";

export default function RootNavigation() {
  const {authData, loading} = useAuth();

  /*if (loading) {
    //You can see the component implementation at the repository
    return <Text>Loading....</Text>;
  }*/

  return (
    <NavigationContainer>
      {authData?.user ? <UserStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}