import React, {useEffect, useRef, useState} from "react";
import {Animated, Button, StyleSheet, Text, View} from "react-native";

const Status = ({children}) => {
  let dot1 = useRef(new Animated.Value(0)).current;
  let dot2 = useRef(new Animated.Value(0)).current;
  let dot3 = useRef(new Animated.Value(0)).current;

  const animateDots = () => {
    Animated.sequence([
      Animated.timing(dot1, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }),
      Animated.timing(dot2, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }),
      Animated.timing(dot3, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false
      }),
    ]).start(({finished}) => {
      if (finished) {
        dot1.setValue(0);
        dot2.setValue(0);
        dot3.setValue(0);
        animateDots();
      }
    })
  }

  useEffect(() => {
    animateDots();
  })

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{children}</Text>
        <Animated.Text style={[styles.statusText, {opacity: dot1}]}>.</Animated.Text>
        <Animated.Text style={[styles.statusText, {opacity: dot2}]}>.</Animated.Text>
        <Animated.Text style={[styles.statusText, {opacity: dot3}]}>.</Animated.Text>
      </View>
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

  statusContainer: {
    display: "flex",
    flexDirection: "row",
  },

  statusText: {
    color: '#949494',
    fontSize: 20
  }
});

export default Status;