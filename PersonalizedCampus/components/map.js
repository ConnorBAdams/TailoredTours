import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import * as Location from 'expo-location'
import globalStyles from '../styles'
import Button from '../components/button'

const MapComponent = props => {
    const [mapType, setMapType] = useState('standard')
    const [addNodeEnabled, setAddNodeEnabled] = useState(false)
    const [nodes, setNodes] = useState([])

    const toggleEditMode = () => {
        if (addNodeEnabled) {
            setAddNodeEnabled(false)
        } else {
            setAddNodeEnabled(true)
        }
    }

    const createNode = (e) => {
        if (addNodeEnabled)
        {
            if (nodes.length > 0) {
                setNodes([...nodes, {latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
            } else {
                setNodes([{latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
            }
            console.log(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude, nodes.length)
        }
   }

    return (
        <View style={styles.container}>
            <MapView style={styles.mapStyle} mapType={mapType}
            initialRegion={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} 
            onPress={e => createNode(e)}> 
            <Marker key={0} coordinate={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude}}
            title="Your Location" description="" />
            {nodes.map((marker, index) => (
                <Marker
                key={index}
                coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                title={'test'}
                />
            ))}
            </MapView>
            <Button title='Toggle Mode' onPress={() => { if (mapType === 'standard' ) setMapType('satellite'); else setMapType('standard')}} />
            <Button title='Place Node' onPress={() => toggleEditMode()} />

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
        height: Dimensions.get('window').height * 0.8,
      },
});


export default MapComponent;