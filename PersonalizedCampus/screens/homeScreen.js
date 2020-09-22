import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <Text style={{marginBottom:'25%'}}>Home Screen!</Text>
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