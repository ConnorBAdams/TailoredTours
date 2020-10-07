import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Button from './button';
import globalStyles from '../styles';
import firebase from 'firebase';
import {androidClientId, iosClientId} from '../config'

const ManualCreateAccountModule = props => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    const verifyPasswords = () => {
        // TODO: This functions needs to verify the account creation passwords
        // They need to be secure enough and match
    }

    return (
        <View style={props.style, styles.container}>
            <Text style={styles.modalText}>Create Account</Text>
            <TextInput style={globalStyles.inputField}
                placeholder="Email" 
                autoCompleteType='username'
                textContentType='username'
                onChangeText={text => setUsername(text) }/>
            <TextInput style={globalStyles.inputField}
                placeholder="Password" 
                autoCompleteType='password'
                textContentType='password'
                secureTextEntry={true}
                onChangeText={text => setPassword(text)} />
            <TextInput style={globalStyles.inputField}
                placeholder="Confirm Password" 
                autoCompleteType='password'
                textContentType='password'
                secureTextEntry={true}
                onChangeText={text => setPassword(text)} />
            <Button title="Create Account" onPress={() => {}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 25,
        textAlign: 'center',
    },
});


export default ManualCreateAccountModule;