import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import HomeScreen from './screens/homeScreen'
import TourTypeScreen from './screens/tourTypeScreen'
import LoginScreen from './screens/loginScreen'
import AccountCreationScreen from './screens/accountCreationScreen';
import MapScreen from './screens/mapScreen';
import SignedInScreen from './screens/signedInScreen';

import * as firebase from 'firebase';
import firebaseConfig from './config';


const Stack = createStackNavigator();

export default function App() {
  if (!firebase.apps.length)
    firebase.initializeApp(firebaseConfig);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tour Type" component={TourTypeScreen} /> 
      <Stack.Screen name="Account Creation" component={AccountCreationScreen} />
      <Stack.Screen name="SignedIn" component={SignedInScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
