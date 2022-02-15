import { getDatabase, ref, set, onValue} from 'firebase/database';
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { getAuth } from "firebase/auth";

const auth = getAuth();

function storeData(location, token) {
  const user = auth.currentUser;
  const db = getDatabase();
  const userReference = ref(db, '/' + location + '/' + user.displayName);
  const tokenRefrence = ref(db, '/token');

  onValue(tokenRefrence, (snapshot) => {
    if (snapshot.val() === token) {
      set(userReference, {
        time: "12:00",
        account: user.email
      });
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
          style={[StyleSheet.absoluteFillObject, styles.camera]}
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