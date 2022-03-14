import { getDatabase, ref, onValue} from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"
import * as Location from 'expo-location';


const ScannerScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [location, setLocation] = useState(null);

  const auth = getAuth();
  const d = firebase.firestore.Timestamp.fromDate(new Date()).toDate();

  const checkOut = (ref, user) => {
    updateDoc(ref, {
      [user.displayName + '.checkOut']: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
    });
    setRefresh(true);
  };


  const checkIn = (ref, locationQR, user) => {
    console.log('started')

    /*setDoc(ref, {
      [user.displayName]: {
        checkIn: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
        checkOut: "",
        account: user.email,
        location: locationQR
      }
    });*/

    fetch('https://2do4school.nl/api/registrations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user: {
          id: 100,
          email: user.email,
          password: user.password
        },
        startTime: d,
        endTime: '',
        location: {
          lat: location.coords.latitude,
          longitude: location.coords.longitude
        }
      })
    });

    console.log('succes')
  };


  const alertHandler = async (data) => {
    const user = auth.currentUser;
    const date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
    const db = getDatabase();
    const fs = getFirestore();
    const fsReference = doc(fs, 'registraties', date);
    const tokenRefrence = ref(db, '/token');
    const userSnap = await getDoc(fsReference);

    onValue(tokenRefrence, (snapshot) => {
      if (snapshot.val() === data.key) {

        if (userSnap.exists() && userSnap.data()[user.displayName] !== undefined) {
          Alert.alert('Check uit', 'Weet je zeker dat je wilt uitchecken?', [
            { text: 'annuleer', onPress: () => {}, style: 'cancel' },
            { text: 'ja', onPress: () => {checkOut(fsReference, user)}}
          ]);
        } else {
          Alert.alert('Check in', 'Weet je zeker dat je wilt inchecken?', [
            { text: 'annuleer', onPress: () => {}, style: 'cancel' },
            { text: 'ja', onPress: () => {checkIn(fsReference, data.location, user)}}
          ]);
        }

      } else {
        alert("Incorrecte QR code!")
      }
    });
  };


  // request camera permission
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);


  // request location permission
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let values = JSON.parse(data);
    alertHandler(values);
  };


  if (hasCameraPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (hasLocationPermission === null) {
    return <Text>Requesting for location permission</Text>;
  }
  if (hasLocationPermission === false) {
    return <Text>No access to location</Text>;
  }


  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && <Button title={'scan opnieuw'} onPress={() => setScanned(false)} />}
      </View>
      <View style={styles.bottom}>
        <Button title="log uit" style={styles.button} onPress={() => getAuth().signOut()} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  bottom: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: 'center',
    height: '20%'
  },

  cameraContainer: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'center',
    height: '125%',
    backgroundColor: 'black'
  }
});

export default ScannerScreen;