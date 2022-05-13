import React from 'react';
import UserStack from './userStack';
import AuthStack from './authStack';
import {useAuth} from "../contexts/Auth";
import {NavigationContainer} from "@react-navigation/native";
import Status from "../components/Status";

export default function RootNavigation() {
  const {authData, loading} = useAuth(); // get the userData and the loading values from the Auth context (see contexts/Auth)

  if (loading) {
    return <Status loading={true}>Loading</Status>; // show loading while fetching data
  }

  // returns UserStack or AuthStack based on if user is logged in
  return (
    <NavigationContainer>
      {authData?.user ? <UserStack/> : <AuthStack/>}
    </NavigationContainer>
  );
}