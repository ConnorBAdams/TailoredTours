import React, {useState} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import Button from './button';
import globalStyles from '../styles';
import * as Google from 'expo-google-app-auth';
import firebase, { auth } from 'firebase';
import {androidClientId, iosClientId} from '../config'

const ManualLoginModule = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 

    const manualLogin = async () => {
        if (!email ){
            return
        } else if (!password) {
            return
        } else {
            try
            {
                let response = await auth().signInWithEmailAndPassword(email, password)
                console.log(response)
                if (response.user) {
                    firebase.database().ref('/users/' + result.user.uid).update({
                        last_logged_in: Date.now()
                    })
                }
            } catch (e) {
                Alert.alert(e.message)
                console.log(e)
            }

        }
    }

    return (
        <View style={props.style, styles.container}>
            <Text style={styles.modalText}>Log In</Text>
            <TextInput style={globalStyles.inputField}
                placeholder="Email" 
                autoCompleteType='username'
                textContentType='username'
                onChangeText={text => setEmail(text) }/>
                <TextInput style={globalStyles.inputField}
                placeholder="Password" 
                autoCompleteType='password'
                textContentType='password'
                secureTextEntry={true}
                onChangeText={text => setPassword(text)} />
                <Button title="Log in" onPress={() => manualLogin()} />
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


export default ManualLoginModule;