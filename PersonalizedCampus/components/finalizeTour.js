import React, { useState } from "react";
import {
    Image,
    StyleSheet,
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "../components/button";
import { RadioButton } from "react-native-paper";
import globalStyles from "../styles";

const FinalizeTourScreen = (props) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [privateTour, setPrivateTour] = useState(true);
    const [tourDescription, setTourDescription] = useState("");
    const [tourTags, setTourTags] = useState("");
    const default_image = require("../assets/default_thumbnail.png");

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            quality: 0.8,
        });
        if (pickerResult.cancelled === true) {
            return;
        }

        setSelectedImage({
            localUri: pickerResult.uri,
            base64: pickerResult.base64,
        });
    };

    const setImageToDefault = () => {
        setSelectedImage(null);
    };

    const finishTour = async () => {
        if (selectedImage == null) {
            props.finishTour({
                selectedImage: "default",
                publicTour: !privateTour,
                tourDescription: tourDescription,
                tourTags: tourTags
            });
        } else {
            props.finishTour({
                selectedImage: selectedImage.base64,
                publicTour: !privateTour,
                tourDescription: tourDescription,
                tourTags: tourTags
            });
        }
        return;
    };

    const no_img_selected = (
        <Image source={default_image} style={styles.thumbnail} />
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.internalContainer}>
                    <View style={styles.container}>
                        <Text style={{...styles.text, marginTop: 15}}>
                            Select a thumbnail photo for your tour
                        </Text>
                        <Text style={styles.text}>(or use the default)</Text>
                    </View>
                    <View style={styles.imageSelectionContainer}>
                        <Text style={styles.text}>
                            Currently selected image:
                        </Text>
                        <View style={styles.imageHolder}>
                            {selectedImage !== null ? (
                                <Image
                                    source={{ uri: selectedImage.localUri }}
                                    style={styles.thumbnail}
                                />
                            ) : (
                                no_img_selected
                            )}
                        </View>
                        <Button
                            title="Pick a photo"
                            onPress={openImagePickerAsync}
                        />
                        <Button
                            title="Use default"
                            onPress={setImageToDefault}
                        />
                    </View>
                    <View style={styles.container}>
                        <Text style={styles.text}>Public or Private</Text>
                        <Text style={styles.subText}>
                            (Must have an approved account for public)
                        </Text>
                        <View style={styles.buttons}>
                            <Text>Private</Text>
                            <RadioButton
                                value="true"
                                label="Private"
                                status={
                                    privateTour === true
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() => {
                                    setPrivateTour(true);
                                }}
                            />
                            <Text style={{ marginLeft: 25 }}>Public</Text>
                            <RadioButton
                                value="false"
                                //disabled={true} // TODO: THIS, MAKE CERTAIN ACCOUNTS DISABLE THIS
                                label="Public"
                                status={
                                    privateTour === false
                                        ? "checked"
                                        : "unchecked"
                                }
                                onPress={() => {
                                    setPrivateTour(false);
                                }}
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 10,
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Text style={styles.text}>
                            Add a description (optional):
                        </Text>
                        <TextInput
                            onChangeText={(text) => setTourDescription(text)}
                            multiline={true}
                            placeholder="My tour is awesome and has routes showcasing..."
                            style={{
                                ...globalStyles.inputField,
                                height: 100,
                                width: 300,
                                textAlignVertical: 'top',
                                paddingHorizontal: 20,
                                paddingVertical: 8
                            }}
                        />
                    </View>
                    {privateTour == false && (
                        <View
                            style={{
                                marginTop: 10,
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Text style={styles.text}>
                                Add tags to help users search for your tour:
                            </Text>
                            <TextInput
                                multiline={true}
                                onChangeText={(text) =>
                                    setTourTags(text.split(","))
                                }
                                placeholder={
                                    "Enter, individual, terms, seprarated, by, commas, and, combined terms together, to help users, find your tour!"
                                }
                                style={{
                                    ...globalStyles.inputField,
                                    height: 100,
                                    width: 300,
                                    textAlignVertical: 'top',
                                    paddingHorizontal: 20,
                                    paddingVertical: 8
                                }}
                            />
                        </View>
                    )}
                    <View style={{ marginTop: 20 }}>
                        <Button
                            title="Finish tour"
                            textStyle={{ fontSize: 20 }}
                            buttonStyle={{ width: 175, elevation: 5 }}
                            onPress={finishTour}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    imageSelectionContainer: {
        margin: 25,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderColor: "#4633af",
        borderWidth: 2,
        width: Dimensions.get("window").width * 0.75,
    },
    internalContainer: {
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    text: {
        alignItems: "center",
        fontSize: 18,
        textAlign: "center",
    },
    subText: {
        alignItems: "center",
        fontSize: 14,
        textAlign: "center",
    },
    thumbnail: {
        height: 250,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default FinalizeTourScreen;
