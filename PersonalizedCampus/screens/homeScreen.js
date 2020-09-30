import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'

const HomeScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <Text style={{marginBottom:'25%'}}>Home Screen!</Text>
        <Button title="Go to map" onPress={() => navigation.navigate('Map')} />
        <Button title="Go to log in" onPress={() => navigation.navigate('Login')} />
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
    margin: '15%',
    alignContent: 'center',
  }
});


export default HomeScreen;