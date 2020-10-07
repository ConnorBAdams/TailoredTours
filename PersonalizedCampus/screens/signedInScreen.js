import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import SignOutModule from '../components/signOut'
import Button from '../components/button'
import DrawerHeader from '../components/drawerHeader'
import MyToursScreen from './myToursScreen'
import TourCreationScreen from './tourCreationScreen'
import firebase from 'firebase'

const Drawer = createDrawerNavigator();

const SignedInScreen = props => {

  const signOut = () => {
    firebase.auth().signOut()
    props.navigation.navigate('Login')
  } 

  const returnHome = () => {
    props.navigation.navigate('Home')
  }

    return (
        <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="Tour Creation" drawerContent={props => {
          return (
            <DrawerContentScrollView {...props}>
            <DrawerItem label="Main Screen" onPress={() => returnHome()} />
            <DrawerItemList {...props} />
            <DrawerItem label="Logout" onPress={() => signOut()} />
          </DrawerContentScrollView>
          )
        }}>
            <Drawer.Screen name="Tour Creation" component={TourCreationScreen} />
            <Drawer.Screen name="My Tours" component={MyToursScreen} />
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