import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader'
import Button from '../components/button'
import firebase, { auth } from 'firebase';

const MyToursScreen = props => {    
    const [userID, setUserID] = useState(null);
    const [tours, setTours] = useState([]);
    const default_image = require('../assets/default_thumbnail.png');

    useEffect(() => {getuserID();}, []);
    useEffect(() => {getTours();});

	const navigation = useNavigation();

    const getuserID = () => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setUserID(user.uid)
            } else {
                setUserID(null)
            }
        })
    }

    const getTours = () => {    
        if (userID != null) {
            const tours_str = '/tours/' + userID;
            firebase.database().ref(tours_str).once('value', function(snapshot) {
                var arr = [];
                console.log('Processing snapshot of user tour data')
                snapshot.forEach(element => { 
                    arr.push({id:element.key, title:element.child('tourName').val(), thumbnail:element.child('thumbnail').val()});})
                if (arr.length > tours.length)
                {
                    setTours(arr);
                }
                console.log('done')
            })
        }
    }

    const elementPressed = item => {
        navigation.navigate('EditScreen', 
        {tourID: item.id,
        userID: userID})
    }
    const Item = ({ item, onPress, style }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <Image 
                style = {styles.tourImg}
                source = {item.thumbnail == 'default' ? default_image : {uri: 'data:image/jpeg;base64,' + item.thumbnail}}
            />
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );
    

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#2b5687" : "#2380eb";

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                style={{ backgroundColor }}
            />
        );
    };

    const toursNotFound = /*<ActivityIndicator size='large' />*/ <Text style={{fontSize: 24}}>No tours found.</Text>
    const toursFound =  <FlatList
                        data={tours}
                        renderItem={Item}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingBottom: 200}}
                        />

    return (
        <SafeAreaView style={styles.container}>
        <DrawerHeader name="My Tours" openDrawer={props.navigation.openDrawer}/>
        <View style={styles.internalContainer}>
            {tours.length == 0 ? toursNotFound : toursFound}
        </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
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
        width: 100,
        height: 100,
    },

});


export default MyToursScreen;