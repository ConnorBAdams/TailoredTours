import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginModule from '../components/login'
import Button from '../components/button'

const LoginScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <Text>Login / Account Creation Screen!</Text>
        <LoginModule />
        <Button title='Create Account' onPress={() => navigation.navigate('Account Creation')} />
    </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});


export default LoginScreen;