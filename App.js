import React from 'react';
import {AuthProvider} from './contexts/Auth';
import RootNavigation from './navigation';


export default function App() {
  // AuthProvider encapsulates all content so that it's variables can be accessed everywhere
  return (
    <AuthProvider>
      <RootNavigation />
    </AuthProvider>
  );
}

