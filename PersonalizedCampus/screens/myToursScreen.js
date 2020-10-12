import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native';
import 'react-native-gesture-handler';
import DrawerHeader from '../components/drawerHeader'
import MarkerEditorComponent from '../components/markerEditor'

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
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        }
});


export default MyToursScreen;