import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import firebase from 'firebase'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { CardStyleInterpolators } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import DrawerHeader from '../components/drawerHeader'
const Drawer = createDrawerNavigator();

const FinalizeTourScreen = props => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={styles.container}>
        <DrawerHeader name="Finalize Tour" openDrawer={props.navigation.openDrawer}/>
            <View style={styles.internalContainer}>
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

export default FinalizeTourScreen;