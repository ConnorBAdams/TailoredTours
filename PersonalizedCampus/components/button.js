import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import globalStyles from '../styles'

const Button = props => {
    return (
        <TouchableOpacity style={[globalStyles.touchableOpacity, props.buttonStyle]} onPress={props.onPress} >
            <Text style={[globalStyles.touchableOpacityText, props.textStyle]}>{props.title}</Text>
        </TouchableOpacity>
    );
}

export default Button;