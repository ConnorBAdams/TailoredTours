import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader'
import Button from '../components/button'
import firebase, { auth } from 'firebase';

const VirtualTourScreen = props => {    
    const [tour, setTour] = useState(null)

    // Setting these values manually for testing purposes
    const userID = 'PwmdxqoTkecZs9zT6cYmwnZ7g333';
    const tourID = '-MNQNjP-mbH-4m3suOjF';

    useEffect(() => {
        if (tour != null && tour.key != tourID) 
        {setTour(null)} // doing this for state timing, kinda
        else if(tour == null) {
            console.log('null tour, getting it from firebase')
            getTour()
        }
    });

    const processSnapshot = snapshot => {
        if (snapshot != null) {
            setTour(snapshot)
        }
    }

    const getTour = () => {    
        console.log('Getting tour')
        try
        {
            if (userID != null) {
                const tour_str = '/tours/' + userID + '/' + tourID;
                firebase.database().ref(tour_str).once('value', function(snapshot) {
                    // console.log('tourEditScreen received data', snapshot.child('tourName').val())
                    console.log(snapshot);
                    processSnapshot(snapshot);
                })
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <DrawerHeader name="Virtual Tour" openDrawer={(props.navigation != null)? props.navigation.openDrawer : false}/>            
            <View style={styles.internalContainer}>
                <Text>Virtual Tour placeholder</Text>
            </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 110 
        },
    internalContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        },
    header:{
        width:"100%",
        height:60,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20,
    },
    itemIcon: {
        height: 50,
        width: 50
    },
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        borderRadius: 7,
        padding: 20,
        margin: 5,
        elevation: 2,
        width: 350,
        backgroundColor: '#00c9db'
    },
    title: {
        fontSize: 28,
    },
    tourImg: {
        width: 75,
        height: 75,
        borderRadius: 10
    },

});


export default VirtualTourScreen;