import React from 'react';
import { useAuthentication } from '../hooks/useAuthentication';
import UserStack from './userStack';
import AuthStack from './authStack';
import {Text} from "react-native";
import {useAuth} from "../contexts/Auth";

export default function RootNavigation() {
  const {authData, loading} = useAuth();

  /*if (loading) {
    //You can see the component implementation at the repository
    return <Text>Loading....</Text>;
  }*/

  return authData?.user ? <UserStack /> : <AuthStack />;
}