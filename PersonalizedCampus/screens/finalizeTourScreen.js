import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, SafeAreaView, View, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import firebase from 'firebase'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { CardStyleInterpolators } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import DrawerHeader from '../components/drawerHeader'
const Drawer = createDrawerNavigator();

const FinalizeTourScreen = props => {
    var default_image = require('../assets/default_thumbnail.png');
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = React.useState(null);


    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        console.log(pickerResult);
        if (pickerResult.cancelled === true) {
            return;
        }

        setSelectedImage({ localUri: pickerResult.uri });
    };

    const setImageToDefault = () => {
        setSelectedImage(null);
    };

    const no_img_selected = <Image 
                                source={default_image} 
                                style={styles.thumbnail} 
                            />

    return (
      <SafeAreaView style={styles.container}>
        <DrawerHeader name="Finalize Tour" openDrawer={props.navigation.openDrawer}/>
            <View style={styles.internalContainer}>
                <View style={styles.container}>
                    <Text style={styles.text}>Select a photo for your tour or use the default image.</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.text}>Currently selected image:</Text>
                    {selectedImage !== null ? 
                        <Image 
                            source={{uri: selectedImage.localUri}} 
                            style={styles.thumbnail} 
                        /> : no_img_selected}
                    <Button title="Pick a photo" onPress={openImagePickerAsync} />
                    <Button title="Use default" onPress={setImageToDefault} />
                </View>
                <View style={styles.container} style={{marginTop:40}}>
                    <Button title="Finish tour" />
                </View>
            </View>
      </SafeAreaView>
    
    );
}

const styles = StyleSheet.create({
  container: {
      paddingTop: 25,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      },
  internalContainer: {
      height: '100%',
      alignItems: 'center',
      justifyContent: 'flex-start',
      },
  header:{
      width:"100%",
      height:60,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingHorizontal:20
  },
  item: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 7,
      padding: 10,
      margin: 5,
      elevation: 2,
      width: 350,
  },
  text: {
    fontSize: 16,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop: 10,
    marginBottom: 10,
  },
});

export default FinalizeTourScreen;