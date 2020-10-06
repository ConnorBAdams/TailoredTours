import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import Button from './button'
import globalStyles from '../styles'

// Creating this component to serve as a plug and play way of logging people in

const LoginModule = props => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    // Not sure if storing passwords this way is problematic from a security standpoint

    return (
        <View style={styles.container}>
            <TextInput style={globalStyles.inputField}
                label="Email"
                placeholder="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail(text)}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                // onSubmitEditing={() => this.secondInput.focus()}
            />
            <TextInput style={globalStyles.inputField}
                // ref={ref => { this.secondInput = ref; }}
                label="Password"
                placeholder="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword(text)}
                secureTextEntry={true}
            />
            <Button title="Log in" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    }
});


export default LoginModule;