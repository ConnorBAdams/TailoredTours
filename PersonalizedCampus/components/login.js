import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput } from 'react-native';
import Button from './button'
import GoogleLoginModule from './googleLogin'
import ManualLoginModule from './maualLogin';
import ManualCreateAccountModule from './manualCreateAccount';
import globalStyles from '../styles'

// Creating this component to serve as a plug and play way of logging people in

const LoginModule = props => {
    const [createAccount, setCreateAccount] = useState(false);

    // Not sure if storing passwords this way is problematic from a security standpoint

    return (
        <View style={styles.container}>
            <View style={styles.modalContainer}>
            <View style={styles.modalView}>
                {!createAccount && <ManualLoginModule /> || 
                createAccount && <ManualCreateAccountModule /> }
                {/* Confirm log in or acc creation */}
                <Text style={{marginTop:'10%'}}>Or maybe</Text>
                <GoogleLoginModule style={{marginTop: '5%'}} />
            </View>
            </View>
            <View style={styles.conditionalConfirmation}>
                {/* Switch between create and log in */}
                {!createAccount &&  <Text>Don't have an account?</Text>  || 
                createAccount && <Text>Already have an account?</Text> }
                
                {!createAccount &&  <Button title="Create account" onPress={() => {setCreateAccount(!createAccount)}} />  || 
                createAccount && <Button title="Log in" onPress={() => {setCreateAccount(!createAccount)}} /> }
                
                {/* TODO: Password reset feature */}
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 22,
    },
    modalContainer: {
        height: '70%'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 25,
        textAlign: 'center',
    },
    conditionalConfirmation: {
        alignItems: 'center',
        alignContent: 'center',
        textAlign: 'center',
        marginTop: '20%',
    }
});


export default LoginModule;