import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Button from '../components/button'
import DrawerHeader from '../components/drawerHeader'
import MyToursScreen from './myToursScreen'
import TourCreationScreen from './tourCreationScreen'
import firebase from 'firebase'

const Drawer = createDrawerNavigator();

const SignedInScreen = props => {

useEffect(() => {checkIfLoggedIn() });

	const checkIfLoggedIn = () => {
		firebase.auth().onAuthStateChanged(function(user) {
			if (!user) {
				// user is not logged in 
				//navigation.navigate('Login') // This is causing error on logout
			}
		})
	}

	const signOut = () => {
		props.navigation.navigate('Home')
		firebase.auth().signOut()
	} 

	const returnHome = () => {
		props.navigation.navigate('Home')
	}

	return (
		<NavigationContainer independent={true}>
		<Drawer.Navigator initialRouteName="My Tours" drawerContent={props => {
		return (
			<DrawerContentScrollView {...props}>
			<DrawerItem label="Main Screen" onPress={() => returnHome()} />
			<DrawerItemList {...props} />
			<DrawerItem label="Logout" onPress={() => signOut()} />
		</DrawerContentScrollView>
		)
		}}>
			<Drawer.Screen name="My Tours" component={MyToursScreen} />
			<Drawer.Screen name="SignedIn" component={TourCreationScreen} />
		</Drawer.Navigator>
		</NavigationContainer>
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
	header:{
		width:"100%",
		height:60,
		flexDirection:"row",
		justifyContent:"space-between",
		alignItems:"center",
		paddingHorizontal:20
	}
});


export default SignedInScreen;