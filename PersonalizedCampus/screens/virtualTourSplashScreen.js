import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader';
import Button from '../components/button';
import firebase, { auth } from 'firebase';
import { Picker } from '@react-native-community/picker';

const VirtualTourSplashScreen = props => {    
    const [tour, setTour] = useState(null)
    const [tourName, setTourName] = useState(null)
    const [tourThumbnail, setTourThumbnail] = useState(null);
    const [selectedRoute, setSelectedRoute] = useState(0);
    const [routeNames, setRouteNames] = useState([]);
    const [routeDesc, setRouteDesc] = useState([]);
    const default_image = require("../assets/default_thumbnail.png");
    const [queryComplete, setQueryComplete] = useState(false);

    // Setting these values manually for testing purposes
    const userID = 'PwmdxqoTkecZs9zT6cYmwnZ7g333';
    const tourID = '-MNUzjNunc15Im9gO-NT';

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
            setTour(snapshot);
            setTourName(snapshot.child('tourName').val());
            setTourThumbnail(snapshot.child('thumbnail').val());
            const tempRoutes = snapshot.child('routes').val();
            setRouteNames(tempRoutes.map((tempRoute) => tempRoute['name']));
            setRouteDesc(tempRoutes.map((tempRoute) => tempRoute['description']));
            setQueryComplete(true);
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
    
    const no_img_selected = (
        <Image source={default_image} style={styles.thumbnail} />
    );

    const debug = () => {
        //console.log(tour)
        //console.log(tour.child('tourName').val());
        console.log('BEGIN DEBUG');
        //console.log(routeNames);
        //console.log(routeDesc);
        console.log(selectedRoute)
        //console.log(routes.length)
        console.log('END DEBUG');
        //const mapped = routes.map((route) => route.child('name').val());
        //console.log(mapped);
    }

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name='Take Virtual Tour' openDrawer={(props.navigation != null) ? props.navigation.openDrawer : false} />
            <View style={styles.internalContainer}>
                <View style={styles.imageSelectionContainer}>
                    <Text style={styles.title}>Tour selected: {queryComplete == false ? 'Loading...' : tourName}</Text>
                    <View style={styles.imageHolder}>
                        {queryComplete == true && tourThumbnail !== null && tourThumbnail !== 'default' ? (
                            <Image
                                source={{ uri: 'data:image/jpeg;base64,' + tourThumbnail }}
                                style={styles.thumbnail}
                            />
                        ) : (
                                no_img_selected
                            )}
                    </View>
                    <Text style={styles.title}>Route selected: </Text>
                    <Picker
                        selectedValue={selectedRoute}
                        style={{height: 50, width: 250}}
                        onValueChange={(itemValue, itemIndex) => 
                            setSelectedRoute(itemValue)
                        }>
                        {queryComplete == false ? 
                            <Picker.Item label='Loading routes...' value={0} /> 
                            :
                            routeNames.map((name, key) => {
                                return (
                                    <Picker.Item label={name} value={key} />
                                );
                            })
                        }
                    </Picker>
                    <Text style={styles.title}>Route description: </Text>
                    <Text style={styles.description}>
                        {queryComplete == false ?
                            'Loading description...'
                            :
                            routeDesc[selectedRoute]
                        }
                    </Text>
                    <Button title='Begin virtual tour' onPress={() => debug()}></Button>
                </View>
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
        fontSize: 20,
    },
    tourImg: {
        width: 75,
        height: 75,
        borderRadius: 10
    },
    thumbnail: {
        height: 250,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    imageSelectionContainer: {
        margin: 25,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderColor: '#4633af',
        borderWidth: 2,
        width: Dimensions.get('window').width * 0.75
    },
    description: {
        fontSize: 16,
    },
});


export default VirtualTourSplashScreen;