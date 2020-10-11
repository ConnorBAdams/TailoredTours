import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'
import globalStyles from '../styles'
import Button from '../components/button'
import MapComponent from './map'

const TourSetupComponent = props => {
    const [location, setLocation] = useState(null)
    const [tourTitle, setTourTitle] = useState(null)
    const [anchor, setAnchor] = useState(null)

	useEffect(() => {
        (async () => {
          let { status } = await Location.requestPermissionsAsync();
          if (status !== 'granted') {
              Alert.alert('Permission to access location was denied, is is required for the map')
          }
    
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
          console.log(location)
        })();
      }, []);

    const navigation = useNavigation();
    
    const isValidTourData = text => {
        if (!text) {
            Alert.alert("Please enter a title for the tour area")
        } else {
            setTourTitle(text)
        }
    }

    const createAnchor = (e) => {
        console.log("Anchor: ", e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)
        setAnchor({latitude:e.nativeEvent.coordinate.latitude, 
            longitude:e.nativeEvent.coordinate.longitude, 
            name:'Anchor',
            radius: 1000,
            fillColor: (65, 61, 82),
            type:'Circle'})
   }

    return (
        <View style={styles.container}>
            <Text>First define the general area the tour route(s) will be in</Text>
            <Text style={styles.titleText}>Tour Name:</Text>
            <TextInput style={globalStyles.inputField}
            placeholder="Tour Name"
            onChangeText={text => isValidTourData(text)} />
            <Text style={styles.titleText}>Select general tour area:</Text>
            {location === null && <ActivityIndicator size="large" />}
            {location === null &&<Text>Loading...</Text>}
            {location != null && <MapComponent style={styles.mapStyle} nodes={[anchor]} onPress={e => createAnchor(e)} location={location} /> }
            <Button title="Create Tour" onPress={() => {props.submitTour({title:tourTitle, anchor:anchor})}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: 400,
      },
      titleText: {
          fontSize: 20,
          marginTop: 15
      },
});


export default TourSetupComponent;