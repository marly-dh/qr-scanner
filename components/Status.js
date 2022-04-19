import React from "react";
import {StyleSheet, Text, View} from "react-native";

const Status = ({children}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.statusText}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  statusText: {

  }
});

export default Status;