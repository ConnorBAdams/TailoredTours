import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <Text style={{marginBottom:'25%'}}>Login / Account Creation Screen!</Text>
        <Button title='Login' style={styles.button} />
        <Button title='Create Account' style={styles.button} />
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
  button: {
    flex: 1,
    marginBottom: '15%',
    alignContent: 'center',
  }
});


export default LoginScreen;