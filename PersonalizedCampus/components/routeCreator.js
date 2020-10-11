import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location'
import globalStyles from '../styles'
import Button from '../components/button'
import MapComponent from './map'

const RouteCreatorComponent = props => {
    const [location, setLocation] = useState(null)
    const [tourTitle, setTourTitle] = useState(null)
    const [nodes, setNodes] = useState([])

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
            Alert.alert("Please enter a title for the tour route")
        } else {
            setTourTitle(text)
        }
    }

    const createNode = (e) => {
        if (nodes.length > 0) {
            setNodes([...nodes, {type:'Node', name:'Name me', description:'Tap on me to name me', latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
        } else {
            setNodes([{type:'Node', name:'Name me', description:'Tap on me to name me', latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
        } 
   }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Tour Route Name:</Text>
            <TextInput style={globalStyles.inputField}
            placeholder="Route Name"
            onChangeText={text => isValidTourData(text)} />
            <Text style={styles.titleText}>Select the stops on the tour route:</Text>
            {location === null && <ActivityIndicator size="large" />}
            {location === null &&<Text>Loading...</Text>}
            {location != null && <MapComponent style={styles.mapStyle} nodes={nodes} onPress={e => createNode(e)} location={location} /> }
            <Button title="Create Tour Route" onPress={() => {props.createRoute({title:tourTitle, nodes:nodes})}} />
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


export default RouteCreatorComponent;