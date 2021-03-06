import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Button, Input} from 'react-native-elements';
import {createUserWithEmailAndPassword, getAuth, updateProfile} from 'firebase/auth';

const auth = getAuth();

const SignUpScreen = ({ navigation }) => {
  const [value, setValue] = React.useState({
    displayName: '',
    email: '',
    password: '',
    error: ''
  });

  const signUp = () => {
    if (value.email === '' || value.password === '') {
      setValue({
        ...value,
        error: 'Email and password are mandatory.'
      });
      return;
    }

    try {
      createUserWithEmailAndPassword(auth, value.email, value.password)
        .then(() => {
          updateProfile(auth.currentUser, {
            displayName: value.displayName,
          });
        });

      /*console.log(auth.currentUser.email);
      console.log(auth.currentUser.displayName);*/

      navigation.navigate('Sign In');
    } catch (error) {
      setValue({
        ...value,
        error: error.message,
      })
    }
  };

  return (
    <View style={styles.container}>

      {!!value.error && <View style={styles.error}><Text>{value.error}</Text></View>}

      <View style={styles.controls}>
        <Input
          placeholder='Naam'
          containerStyle={styles.control}
          value={value.displayName}
          onChangeText={(text) => setValue({ ...value, displayName: text })}
          leftIcon={<Icon
            name='user'
            size={16}
          />}
        />

        <Input
          placeholder='Email'
          containerStyle={styles.control}
          value={value.email}
          onChangeText={(text) => setValue({ ...value, email: text })}
          leftIcon={<Icon
            name='envelope'
            size={16}
          />}
        />

        <Input
          placeholder='Wachtwoord'
          containerStyle={styles.control}
          value={value.password}
          onChangeText={(text) => setValue({ ...value, password: text })}
          secureTextEntry={true}
          leftIcon={<Icon
            name='key'
            size={16}
          />}
        />

        <Button title="Sign up" buttonStyle={styles.control} onPress={signUp} />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  controls: {
    flex: 1,
    width: '80%'
  },

  control: {
    marginTop: 10
  },

  error: {
    marginTop: 10,
    padding: 10,
    color: '#fff',
    backgroundColor: '#D54826FF',
  }
});

export default SignUpScreen;