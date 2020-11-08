import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Animated, ScrollView } from 'react-native';
import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView from 'react-native-maps';
import { Marker, Circle, Polyline } from 'react-native-maps';
import globalStyles from '../styles'
import Button from '../components/button'
import MarkerEditorComponent from './markerEditor'
import Carousel from 'react-native-snap-carousel';
import CarouselItem from './carouselItem'
import { TouchableOpacity } from 'react-native-gesture-handler';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

// How to use this component: 
// This displays the map with Google Maps and allows for node/route creation
// To use just the map: 
// Call the component and pass a location prop for user location
// Optionally, the style can be specified
// To allow for node placement:
// supply a 'nodes' array, a placement mode ('route' or 'node'),
// an onPress function for handling node creation in the parent component
// To allow Route creation: 
// pass a 'routes' array of route objects, onRouteConfirm to create a route
// probably some more stuff I'm forgetting

const MapComponent = props => {
    const [mapType, setMapType] = useState('standard')
    const [placementMode, setPlacementMode] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedNode, setSelectedNode] = useState(null)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (placementMode == null && props.placementMode != null)
        {
            setPlacementMode(props.placementMode)
        }
    })

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

    const toggleMapViewMode = () => {
        if (mapType === 'standard' ) 
            setMapType('satellite'); 
        else 
            setMapType('standard')
    }

    const togglePlacementMode = () => {
        if (placementMode === 'node' ) 
            setPlacementMode('route'); 
        else 
            setPlacementMode('node')
    }
    
    const carouselItem = ({item, index}) => {
        return (
            <CarouselItem 
            contents={item}
            type={'route'} />    
        );
    }

    return (
        <View style={styles.container}>
            {modalVisible && 
            <MarkerEditorComponent 
                onSubmit={updateNode} 
                toggle={toggleModal} 
                node={selectedNode} 
                visible={modalVisible} />}
            <View style={styles.mapTopButtons}>
            <View style={styles.mapModeButton}>
            {placementMode != null &&
                <TouchableOpacity style={styles.icon} onPress={() => togglePlacementMode() } >
                {placementMode=='node' && <FontAwesome5 name="map-marker" size={32} />}
                {placementMode=='route' && <FontAwesome5 name="route" size={32} style={{marginLeft:4, marginRight:4}} />}
                </TouchableOpacity>
            }
            </View>
            <View style={styles.mapStyleButton}>
                <TouchableOpacity style={styles.icon} onPress={() => toggleMapViewMode()} >
                {mapType=='standard' && <FontAwesome5 name="satellite" size={32} style={{marginRight: 2, marginLeft: 2}} />}
                {mapType=='satellite' && <FontAwesome5 name="map" size={32} />}
                </TouchableOpacity>
            </View>
            </View>
            <View style={{zIndex: -1, elevation: -1}}>
            <MapView 
            style={(props.style != null) ? props.style : styles.mapStyle} 
            mapType={mapType}
            initialRegion={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421}} 
            onPress={e => {props.onPress != null ? props.onPress(e, placementMode) : null}}> 
            { (props.showUser != null && props.showUser === true || props.showUser == null) && 
            <Marker key={1000.1} coordinate={{latitude:props.location.coords.latitude, longitude:props.location.coords.longitude}}
            title="Your Location" >
                <MaterialIcons name="person-pin-circle" size={42} color="crimson" />
            </Marker> }
            {console.log(props.nodes)}
            {( props.nodes != undefined && props.nodes.length > 0 && props.nodes[0] != null) ? 
            props.nodes.map((marker, index) => { 
                if (marker.type==='Node') 
                {
                    //console.log('It\'s a node');
                    return <Marker
                    key={index}
                    identifier={index.toString()}
                    coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                    title={marker.name}
                    description={marker.description}
                    onCalloutPress={() => editMarker(marker)}
                    onPress={(node) => {if (placementMode=='route') props.addNodeToRoute(node)} }
                    />
                }
                else if (marker.type==='Circle') {
                    //console.log('It\'s a circle');
                    return [<Circle
                    key={index}
                    identifier={index.toString()}
                    center={{latitude:marker.latitude, longitude:marker.longitude}}
                    radius={marker.radius}
                    fillColor={marker.fillColor}
                    title={marker.name}/>, 
                    <Marker
                    key={index+0.5}
                    coordinate={{latitude:marker.latitude, longitude:marker.longitude}}
                    title={marker.name}
                    anchor={{x: 0.5, y: 0.5}}>
                    <MaterialCommunityIcons name="circle-double" size={32} color="black"/>
                    </Marker>
                ]}
            }) 
            : null}
            {( props.routes != undefined && props.routes.length > 0 && props.routes[0] != null) ? 
            props.routes.map((marker, index) => { 
                if (marker.length == 0) return;
                coords = [];
                marker.nodes.forEach(nodeID =>{ coords.push({latitude: props.nodes[nodeID].latitude, longitude:props.nodes[nodeID].longitude})})
                return <Polyline
                key={index}
                strokeColor={`rgb(${marker.routeColor.r}, ${marker.routeColor.g}, ${marker.routeColor.b})`}
                strokeWidth={4}
                coordinates={coords}
                />
            }) 
            : null}
            </MapView>  
            </View>
            { placementMode === 'route' &&
            <View style={styles.mapBottomButtons}>
            <View style={styles.routeConfirmButton}>
            <TouchableOpacity style={styles.icon} onPress={() => props.onRouteConfirm()} > 
                <FontAwesome5 name="check-circle" size={32} />
            </TouchableOpacity>
            </View>
            </View>} 
            { (props.routes != undefined && props.carouselEnabled ) ? 
            <Carousel
                ref={(c) => { carousel = c; }}
                data={props.routes}
                renderItem={carouselItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width * 0.8}
                onSnapToItem={index => setSelectedIndex(index)}
                containerCustomStyle={{ height: Dimensions.get('window').height, position:'absolute' }}
                />
            : null}  
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        alignItems: 'center',
        justifyContent: 'center',
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
    mapTopButtons: {
        zIndex: 1,
        marginBottom: -50,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'flex-end'
    },
    mapBottomButtons: {
        zIndex: 1,
        marginTop: -50,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'flex-end',
        marginBottom: 4.5
    },
    mapModeButton: {
        marginRight: Dimensions.get('window').width * 0.73, // sigh
    },
    mapStyleButton: {
        marginRight: 10,
    },
    routeConfirmButton: {
        marginRight: 10,
        padding: 2
    },
    carouselContainer: {
        flex: 1,
        height: Dimensions.get('window').height * 0.25,
        width: Dimensions.get('window').width ,
        bottom: -10,
        backgroundColor: 'blue',
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        flexBasis: 1,
        flexGrow: 1,
        flexShrink: 1,
        zIndex: 10,
        elevation: 10
    },
});


export default MapComponent;