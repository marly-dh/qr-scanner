import React, {createContext, useState, useContext, useEffect} from 'react';
import {authService} from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

const AuthProvider = ({children}) => {
  // User data and loading variable will be stored here. If the api returns an error message for login it will also show here
  const [authData, setAuthData] = useState();

  // Will be set to false when I got the user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Every time the App is opened, this provider is rendered. And the loadStorageData function is called.
    loadStorageData();
  }, []);

  async function loadStorageData() { // gets user data and logs in user (if user has logged in before)
    try {
      // Try get the data from Async Storage
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        // If there is data, it's converted to an Object and the state is updated (witch logs in user)
        const _authData = JSON.parse(authDataSerialized);
        setAuthData(_authData);
      }
    } catch (error) {
    } finally {
      // loading finished
      setLoading(false);
    }
  }

  const signIn = async (email, password) => {
    const JWT = await authService.signIn(
      email,
      password,
    );

    // API call is made in authService.signIn using the passed down credentials
    const _authData = await authService.getUserData(
      email,
      JWT,
    );

    // setting the authData with the user data will automatically notify the app and switch to the userStack (see navigation/index.js)
    // if the api returns an error. We will also use authData to transfer the error to the SignIn component
    setAuthData({userToken: {token: "AA"}, user: _authData[0]});

    // store data in async storage so that the user will automatically log in next time
    ////AsyncStorage.setItem('@AuthData', JSON.stringify({user: _authData[0]}));
  };

  const signOut = async () => {
    // setting authData back to undefined will notify the app that no one is authorized
    setAuthData(undefined);

    // also remove user data from async storage
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    //This component will be used to encapsulate the whole App, so all components will have access to the Context (see App.js)
    <AuthContext.Provider value={{authData, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth will be used to initialize the context, so that we can access variables like authData or loading
function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export {AuthProvider, AuthContext, useAuth};