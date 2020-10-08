import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import firebase from 'firebase'

const TourTypeScreen = props => {
    const navigation = useNavigation();

    return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleText}>How will you be taking this tour?</Text>
        <View style={styles.buttonContainer}>
          <Button title="Virtually" buttonStyle={styles.virtualButton} textStyle={styles.virtualText} onPress={() => navigation.navigate('Map')} />
          <Button title="In Person" buttonStyle={styles.inPersonButton} textStyle={styles.inPersonText} onPress={() => navigation.navigate('Map')} />
        </View>
    </SafeAreaView>
    
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  virtualButton: {
    height: '20%',
    width: '65%',
    marginTop: '10%',
    marginBottom: '10%'
  },
  virtualText: {
    fontSize: 30
  },
  inPersonButton: {
    height: '20%',
    width: '65%',
    marginTop: '20%',
    marginBottom: '10%'
  },
  inPersonText: {
    fontSize: 30
  },
  titleText: {
    marginBottom: '20%', 
    fontSize: 20
  }
});


export default TourTypeScreen;