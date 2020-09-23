import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AccountCreationScreen = props => {
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
        <Text style={{marginBottom:'25%'}}>Account Creation Screen!</Text>
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


export default AccountCreationScreen;