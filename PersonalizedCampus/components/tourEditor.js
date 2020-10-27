import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, ActivityIndicator } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import MapComponent from '../components/map'
import firebase from 'firebase'

const TourEditorModule = props => {

    // if the tour is null then show this while it loads
    if (props.tour == null){
        return (
            <View style={styles.internalContainer}>
            <ActivityIndicator size='large' />
            <Text>Loading...</Text>
        </View>
        );
    }

    // otherwise render this
    return (
        <View style={styles.internalContainer}>
            <Text>Loading: {props.tour.key} for user: {props.tour.child('owner').val()}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },    
    internalContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default TourEditorModule;
