import React, {createContext, useState, useContext} from 'react';
import {authService} from '../services/authService';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  const [authData, setAuthData] = useState();

  //The loading part will be explained in the persist step session
  const [loading, setLoading] = useState(true);

  const signIn = async () => {
    //call the service passing credential (email and password).
    //In a real App this data will be provided by the user from some InputText components.
    const _authData = await authService.signIn(
      'marlydehaard@gmail.com',
      '12345678',
    );

    console.log(_authData);
    //Set the data in the context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(_authData);
  };

  const signOut = async () => {
    //Remove data from context, so the App can be notified
    //and send the user to the AuthStack
    setAuthData(undefined);
  };

  return (
    //This component will be used to encapsulate the whole App,
    //so all components will have access to the Context
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthProvider, AuthContext, useAuth};