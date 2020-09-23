import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import MapComponent from '../components/map'

const MapScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <MapComponent />
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


export default MapScreen;