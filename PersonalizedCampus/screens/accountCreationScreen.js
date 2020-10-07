import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import Button from '../components/button'
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles'

const AccountCreationScreen = props => {
    const navigation = useNavigation();
    const [FName, setFName] = useState('');
    const [LName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 

    return (
    <View style={styles.container}>
        <Text style={{marginBottom:'5%'}}>We'll need some information to create your account.</Text>
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
            // ref={ref => { this.thirdInput = ref; }}
            label="Email"
            placeholder="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={text => setEmail(text)}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            // onSubmitEditing={() => this.fourthInput.focus()}
        />
        <TextInput style={globalStyles.inputField}
            // ref={ref => { this.fourthInput = ref; }}
            label="Password"
            placeholder="Password"
            returnKeyType="next"
            value={password.value}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
            // onSubmitEditing={() => this.fifthInput.focus()}
        />
        <TextInput style={globalStyles.inputField}
            // ref={ref => { this.fifthInput = ref; }}
            label="confirmPassword"
            placeholder="Confirm password"
            returnKeyType="done"
            value={confirmPassword.value}
            onChangeText={text => setConfirmPassword(text)}
            secureTextEntry={true}
        />
        <Button title='Create account' />
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
  button: {
    flex: 1,
    marginBottom: '15%',
    alignContent: 'center',
  }
});


export default AccountCreationScreen;