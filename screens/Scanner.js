import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Location from 'expo-location';
import {useAuth} from '../contexts/Auth';
import {getLocationsByCoords, postLocation} from "../services/locationService";
import {getRegsByDate, patchRegEndTime, postRegistration, getQRToken} from "../services/registrationService";
import Status from "../components/Status";
import {srvTime} from "../services/getServerTime";

const ScannerScreen = () => {
  // useStates to keep track of various pieces information from within the app
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasLocationPermission, setHasLocationPermission] = useState(null);
  const [myLocation, setLocation] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const auth = useAuth(); // with this variable we can access variables nad functions from the Auth context (see contexts/Auth)
  const user = auth.authData.user; // separate the user data from the auth for cleaner code
  const JWT = auth.authData.userToken.token

  // this function will add the endTime property to the registration that is given
  const checkOut = async (regID) => {
    const date = await srvTime(); // fetch the current date and time
    patchRegEndTime(regID, date, JWT); // Here the API request is made (see services/registrationService)
    setRefresh(true); // refreshes component
  };

  // this function will check if the user's location matches up to the ones in the database and then store a new registration with the given location
  const checkIn = async () => {
    const date = await srvTime(); // fetch the current date and time
    // fetches all locations similar to the location of the user (see services/locationService)
    let locations = await getLocationsByCoords(myLocation.coords.latitude, myLocation.coords.longitude, JWT);

    // if the given location does not show up in database
    if (locations.length <= 0) {
      // post a new location containing user's coords
      await postLocation(myLocation.coords.latitude, myLocation.coords.longitude, JWT);
      locations = await getLocationsByCoords(myLocation.coords.latitude, myLocation.coords.longitude, JWT); // fetch locations again to use the newly added location
    }

    // Posts the new registration to the API along with the user id, current date and time and the location of registration (see services/registrationService)
    await postRegistration(user.id, date, locations[0].id, JWT);
    setRefresh(true);
  };


  // this function will check if the user wants to check out or if the user was already registered today
  const alertHandler = async (data) => {
    const date = new Date(await srvTime()); // fetch the current date and time
    const regs = await getRegsByDate(formatDate(date), user.id, JWT) // retrieves all registrations made by this user today

    if (regs.length === 0) { // if the user registers for the first time today
      //Asks if the user wants to check in
      Alert.alert('Check in', 'Weet je zeker dat je wilt inchecken?', [
        {
          text: 'annuleer', onPress: () => {
          }, style: 'cancel'
        },
        {
          text: 'ja', onPress: () => {
            checkIn()
          }
        } // call the checkIn function
      ]);
    } else if (!regs[0].endTime) { // if the user has only checked in today (witch would mean he wants to check out)
      //Asks if the user wants to check in
      Alert.alert('Check uit', 'Weet je zeker dat je wilt uitchecken?', [
        {
          text: 'annuleer', onPress: () => {
          }, style: 'cancel'
        },
        {
          text: 'ja', onPress: () => {
            checkOut(regs[0].id)
          }
        } // call the checkout function along with the previous registration id
      ]);
    } else if (regs[0].endTime) {
      // notifies user that he is already registered for today
      Alert.alert('Oeps..', 'U heeft zichzelf vandaag al geregistreerd.', [
        {
          text: 'OK', onPress: () => {
          }, style: 'cancel'
        }
      ]);
    }

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
      const {status} = await BarCodeScanner.requestPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);


  // request location permission
  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);


  // this function is called once the QR code has been scanned
  const handleBarCodeScanned = async ({data}) => {
    setScanned(true);

    try {
      let values = JSON.parse(data);
      let QRToken = await getQRToken();

      if (QRToken.token === values.token) {
        alertHandler(values); // calls alertHandler along with QR code data
      } else {
        throw 'OLD';
      }
    } catch (e) {
      if (e === 'OLD') {
        Alert.alert('Oeps..', 'Deze QR code is verlopen, probeer opnieuw...', [
          {
            text: 'OK', onPress: () => {
            }, style: 'cancel'
          }
        ]);
      } else {
        Alert.alert('Oeps..', 'U heeft niet een juiste QR code gescant.', [
          {
            text: 'OK', onPress: () => {
            }, style: 'cancel'
          }
        ]);
      }
    }
  };


  // shows status of permissions on screen
  if (hasCameraPermission === null) {
    return <Status>Requesting for camera permission</Status>;
  }
  if (hasCameraPermission === false) {
    return <Status>No access to camera</Status>;
  }
  if (hasLocationPermission === null) {
    return <Status>Requesting for location permission</Status>;
  }
  if (hasLocationPermission === false) {
    return <Status>No access to location</Status>;
  }


  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && <Button title={'scan opnieuw'} onPress={() => setScanned(false)}/>}
      </View>
      <View style={styles.bottom}>
        <Button title="log uit" style={styles.button} onPress={() => handleBarCodeScanned({token: 'NcU2UAKW11BFTb5peECDz9l5T2ecKaRc'}) /*auth.signOut()*/}/>
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