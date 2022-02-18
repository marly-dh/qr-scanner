import { getDatabase, ref, onValue} from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, updateDoc, getDoc } from "firebase/firestore"

const auth = getAuth();

async function storeData(location, token) {
  const user = auth.currentUser;
  const d = new Date();
  const date = d.getDate()+'-'+(d.getMonth()+1)+'-'+d.getFullYear();
  const db = getDatabase();
  const fs = getFirestore();
  const fsReference = doc(fs, 'registraties', date);
  const tokenRefrence = ref(db, '/token');
  const userSnap = await getDoc(fsReference);

  onValue(tokenRefrence, (snapshot) => {
    if (snapshot.val() === token) {

      if (userSnap.exists() && userSnap.data()[user.displayName] !== undefined) {
        updateDoc(fsReference, {
          [user.displayName + '.checkOut']: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'})
        })
      } else {
        setDoc(fsReference, {
          [user.displayName]: {
            checkIn: d.toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'}),
            checkOut: "",
            account: user.email,
            location: location
          }
        });
      }

    }
  }, (errorObject) => {
    console.log('The read failed: ' + errorObject.name);
  });
}

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let values = JSON.parse(data);
    storeData(values.location, values.key);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
        {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      </View>
      <View style={styles.bottom}>
        <Button title="Sign Out" style={styles.button} onPress={() => getAuth().signOut()} />
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