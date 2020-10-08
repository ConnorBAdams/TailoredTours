import React from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import HomeScreen from './screens/homeScreen'
import LoginScreen from './screens/loginScreen'
import AccountCreationScreen from './screens/accountCreationScreen';
import MapScreen from './screens/mapScreen';
import SignedInScreen from './screens/signedInScreen';
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBeuWLZo7j8Ug0G1G0z9Al1UR7VvQf4M6o",
  authDomain: "tailoredtours-25201.firebaseapp.com",
  databaseURL: "https://tailoredtours-25201.firebaseio.com",
  projectId: "tailoredtours-25201",
  storageBucket: "tailoredtours-25201.appspot.com",
  messagingSenderId: "584187795626",
  appId: "1:584187795626:web:69e2ce253c9c751fd598d3",
  measurementId: "G-K73Z5DK70V"
};

const Stack = createStackNavigator();

export default function App() {
  firebase.initializeApp(firebaseConfig);
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="Account Creation" component={AccountCreationScreen} /> */}
      <Stack.Screen name="Tour Creation" component={SignedInScreen} options={{ headerShown: false }} />
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
