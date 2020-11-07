import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { Marker, Circle } from 'react-native-maps';
import globalStyles from '../styles'
import Button from '../components/button'
import MarkerEditorComponent from './markerEditor'

const MapComponent = props => {
    const [mapType, setMapType] = useState('standard')
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedNode, setSelectedNode] = useState(null)

    const toggleModal = () => {
        if (modalVisible === false) {
            setModalVisible(true)
        } else {
            setModalVisible(false)
        }
    }

    const updateNode = (title, descr) => {
        node = selectedNode
        node.name = title
        node.description = descr
        setSelectedNode(node)
    }

    const editMarker = marker => {
        if (modalVisible === false) {
            setSelectedNode(marker)
            setModalVisible(true)
        } else {
            setModalVisible(false)
        }
    }

    return (
        <View style={styles.container}>
            {modalVisible && <MarkerEditorComponent onSubmit={updateNode} toggle={toggleModal} node={selectedNode} visible={modalVisible} />}
            <View style={styles.buttonPos}>
                <TouchableOpacity style={styles.icon} onPress={() => { if (mapType === 'standard' ) setMapType('satellite'); else setMapType('standard')}} >
                {mapType=='standard' && <FontAwesome5 name="satellite" size={32} />}
                {mapType=='satellite' && <FontAwesome5 name="map" size={32}  />}
                </TouchableOpacity>
            </View>
            <MapView style={(props.style != null) ? props.style : styles.mapStyle} mapType={mapType}
            initialRegion={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} 
            onPress={e => {props.onPress != null ? props.onPress(e) : null}}> 
            <Marker key={1000} coordinate={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude}}
            title="Your Location" >
                <MaterialIcons name="person-pin-circle" size={42} color="crimson" />
            </Marker>
            {( props.nodes != undefined && props.nodes.length > 0 && props.nodes[0] != null) ? 
            props.nodes.map((marker, index) => { 
                if (marker.type==='Node') 
                {
                    //console.log('It\'s a node');
                    return <Marker
                    key={index}
                    coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                    title={marker.name}
                    description={marker.description}
                    onCalloutPress={() => editMarker(marker)}
                    />
                }
                else if (marker.type==='Circle') {
                    //console.log('It\'s a circle');
                    return [<Circle
                    key={index}
                    center={{latitude:marker.latitude, longitude:marker.longitude}}
                    radius={marker.radius}
                    fillColor={marker.fillColor}
                    title={marker.name}
                    />, 
                    <Marker
                    key={index+0.5}
                    coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                    title={marker.name}
                    >
                    <MaterialCommunityIcons name="checkbox-multiple-blank-circle-outline"  size={32} color="black" />
                    </Marker>
                ]
                }}) 
            : null}
            
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
      },
      mapStyle: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height*.9,
      },
      icon: {
        borderRadius: 12,
        borderWidth: 2,
        padding: 2,
        backgroundColor: 'white',
      },
      buttonPos: {
        marginBottom: -75,
        marginRight: 25,
        zIndex: 1,
        alignSelf: 'flex-end'
      }
});


export default MapComponent;