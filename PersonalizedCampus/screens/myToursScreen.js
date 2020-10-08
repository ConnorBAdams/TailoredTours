import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import 'react-native-gesture-handler';
import SignOutModule from '../components/signOut'
import Button from '../components/button'
import DrawerHeader from '../components/drawerHeader'

const MyToursScreen = props => {
    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name="My Tours" openDrawer={props.navigation.openDrawer}/>
            <View style={styles.internalContainer}>
            <Text> This is a placeholder my tours</Text>
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


export default MyToursScreen;