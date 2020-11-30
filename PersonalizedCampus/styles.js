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
        borderRadius: 20,
        padding: 10,
        margin: 5,
        elevation: 2,
        width: 150,
    },
    touchableOpacityText: {
        color: priamryTextColor
    },
    touchableOpacityInverted: {
        borderColor: secondaryColor,
        borderWidth: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        padding: 10,
        margin: 5,
        elevation: 2,
        width: 150,
    },
    touchableOpacityTextInverted: {
        color: secondaryColor
    },
    inputField: {
        margin: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderColor: secondaryColor,
        borderWidth: 1,
        height: 40,
        width: 200,
        paddingHorizontal: 15,
        fontSize: 16,
        textAlignVertical: 'center'
    },

});
  
export default globalStyles;