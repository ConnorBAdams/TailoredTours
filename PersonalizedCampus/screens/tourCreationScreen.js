import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import MapComponent from '../components/map'
import SignOutModule from '../components/signOut'

const TourCreationScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <SignOutModule />
        <Text> This is a placeholder for logged in, probably should just be map screen</Text>
        <Text>Thinking of showing tour creator, created tour stats, and some other info accessible through a side nav panel</Text>
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


export default TourCreationScreen;