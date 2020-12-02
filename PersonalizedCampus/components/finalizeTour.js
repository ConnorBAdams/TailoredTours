import React, { useState, useEffect } from 'react';
import { Image, TouchableOpacity, StyleSheet, SafeAreaView, View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import firebase from 'firebase'
import { RadioButton } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import 'react-native-gesture-handler';

const Drawer = createDrawerNavigator();

const FinalizeTourScreen = props => {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const default_image = require('../assets/default_thumbnail.png');
    const navigation = useNavigation();
    const [publicTour, setPublic] = useState('false');

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({base64: true});
        console.log(pickerResult);
        if (pickerResult.cancelled === true) {
            return;
        }

        setSelectedImage({ localUri: pickerResult.uri, base64: pickerResult.base64 });
    };

    const setImageToDefault = () => {
        setSelectedImage(null);
    };

    const finishTour = async () => {
        if (selectedImage == null) {
            props.finishTour({selectedImage: 'default', publicTour: publicTour})
        } else {
            props.finishTour({selectedImage: selectedImage.base64, publicTour: publicTour})
        }
        return;
        try {
            console.log(userID);
            console.log(tourName);
            firebase.database().ref('/tours/' + userID + '/' )
            .orderByChild('tourName').equalTo(tourName).once('value')
            .then(function(snapshot) 
            {
                var childKey = null;
                snapshot.forEach(function(childSnapshot) {
                    console.log(childSnapshot)
                    childKey = childSnapshot.key
                })
                firebase.database().ref('/tours/' + userID + '/' + childKey + '/')
                .child('thumbnail').set(selectedImage.base64)
                .then(function(success)
                {
                    Alert.alert('Tour created successfully!');
                    props.navigation.popToTop();
                    return;
                })
            })
        } catch (e) {
            Alert.alert(e.message)
            console.error(e.message)
        }
    }

    const no_img_selected = <Image 
                                source={default_image} 
                                style={styles.thumbnail} 
                            />

    return (
      <SafeAreaView style={styles.container}>
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
                <View style={styles.container}>
                    <View style={styles.buttons}>
                        <Text>Private</Text>
                        <RadioButton.Android
                            value = 'false'
                            label = 'Private'
                            status = { publicTour == 'false' ? 'checked' : 'unchecked' }
                            onPress = { () => setPublic('false') }
                        />
                        <Text style={{marginLeft: 10}}>Public</Text>
                        <RadioButton.Android
                            value = 'true'
                            label = 'Public'
                            status = { publicTour == 'true' ? 'checked' : 'unchecked' }
                            onPress = { () => setPublic('true') }
                        />
                    </View>
                </View>
                <View style={styles.container} style={{marginTop:40}}>
                    <Button title="Finish tour" onPress={finishTour} />
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
    buttons: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    internalContainer: {
        height: '105%',
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
        width: 175,
        height: 175,
        resizeMode: "contain",
        marginTop: 10,
        marginBottom: 10,
    },
});

export default FinalizeTourScreen;