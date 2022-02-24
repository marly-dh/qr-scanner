import { getDatabase, ref, onValue} from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"


const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const auth = getAuth();
  const d = firebase.firestore.Timestamp.fromDate(new Date()).toDate();


  const checkOut = (ref, user) => {
    updateDoc(ref, {
      [user.displayName + '.checkOut']: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
    });
    setRefresh(true);
  };


  const checkIn = (ref, location, user) => {
    setDoc(ref, {
      [user.displayName]: {
        checkIn: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
        checkOut: "",
        account: user.email,
        location: location
      }
    });
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


  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);


  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let values = JSON.parse(data);
    alertHandler(values);
  };


  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
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