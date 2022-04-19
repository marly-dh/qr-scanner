import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import { useAuth } from '../contexts/Auth';
import { srvTime } from '../services/getServerTime';
import { getLocationsByCoords } from "../services/locationService";
import { postRegistration, getRegsByDate, patchRegEndTime } from "../services/registrationService";


const ScannerScreen = () => {
  // useStates to keep track of various pieces information from within the app
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [myLocation, setLocation] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const auth = useAuth(); // with this variable we can acces variables nad functions from the Auth context (see contexts/Auth)
  const user = auth.authData.user; // separate the user data from the auth for cleaner code
  //const date = srvTime();
  const date = new Date(); // Get the current date and time


  // this function will add the endTime property to the registration that is given
  const checkOut = async (regID) => {
    patchRegEndTime(regID, date); // Here the API request is made (see services/registrationService)
    setRefresh(true); // refreshes component
  };

  // this function will check if the user's location matches up to the ones in the database and then store a new registration with the given location
  const checkIn = () => {
    // fetches all locations similar to the location of the user (see services/locationService)
    getLocationsByCoords(myLocation.coords.latitude, myLocation.coords.longitude).then(locations => {
      // checks if there are any locations that match
      if (locations.length > 0) {
        // Posts the new registration to the API along with the user id, current date and time and the location of registration (see services/registrationService)
        postRegistration(user.id, date, locations[0].id);
        setRefresh(true); // refreshes component
      } else {
        alert("Uw locatie komt niet over een met een van onze locaties.")
      }

    });
  };


  // this function will check if the user wants to check out or if the user was already registered today
  const alertHandler = async (data) => {
    await getRegsByDate(formatDate(date), user.id).then(regs => {

      if (regs.length === 0){ // if the user registers for the first time today
        //Asks if the user wants to check in
        Alert.alert('Check in', 'Weet je zeker dat je wilt inchecken?', [
          { text: 'annuleer', onPress: () => {}, style: 'cancel' },
          { text: 'ja', onPress: () => {checkIn()}} // call the checkIn function
        ]);
      } else if (!regs[0].endTime) { // if the user has only checked in today (witch would mean he wants to check out)
        //Asks if the user wants to check in
        Alert.alert('Check uit', 'Weet je zeker dat je wilt uitchecken?', [
          { text: 'annuleer', onPress: () => {}, style: 'cancel' },
          { text: 'ja', onPress: () => {checkOut(regs[0].id)}} // call the checkout function along with the previous registration id
        ]);
      } else if (regs[0].endTime) {
        // notifeis user that he is already registered for today
        Alert.alert('Oeps..', 'U heeft zichzelf vandaag al geregistreerd.', [
          { text: 'OK', onPress: () => {}, style: 'cancel' }
        ]);
      }

    });
  };


  // two functions to easily shorten the dateTime object to only a date
  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-');
  }

  // adds zeroes to date numbers
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }


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


  // this function is called once the QR code has been scanned
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    let values = JSON.parse(data);
    alertHandler(values); // calls alertHandler along with QR code data
  };


  // shows status of permissions on screen
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