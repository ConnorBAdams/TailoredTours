import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert, TextInput } from 'react-native';
import globalStyles from '../styles'
import Button from '../components/button'
import MapComponent from './map'

const RouteCreatorComponent = props => {
    const [location, setLocation] = useState(null)
    const [tourTitle, setTourTitle] = useState(null)
    const [nodes, setNodes] = useState([]) // array of all nodes
    const [routes, setRoutes] = useState([]) // array of objects which correspond to nodes
    const [wipRoute, setWIPRoute] = useState(null) // the WIP route, moved to routes when confirmed
	useEffect(() => {
        if (props.location != null && location == null){
            setLocation(props.location);
            console.log(props.location);
        }});
    
    const isValidTourData = text => {
        setTourTitle(text)
    }

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
                    nodes: [nodes.length] }) 
            } 
            else {
                setWIPRoute({
                    name: 'Untitled Route',
                    nodes: [...wipRoute.nodes, nodes.length] })
            }
        }
   }

   //TODO: Add existing node to route function
   const addNodeToRoute = (node) => {

   }

   // TODO: Remove a node from all routes and nodes
   const deleteNode = (node) => {

   }


   // TODO: Implement me! I had the route working, now I need a modal
   // or something to get a name, then I need to move WIP into route's list
   // make sure those render properly, maybe figure out deletions? 
   // Nodes need to display what routes they're a part of
   const createRoute = (title) => {
        if (wipRoute.nodes.length == 0) 
            return;
        if (routes.length > 0) {
            setRoutes([...routes, {
                type: 'Route',
                id: routes.length,
                name: title,
                nodes: wipRoute.nodes
            }])
        }
        else {
            setRoutes([{
                type: 'Route',
                id: 0,
                name: title,
                nodes: wipRoute.nodes
            }])
        }
   }

   // TODO: change how these are saving in Mongo
   // need to verify WIP is empty (prompt to save if not)
   // then send routes and nodes to be saved
   // routes will just save the names and references to nodes
   const finished = () => {
       if (wipRoute.length != 0){
           // not finished
       } else {
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
            routes={[wipRoute, ...routes]}
            placementMode={'route'}
            onPress={(e, mode) => createNode(e, mode)} 
            onRouteConfirm={e => createRoute(e)}
            location={location} /> }
            <Button title="Finished" style={styles.submitButton} onPress={() => {createRoute({title:tourTitle, nodes:nodes})}} />
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
    }
});


export default RouteCreatorComponent;