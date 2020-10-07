import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Button from './button';
import globalStyles from '../styles';
import firebase, { auth } from 'firebase';
import {androidClientId, iosClientId} from '../config'

const ManualCreateAccountModule = props => {
    const [FName, setFName] = useState('');
    const [LName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    const verifyPasswords = () => {
        if (password != confirmPassword) {
            return false
        } // TODO: Regex verification, they need to be secure enough and match
        return true
    }

    const validEmail = () => {
        if (!email) {
            return false
        } // TODO: Regex verification
        return true 
    }

    const createAccount = async () => {
        if (!validEmail) {
            return
        } else if (!verifyPasswords) {
            return
        } else {
            try {
                let response = await auth().createUserWithEmailAndPassword(email, password)
                console.log(response)
                if(response.additionalUserInfo.isNewUser)
                {
                    firebase.database().ref('/users/' + response.user.uid)
                    .set({
                        email: response.user.email,
                        first_name: FName,
                        last_name: LName,
                        created_at: Date.now(),
                        last_logged_in: Date.now()
                    })
                }
            } catch (e) {
                console.error(e.message)
            }
        }
    }

    return (
        <View style={props.style, styles.container}>
            <Text style={styles.modalText}>Create Account</Text>
            <TextInput style={globalStyles.inputField}
                label="FName"
                placeholder="First name"
                returnKeyType="next"
                value={FName.value}
                onChangeText={text => setFName(text)}
                autoCapitalize="words"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="default"
                // onSubmitEditing={() => this.secondInput.focus()}
            />
            <TextInput style={globalStyles.inputField}
                // ref={ref => { this.secondInput = ref; }}
                label="LName"
                placeholder="Last name"
                returnKeyType="next"
                value={LName.value}
                onChangeText={text => setLName(text)}
                autoCapitalize="words"
                autoCompleteType="name"
                textContentType="name"
                keyboardType="default"
                // onSubmitEditing={() => this.thirdInput.focus()}
            />
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
            <TextInput style={globalStyles.inputField}
                placeholder="Confirm Password" 
                autoCompleteType='password'
                textContentType='password'
                secureTextEntry={true}
                onChangeText={text => setConfirmPassword(text)} />
            <Button title="Create Account" onPress={() => createAccount()} />
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