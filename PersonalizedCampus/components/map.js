import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import * as Location from 'expo-location'
import globalStyles from '../styles'

const MapComponent = props => {
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

    return (
        <View style={styles.container}>
            {location === null && <ActivityIndicator size="large" />}
            {location != null &&
            <MapView style={styles.mapStyle} region={{latitude:location.latitude, longitude:location.longitude}} /> }
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
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
});


export default MapComponent;