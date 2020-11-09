import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginModule from '../components/login'
import Button from '../components/button'

const LoginScreen = props => {

    const navigation = useNavigation();

	const loggedIn = () => {
		if (!navigation) {return}
		navigation.navigate('SignedIn')
	}

    return (
    <View style={styles.container}>
        <Text style={styles.titleText}>Welcome to Tailored Tours</Text>
        <LoginModule onSignIn={loggedIn}/>
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
		marginBottom: '-3%', 
		fontSize: 20
	}
	});


export default LoginScreen;