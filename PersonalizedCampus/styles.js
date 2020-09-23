import { StyleSheet } from 'react-native';

// This file is intended to serve as global styling constants
// This is useful for things like touchable opacities and colors

const primaryColor = '#4633af'
const secondaryColor = '#00c9db'
const ternaryColor = '#413d52'

const priamryTextColor = '#fff'

const globalStyles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    touchableOpacity: {
        backgroundColor: secondaryColor,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 7,
        padding: 10,
        margin: 5,
        elevation: 2,
        width: 150,
    },
    touchableOpacityText: {
        color: priamryTextColor
    },
    inputField: {
        margin: 10,
        borderRadius: 5,
        borderColor: secondaryColor,
        borderWidth: 1,
        height: 40,
        width: 150,
    },

});
  
export default globalStyles;