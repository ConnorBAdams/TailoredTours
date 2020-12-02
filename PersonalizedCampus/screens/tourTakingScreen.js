import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Dimensions,
    TextInput,
	FlatList,
	Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/button";
import MapComponent from "../components/map";
import * as Location from "expo-location";
import globalStyles from "../styles";
import { FontAwesome } from "@expo/vector-icons";
import QRReader from '../components/qrReader'
import firebase from "firebase";

const searchTerms = [
    {
        id: "0",
        text: "Featured",
    },
    {
        id: "1",
        text: "Virtual Tour",
    },
    {
        id: "2",
        text: "Popular",
    },
    {
        id: "3",
        text: "Parks",
    },
    {
        id: "5",
        text: "Museum",
    },
    {
        id: "6",
        text: "Universities",
    },
];

const TourTakingScreen = (props) => {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [readQR, setReadQR] = useState(false)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg(
                    "Permission to access location was denied, is is required for the map"
                );
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location);
        })();
    }, []);
    const navigation = useNavigation();

    const Item = ({ item }) => (
        <View style={styles.item}>
            <Button
                buttonStyle={globalStyles.touchableOpacityInverted}
                textStyle={globalStyles.touchableOpacityTextInverted}
                title={item.text}
                onPress={() => {
                    console.log("Pressed: ", item.text);
                }}
            />
        </View>
	);

	const queryAllPublic = () => {
		console.log("Starting query...")
        firebase
            .database()
            .ref('/publicTours/')
            .once("value", function (snapshot) {
				console.log("Processing snapshot of user tour data");
				console.log(snapshot)
				// snapshot.forEach((element) => {
				// 	console.log(element.key)
				// 	element.forEach((tour) => {
				// 		console.log(tour.child('publicTour').val())
				// 	})
				// })
                console.log("done");
            });
	}
	
	const toggleQRReader = () => {
		console.log("Pressed QR Read")
		setReadQR(true)
	}

    return (
        <View style={styles.container}>
            {location === null && <ActivityIndicator size="large" />}
            {location === null && <Text>Loading...</Text>}
            {location != null && (
                <View>
                    <View style={styles.searchBar}>
                        <TextInput
                            style={{
                                ...globalStyles.inputField,
                                elevation: 2,
                                width: Dimensions.get("window").width * 0.9,
							}}
							onSubmitEditing={() => queryAllPublic()}
                            onChangeText={(text) => setSearchTerm(text)}
                            inlineImageLeft="search_icon"
                            placeholder="Search Tours"
                        />
                        <FontAwesome
                            name="search"
                            size={24}
                            color="black"
                            style={styles.searchIcon}
                        />
                        <FlatList
                            horizontal
                            data={searchTerms}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            renderItem={Item}
                            keyExtractor={(item) => item.id}
                        />
                    </View>
                    <MapComponent
                        location={location}
                        enableQRReader={() => toggleQRReader()}
                        style={styles.map}
                        showUser={true}
                        takingTour={true}
                    />
					<QRReader
					modalVisible={readQR}
					toggleSelf={() => setReadQR(!readQR)}
					/>
					{Platform.OS === 'ios' && 
				<TouchableOpacity style={styles.icon} onPress={() => props.navigation.pop() } >
                <FontAwesome name="arrow-left" style={{width: 38, textAlign:'center'}} size={32} />
                </TouchableOpacity>}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
	},
	icon: {
        borderRadius: 20,
		borderWidth: 1,
		width: 45,
        borderColor: 'black',
        padding: 2,
		backgroundColor: '#fff',
		position:'absolute',
		left: 15,
		bottom: 30
    },
    button: {
        flex: 1,
        margin: "15%",
        alignContent: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    },
    searchBar: {
        zIndex: 1,
        position: "absolute",
        alignSelf: "center",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        top: 30,
    },
    item: {
        paddingHorizontal: 10,
    },
    title: {
        fontSize: 32,
    },
    searchIcon: {
        zIndex: 1,
        elevation: 5,
        position: "absolute",
        right: 30,
        top: 17,
    },
});

export default TourTakingScreen;
