import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Button from './button'
import globalStyles from '../styles'

// Creating this component to serve as a plug and play way of logging people in

const LoginModule = props => {
    const [modalVisible, setModalVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    // Not sure if storing passwords this way is problematic from a security standpoint

    return (
        <View>
            <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}>
                <TouchableOpacity 
                style={styles.container} 
                activeOpacity={1} 
                onPressOut={() => {setModalVisible(false)}}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Log In</Text>
                    <TextInput style={globalStyles.inputField}
                    placeholder="Username" 
                    autoCompleteType='username'
                    textContentType='username'
                    onChangeText={text => setUsername(text) }/>
                    <TextInput style={globalStyles.inputField}
                    placeholder="Password" 
                    autoCompleteType='password'
                    textContentType='password'
                    secureTextEntry={true}
                    onChangeText={text => setPassword(text)} />
                    <Button title='Submit' onPress={() =>{setModalVisible(false)}} />
                    <Button title='Cancel' onPress={() =>{setModalVisible(false)}} />
                </View>
                </TouchableOpacity>
            </Modal>
        <Button title="Log in" onPress={() => {setModalVisible(true)}} />
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
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 25,
        textAlign: 'center',
    }
});


export default LoginModule;