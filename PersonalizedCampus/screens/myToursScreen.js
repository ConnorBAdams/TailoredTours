import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import DrawerHeader from '../components/drawerHeader'
import MarkerEditorComponent from '../components/markerEditor'
import firebase, { auth } from 'firebase';

const MyToursScreen = props => {
    useEffect(() => {getuserID() });

    const [userID, setUserID] = useState('');
    const [tours, setTours] = useState([]);
    const DATA = [{ id: '-MJ9vKKNx8ugbPp9TlMc', title: 'ZacTour1' }, 
    { id: '-MJ9vLCbKp7rNC0-KOPe', title: 'ZacTour2' },
    { id: '-MJ9vLuuZG5PE0ZDo75z', title: 'ZacTour3' }];
    //const DATA = []

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
        if (!userID) {
            console.log('Not logged in');
            return;
        } else {
            var arr = [];
            const tours_str = '/tours/' + userID;
            firebase.database().ref(tours_str).on('child_added', function(snapshot) {
                arr.push({tourId: snapshot.key, tourName: snapshot.child('tourName')});
            });
            setTours(arr);
            console.log(tours);
            //console.log(DATA);
        }
    }

    const Item = ({ item, onPress, style }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, style]}>
            <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
    );
    
    const [selectedId, setSelectedId] = useState(null);

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

    const toursNotFound = <Text style={{fontSize: 24}}>No tours found.</Text>
    const toursFound =  <FlatList
                            data={DATA}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            extraData={selectedId}
                        />

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name="My Tours" openDrawer={props.navigation.openDrawer}/>
            <View style={styles.internalContainer}>
                {DATA.length == 0 ? toursNotFound : toursFound}
                <Button title="Get Tours" onPress={() => getTours()} />
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
        justifyContent: 'center',
        },
    header:{
        width:"100%",
        height:60,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20
    },
    item: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
        margin: 5,
        elevation: 2,
        width: 350,
    },
    title: {
        fontSize: 32,
    },
});


export default MyToursScreen;