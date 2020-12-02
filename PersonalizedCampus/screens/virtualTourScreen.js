import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader';
import Button from '../components/button';
import firebase, { auth } from 'firebase';
import { Picker } from '@react-native-community/picker';

const VirtualTourScreen = props => {    
    const [tour, setTour] = useState(null)
    const [route, setRoute] = useState(null);
    const [queryComplete, setQueryComplete] = useState(false);

    useEffect(() => {
        setTour(props.route.params.tour);
        setRoute(props.route.params.route);
        setQueryComplete(true);
    });

    const debug = () => {
        console.log(tour);
        console.log(route)
    }

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name='Take Virtual Tour' openDrawer={(props.navigation != null) ? props.navigation.openDrawer : false} />
            <View style={styles.internalContainer}>
                <Text>Virtual tour placeholder</Text>
                <Button title='Debug' onPress={() => debug()}></Button>
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


export default VirtualTourScreen;