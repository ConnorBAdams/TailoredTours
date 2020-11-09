import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, TextInput, Alert, Modal } from 'react-native';
import globalStyles from '../styles'
import Button from '../components/button'
import MapComponent from './map'
import HsvColorPicker from 'react-native-hsv-color-picker';

const RouteCreatorComponent = props => {
    const [location, setLocation] = useState(null)
    const [tourTitle, setTourTitle] = useState(null)
    const [tourDesc, setTourDesc] = useState(null)
    const [nodes, setNodes] = useState([]) // array of all nodes
    const [routes, setRoutes] = useState([]) // array of objects which correspond to nodes
    const [wipRoute, setWIPRoute] = useState(null) // the WIP route, moved to routes when confirmed
    const [nameModalVisible, setNameModalVisible] = useState(false) // modal visibility
    // Color picker data, HSV color formatting
    const [hue, setHue] = useState(0) // hue
    const [sat, setSat] = useState(0) // saturation
    const [val, setVal] = useState(1) // value

    useEffect(() => {
        if (props.location != null && location == null){
            setLocation(props.location);
            console.log(props.location);
        }});

    const createNode = (e, mode) => {
        if (nodes.length > 0) {
            setNodes([...nodes, 
                {type:'Node', 
                id: nodes.length,
                name:'Name me', 
                description:'Tap on me to name me', 
                latitude:e.nativeEvent.coordinate.latitude, 
                longitude:e.nativeEvent.coordinate.longitude}])
        } else {
            setNodes([
                {type:'Node', 
                id: 0,
                name:'Name me', 
                description:'Tap on me to name me', 
                latitude:e.nativeEvent.coordinate.latitude, 
                longitude:e.nativeEvent.coordinate.longitude}])
        } 
        if (mode==='route') {
            if (wipRoute == null) {
            // nodes are only the IDs, which are assigned sequentially
            // The name is also set to a WIP name for ease of object use
                setWIPRoute({ 
                    name: 'Untitled Route',
                    routeColor: {r:255, g:0, b:0},
                    nodes: [nodes.length] }) 
            } 
            else {
                setWIPRoute({
                    name: 'Untitled Route',
                    routeColor: {r:255, g:0, b:0},
                    nodes: [...wipRoute.nodes, nodes.length] })
            }
        }
   }

   // Adds an existing node to a route in progress
   const addNodeToRoute = (node) => {
        if (wipRoute == null) {
            setWIPRoute({ 
                name: 'Untitled Route',
                routeColor: {r:255, g:0, b:0},
                nodes: [node.nativeEvent.id] }) 
        } 
        else {
            setWIPRoute({
                name: 'Untitled Route',
                routeColor: {r:255, g:0, b:0},
                nodes: [...wipRoute.nodes, node.nativeEvent.id] })
        }
    }

   // TODO: Remove a node from all routes and nodes
    const deleteNode = (node) => {

    }
   
    // Route color functions
    const onSatValPickerChange = ( {saturation, value} ) => {
        console.log(saturation, value)
        setSat(saturation)
        setVal(value)
    }
    const onHuePickerChange = ( {hue} ) => {
        console.log(hue)
        setHue(hue)
    }

   const promptForRouteName = () => {
        if (wipRoute.nodes.length == 0) 
            return;
        if (!nameModalVisible)
            setNameModalVisible(true)
    }

    // Finishes creating the route in the frontend
    // Moves a WIP route object into the routes array
    const createRoute = () => {
        if (routes != null && routes.length > 0) {
            setRoutes([...routes, {
                type: 'Route',
                id: routes.length,
                routeColor: hsvToRgb(hue, sat, val), 
                name: tourTitle,
                desc: tourDesc,
                nodes: wipRoute.nodes
            }])
        }
        else {
            setRoutes([{
                type: 'Route',
                id: 0,
                routeColor: hsvToRgb(hue, sat, val), 
                name: tourTitle,
                desc: tourDesc,
                nodes: wipRoute.nodes
            }])
        }
        setWIPRoute(null)
        setHue(0)
        setSat(0)
        setVal(1)
        setNameModalVisible(false)
    }

   // If a route is in progress this asks the user if they want to save it
   // TODO: Make it continue following the alert
   // Otherwise it saved the tour
   const finished = () => {
       if (wipRoute != null && wipRoute.length != 0){
           Alert.alert(
               "Unsaved route", "Unsaved route, would you like to save it before moving on?",
               [{
                   text:'Yes', onPress:() => promptForRouteName()
               },{ text: 'No', onPress:() => setWIPRoute(null) }
            ])
       } else {
        props.createRoute({routes:{...routes}, nodes:{...nodes}})
           // can be finished
       }
   }

//    const createRoute = (e) => {
//         if (props.createRoute(e)) {
//             setTourTitle('')
//             setNodes([])
//         }
//    }

    return (
        <View style={styles.container}>
            <Modal
            animationType="slide"
            transparent={true}
            visible={nameModalVisible}
            onRequestClose={() => {setNameModalVisible(!nameModalVisible)}}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Text style={styles.modalText}>Finish Route:</Text>
            <TextInput style={globalStyles.inputField}
            placeholder="Route Name"
            onChangeText={text => setTourTitle(text)} />
            <TextInput style={globalStyles.inputField}
            placeholder="Route Description"
            onChangeText={text => setTourDesc(text)} />
            <HsvColorPicker
            huePickerHue={hue}
            satValPickerHue={hue}
            satValPickerSaturation={sat}
            satValPickerValue={val}
            onHuePickerDragMove={onHuePickerChange}
            onHuePickerPress={onHuePickerChange}
            onSatValPickerDragMove={onSatValPickerChange}
            onSatValPickerPress={onSatValPickerChange}
            />
            
            <Button title="Save Route" style={{paddingTop: 15}} onPress={() => {createRoute()}} />
            </View>
            </View>
            </Modal>
            {/* <Text style={styles.titleText}>Tour Route Name:</Text>
            <TextInput style={globalStyles.inputField}
            placeholder="Route Name"
            onChangeText={text => isValidTourData(text)} /> */}
            <Text style={styles.titleText}>Create stops and routes:</Text>
            {location === null && <ActivityIndicator size="large" />}
            {location === null && <Text>Loading...</Text>}
            {location != null && 
            <MapComponent 
            style={styles.mapStyle} 
            nodes={nodes} 
            routes={(wipRoute != null)? [wipRoute, ...routes] : routes}
            placementMode={'route'}
            onPress={(e, mode) => createNode(e, mode)} 
            onRouteConfirm={promptForRouteName}
            addNodeToRoute={addNodeToRoute}
            placementEnabled={true}
            location={location} /> }
            <Button title="Finished" style={styles.submitButton} onPress={() => {finished()}} />
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
        height: Dimensions.get('window').height * 0.75,
    },
    titleText: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10
    },
    submitButton: {
        marginTop: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: '#F194FF',
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 20,
        textAlign: 'center',
    },
    colorPicker : {
        height: 100,
        width: 100
    }
});


export default RouteCreatorComponent;

function mix(a, b, v)
{
    return (1-v)*a + v*b;
}
function hsvToRgb(H, S, V){
    console.log(H, S, V)

    var V2 = V * (1 - S);
    var r  = ((H>=0 && H<=60) || (H>=300 && H<=360)) ? V : ((H>=120 && H<=240) ? V2 : ((H>=60 && H<=120) ? mix(V,V2,(H-60)/60) : ((H>=240 && H<=300) ? mix(V2,V,(H-240)/60) : 0)));
    var g  = (H>=60 && H<=180) ? V : ((H>=240 && H<=360) ? V2 : ((H>=0 && H<=60) ? mix(V2,V,H/60) : ((H>=180 && H<=240) ? mix(V,V2,(H-180)/60) : 0)));
    var b  = (H>=0 && H<=120) ? V2 : ((H>=180 && H<=300) ? V : ((H>=120 && H<=180) ? mix(V2,V,(H-120)/60) : ((H>=300 && H<=360) ? mix(V,V2,(H-300)/60) : 0)));

    console.log('created: ', r*255,g*255,b*255 )
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
};}