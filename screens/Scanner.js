import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import {useAuth} from "../contexts/Auth";


const ScannerScreen = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [location, setLocation] = useState(null);

  const auth = useAuth();


  const checkOut = (ref, user) => {
    /*updateDoc(ref, {
      [user.displayName + '.checkOut']: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
    });*/
    setRefresh(true);
  };


  const checkIn = (locationQR, user) => {
    /*setDoc(ref, {
      [user.displayName]: {
        checkIn: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
        checkOut: "",
        account: user.email,
        location: locationQR
      }
    });*/
  };


  const alertHandler = async (data) => {
    Alert.alert('Check in', 'Weet je zeker dat je wilt inchecken?', [
      { text: 'annuleer', onPress: () => {}, style: 'cancel' },
      { text: 'ja', onPress: () => {checkIn(data.location)}}
    ]);

    /*onValue(tokenRefrence, (snapshot) => {
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
    });*/
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
        <Button title="log uit" style={styles.button} onPress={() => auth.signOut()} />
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