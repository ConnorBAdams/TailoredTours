import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import MapComponent from '../components/map'
import * as Location from 'expo-location'

const MapScreen = props => {
	const [location, setLocation] = useState(null)
	const [errorMsg, setErrorMsg] = useState(null);

	useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied, is is required for the map');
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(location)
      })();
    }, []);
    const navigation = useNavigation();

    return (
    <View style={styles.container}>
		{location === null && <ActivityIndicator size="large" />}
		{location === null &&<Text>Loading...</Text>}
		{location != null && <MapComponent location={location} /> }
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