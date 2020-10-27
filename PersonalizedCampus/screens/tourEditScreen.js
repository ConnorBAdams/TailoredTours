import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';
import DrawerHeader from '../components/drawerHeader'
import TourEditorModule from '../components/tourEditor'
import globalStyles from '../styles'
import firebase from 'firebase'

const TourEditScreen = props => {
    useEffect(() => {
        if (tour!=null && tour.key != props.route.params.tourID) {setTour(null)} // doing this for state timing, kinda
        if(tour==null) {
            getTour()
        }
    });
    const [tour, setTour] = useState(null)

    const processSnapshot = snapshot => {
        if (snapshot != null) {
            setTour(snapshot)
        }
    }

    const getTour = () => {    
        console.log('Getting tour')
        try
        {
            if (props.route.params.userID != null) {
                const tour_str = '/tours/' + props.route.params.userID + '/' + props.route.params.tourID;
                firebase.database().ref(tour_str).once('value', function(snapshot) {
                    console.log('tourEditScreen received data', snapshot.child('tourName').val())
                    processSnapshot(snapshot)
                })
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name={(tour!=null)?tour.child('tourName').val():''} openDrawer={props.navigation.openDrawer}/>
            <View style={styles.internalContainer}>
            <TourEditorModule tour={tour} navigation={props.navigation} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },    
    internalContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});


export default TourEditScreen;