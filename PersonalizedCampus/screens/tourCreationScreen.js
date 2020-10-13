import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert } from 'react-native';
import 'react-native-gesture-handler';
import globalStyles from '../styles';
import Button from '../components/button'
import * as Location from 'expo-location'
import DrawerHeader from '../components/drawerHeader'
import firebase, { auth } from 'firebase';
import TourSetupComponent from '../components/tourSetup'
import RouteCreationComponent from '../components/routeCreator'

const TourCreationScreen = props => {
    const [tourData, setTourData] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [userID, setUserID] = useState(''); 
    const [location, setLocation] = useState(null);
    useEffect(() => {getuserID() });

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

    const getuserID = () => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // user is not logged in 
                setUserID(user.uid)
            } else {
                setUserID(null)
            }
        })
    }

    const createTour = async (data) => {
        if (data.anchor == null || data.anchor == undefined) {
            Alert.alert('Please set an Anchor point for the tour')
        } else if (data.title == null || data.title == undefined || data.title == '') {
            Alert.alert('Please set a tour area title')
        } else 
        {
            try {
                setTourData(data)
                console.log(data.title, data.anchor, data.anchor.latitude, data.anchor.longitude)
                firebase.database().ref('/tours/' + userID )
                .push({
                    tourName: data.title,
                    owner: userID, // Redundant
                    createdAt: Date.now(),
                    lastModified: Date.now(),
                    anchor: data.anchor,
                })
                
            } catch (e) {
                Alert.alert(e.message)
                console.error(e.message)
            }
        }
    }

    const createRoute = async (data) => {
        try {
            setRouteData(data)
            console.log(data.title, data.nodes)
            console.log('Tour name: ', data.title)
            // We need to query Firebase for a tour with the area name we set and the current user ID

            // Reference /tours/ then the child node will be this user's ID
            // Get all the tour areas this user owns and order by tourName
            // find the one where this user's tourName === the one we're working with
            // then, in a then() because this runs off of an async promise
            // insert the tour route

            firebase.database().ref('/tours/' + userID + '/' )
            .orderByChild('tourName').equalTo(data.title).once('value')
            .then(function(snapshot) 
            {
                console.log('SNAPSHOT RESULTS FOR \"' + data.title + '\": ',snapshot)
                var childKey = null;
                snapshot.forEach(function(childSnapshot) { // I hate this. We have to do this because the key is dynamic from push()
                    childKey = childSnapshot.key
                })
                if (childKey != null)
                {
                    // Now that we have that we need to write this route to it
                    firebase.database().ref('/tours/' + userID + '/' + childKey + '/routes/' )
                    .push({
                        routeName: data.title, 
                        createdAt: Date.now(),
                        lastModified: Date.now(),
                        nodes: data.nodes,
                    })
                    .then(
                        Alert.alert('Successfully saved!')
                    )
                }
            })
            
        } catch (e) {
            Alert.alert(e.message)
            console.error(e.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <DrawerHeader name="Create a Tour" openDrawer={props.navigation.openDrawer}/>
        <View style={styles.internalContainer}>
            {tourData === null && <TourSetupComponent submitTour={createTour} location={location} />}
            {tourData != null && <RouteCreationComponent createRoute={createRoute} location={location} />}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 25,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    internalContainer: {
        height: '100%',
        alignItems: 'center',
    }
});


export default TourCreationScreen;