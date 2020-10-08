import React from 'react';
import { StyleSheet, Image, View, TouchableOpacity, TextInput } from 'react-native';
import Button from './button';
import globalStyles from '../styles';
import firebase from 'firebase';

const SignOutModule = props => {

    return (
        <View style={props.style}>
            <Button title='Sign out' onPress={() => firebase.auth().signOut()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});


export default SignOutModule;