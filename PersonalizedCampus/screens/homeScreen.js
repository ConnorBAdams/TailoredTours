import React, { useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'

const HomeScreen = props => {
    const navigation = useNavigation();
    var logo = props.active ? require('../assets/Logo-Full.png') : require('../assets/Logo-Full.png');

    return (
    <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
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
  },
  logo: {
    margin: 40,
    width: '100%',
    height: undefined,
    aspectRatio: 16/9
  },
  imageContainer: {
    flex: 1
  }
});


export default HomeScreen;