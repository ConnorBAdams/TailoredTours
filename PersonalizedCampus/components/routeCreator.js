import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import globalStyles from '../styles'
import Button from '../components/button'
import MapComponent from './map'

const RouteCreatorComponent = props => {
    const [tourName, setTourName] = useState(null)
    const [userID, setUserID] = useState(null)
    const [location, setLocation] = useState(null)
    const [tourTitle, setTourTitle] = useState(null)
    const [nodes, setNodes] = useState([])
    const navigation = useNavigation();

	useEffect(() => {
        if (props.location != null) {
            setLocation(props.location);
            console.log(props.location);
        }
        if (props.tourName != null) {
            setTourName(props.tourName);
            console.log(props.tourName);
        }
        if (props.userID != null) {
            setUserID(props.userID);
            console.log(props.userID);
        }
    });
    
    const isValidTourData = text => {
        setTourTitle(text)
    }

    const createNode = (e) => {
        if (nodes.length > 0) {
            setNodes([...nodes, {type:'Node', name:'Name me', description:'Tap on me to name me', latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
        } else {
            setNodes([{type:'Node', name:'Name me', description:'Tap on me to name me', latitude:e.nativeEvent.coordinate.latitude, longitude:e.nativeEvent.coordinate.longitude}])
        } 
   }

   const createRoute = (e) => {
        if (props.createRoute(e)) {
            setTourTitle('')
            setNodes([])
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
            <Button title="Create Tour Route" onPress={() => {createRoute({title:tourTitle, nodes:nodes})}} />
            <Button title="Finalize Tour" onPress={() => navigation.navigate('Finalize Tour', {tourName: tourName, userID: userID})}/> 
            {/* The point of the button above is to then send the user to a screen to insert a picture
                that will be used for the list display as well as a radio button to ask if the tour
                is private or public if the user is verified. Was odd that "finishing" the tour meant you 
                had to click away. I would think clicking away would delete it all so def need a button. */}
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
        height: 300,
      },
      titleText: {
          fontSize: 20,
          marginTop: 15
      },
});


export default RouteCreatorComponent;