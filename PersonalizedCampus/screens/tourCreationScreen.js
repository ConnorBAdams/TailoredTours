import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Alert } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import globalStyles from '../styles';
import Button from '../components/button'
import DrawerHeader from '../components/drawerHeader'
import firebase, { auth } from 'firebase';

const TourCreationScreen = props => {
    useEffect(() => {getuserID() });

    const [tourTitle, setTourTitle] = useState('');
    const [userID, setUserID] = useState(''); 

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

    const isValidTourData = () => {
        if (!tourTitle) {
            return false
        } else {
            return true
        }
    }


    const createTour = async () => {
        try {
            if(isValidTourData())
            {
                firebase.database().ref('/tours/' )
                .push({
                    tourName: tourTitle,
                    owner: userID,
                    createdAt: Date.now(),
                    lastModified: Date.now(),
                    nodes: []
                })
            }
        } catch (e) {
            Alert.alert(e.message)
            console.error(e.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <DrawerHeader name="Home" openDrawer={props.navigation.openDrawer}/>
        <View style={styles.internalContainer}>
        <TextInput style={globalStyles.inputField}
        placeholder="Tour Name"
        onChangeText={text => setTourTitle(text)} />
        <Text> This is a placeholder for logged in, probably should just be map screen</Text>
        <Text>Thinking of showing tour creator, created tour stats, and some other info accessible through a side nav panel</Text>
        <Button title="Create tour" onPress={() => {createTour()}} />
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
        flex: 1,
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
    }
});


export default TourCreationScreen;