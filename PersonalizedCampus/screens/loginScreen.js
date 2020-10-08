import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginModule from '../components/login'
import Button from '../components/button'
import firebase from 'firebase'

const LoginScreen = props => {
    // Will run the checkIfLogged in on element load
    useEffect(() => {checkIfLoggedIn() });

    const navigation = useNavigation();

    const checkIfLoggedIn = () => {
      firebase.auth().onAuthStateChanged(function(user) {
          if (user) {
              // user is logged in 
              navigation.navigate('Tour Creation')
          } else {
              // user isn't logged in, 
          }
      })
    }

    return (
    <View style={styles.container}>
        <Text style={styles.titleText}>Welcome to Tailored Tours.</Text>
        <LoginModule />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }, 
  titleText: {
    marginBottom: '5%', 
    fontSize: 20
  }
});


export default LoginScreen;