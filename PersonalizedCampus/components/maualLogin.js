import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Button from './button';
import globalStyles from '../styles';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';
import {androidClientId, iosClientId} from '../config'

const ManualLoginModule = props => {

    isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
            if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                providerData[i].uid === googleUser.getBasicProfile().getId()) {
                // We don't need to reauth the Firebase connection.
                return true;
            }
            }
        }
    return false;
    };
    
    onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
          unsubscribe();
          // Check if we are already signed-in Firebase with the correct user.
          if (!isUserEqual(googleUser, firebaseUser)) {
            // Build Firebase credential with the Google ID token.
            var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
                //googleUser.getAuthResponse().id_token);
            );
            // Sign in with credential from the Google user.
            firebase
            .auth()
            .signInWithCredential(credential)
            .then(async function(result){
                firebase.database().ref('/users/' + result.user.uid)
                .set({
                    email: result.user.email,
                    locale: result.additionalUserInfo.profile.locale,
                    first_name: result.additionalUserInfo.profile.given_name,
                    last_name: result.additionalUserInfo.profile.family_name
                })
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
          } else {
            console.log('User already signed-in Firebase.');
          }
        }.bind(this));
    };

    async function signInWithGoogleAsync() {
        try {
            const result = await Google.logInAsync({
                androidClientId: androidClientId,
                iosClientId: iosClientId,
                scopes: ['profile', 'email'],
        });
      
        if (result.type === 'success') {
            onSignIn(result)
            console.log('successful')
            return result.accessToken;
        } else {
            console.log('returned')
            return { cancelled: true };
        }
        } catch (e) {
            console.log(e)
            return { error: true };
        }
    }

    return (
        <View style={props.style, styles.container}>
            <Text style={styles.modalText}>Log In</Text>
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
                <Button title="Log in" onPress={() => {}} />
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