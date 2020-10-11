import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert } from 'react-native';
import 'react-native-gesture-handler';
import globalStyles from '../styles';
import Button from '../components/button'
import DrawerHeader from '../components/drawerHeader'
import firebase, { auth } from 'firebase';
import TourSetupComponent from '../components/tourSetup'
import RouteCreationComponent from '../components/routeCreator'

const TourCreationScreen = props => {
    const [tourData, setTourData] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [userID, setUserID] = useState(''); 
    useEffect(() => {getuserID() });

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

    const createRoute = async (data) => {
        try {
            setRouteData(data)
            console.log(data.title, data.nodes)
            console.log('Tour name: ', tourData.title)
            // We need to query Firebase for a tour with the area name we set and the current user ID

            // Reference /tours/ then the child node will be this user's ID
            // Get all the tour areas this user owns and order by tourName
            // find the one where this user's tourName === the one we're working with
            // then, in a then() because this runs off of an async promise
            // insert the tour route

            firebase.database().ref('/tours/' + userID + '/' )
            .orderByChild('tourName').equalTo(tourData.title).once('value')
            .then(function(snapshot) 
            {
                console.log('SNAPSHOT RESULTS FOR \"' + tourData.title + '\": ',snapshot)
                var childKey = null;
                snapshot.forEach(function(childSnapshot) { // I hate this. We have to do this because the key is dynamic from push()
                    childKey = childSnapshot.key
                })
                if (childKey != null)
                {
                    // Now that we have that we need to write this route to it
                    firebase.database().ref('/tours/' + userID + '/' + childKey )
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
            {tourData === null && <TourSetupComponent submitTour={createTour} />}
            {tourData != null && <RouteCreationComponent createRoute={createRoute} />}
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
    },
    header:{
        width:"100%",
        height:60,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20
    }
});


export default TourCreationScreen;