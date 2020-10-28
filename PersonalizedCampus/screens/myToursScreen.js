import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import 'react-native-gesture-handler';
import DrawerHeader from '../components/drawerHeader'
import Button from '../components/button'
import firebase, { auth } from 'firebase';

const MyToursScreen = props => {    
    const [selectedId, setSelectedId] = useState(null);
    const [userID, setUserID] = useState(null);
    const [tours, setTours] = useState([]);

    useEffect(() => {getuserID();}, []);
    useEffect(() => {getTours();});

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
                console.log(snapshot)
                snapshot.forEach(element => { 
                    arr.push({id:element.key, title:element.child('tourName').val(), thumbnail:element.child('thumbnail').val()});})
                if (arr.length > tours.length)
                {
                    setTours(arr);
                    console.log(arr)
                }
                console.log('done')
            })
        }
    }

    const Item = ({ item, onPress, style }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <Image 
                style = {styles.tourImg}
                source = {{uri: item.thumbnail}}
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

    const toursNotFound = <ActivityIndicator size='large' /> //<Text style={{fontSize: 24}}>No tours found.</Text>
    const toursFound =  <FlatList
                            data={tours}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedId} />

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
        paddingTop: 25,
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
    item: {
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 7,
        padding: 20,
        margin: 5,
        elevation: 2,
        width: 350,
        flexDirection: 'row',
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