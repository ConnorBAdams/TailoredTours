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
import { ScrollView } from "react-native-gesture-handler";
import SearchInfo from '../components/searchInfo'

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
	const [slidingPanelRef, setSlidingPanelRef] = useState(null)
	const [allTours, setAllTours] = useState(null)
	const [searchResults, setSearchResults] = useState(null)
	const [searching, setSearching] = useState(false)
	const [userLocation, setUserLocation] = useState(null)
	const [allNodes, setAllNodes] = useState(null)
	const [allRoutes, setAllRoutes] = useState(null)

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
	useEffect(() => {
		if (allTours == null && !searching) {
			setSearching(true)
			queryAllPublic()
		}
	})
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
				var arr=[]
				snapshot.forEach((element) => {
					element.forEach((tour) => {
						arr.push({
							id: tour.key,
							owner: element.key,
							anchor: tour.child('anchor').val(),
							createdAt: new Date(tour.child('createdAt').val()).toLocaleString(),
							lastModified: new Date(tour.child('lastModified').val()).toLocaleString(),
							thumbnail: tour.child('thumbnail').val(),
							tourTags: tour.child('tourTags').val(),
							tourDescription: tour.child('tourDescription').val(),
							tourName: tour.child('tourName').val()
						})
					})
				})
				setAllTours(arr)
				console.log("done");
				setSearching(false)
				if (userLocation != null)
					showNearbyTours()
				// arr.forEach((tour) => {
				// 	firebase.database().ref('/tours/' + tour.owner + '/' + tour.id)
				// 	.once("value", function(snapshot) {

				// 	})
				// })
            });
	}

	const showNearbyTours = () => {
		console.log('searching for nearby tours')
		if (userLocation != null && allTours != null) {
			console.log(userLocation, allTours.length)
			var arr = []
			allTours.forEach((tour) => {
				console.log('checked: ', tour.tourName)
				if (userLocation.coordinate.longitude - tour.anchor.longitude <= 10 || 
					userLocation.coordinate.latitude - tour.anchor.latitude <= 10) {
						arr.push(tour)
					}
			})
			console.log("Got:")
			arr.forEach((tour) => console.log(tour.tourName))
		}

	}

	const showSearchDetails = () => {
		console.log('Showing search details')
		slidingPanelRef.show()
	}

	const confirmSearch = () => {
		// Just in case it isn't open yet
		showSearchDetails()
		// Run the search on DB
	}

	const userLocationChange = (location) => {
		if (userLocation == null || 
			userLocation.coordinate.longitude != location.nativeEvent.coordinate.longitude || 
			userLocation.coordinate.latitude != location.nativeEvent.coordinate.latitude) {
			console.log('User: ', location.nativeEvent )
			setUserLocation(location.nativeEvent)
			showNearbyTours()
		}
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
                    <View pointerEvents="box-none" style={styles.searchBar} >
                        <TextInput
                            style={{
                                ...globalStyles.inputField,
                                elevation: 2,
                                width: Dimensions.get("window").width * 0.9,
							}}
							onFocus={() => showSearchDetails()}
							onSubmitEditing={() => confirmSearch()}
                            onChangeText={(text) => setSearchTerm(text)}
                            inlineImageLeft="search_icon"
                            placeholder="Search Tours"
                        />
						<TouchableOpacity 
						style={styles.searchIcon}
						onPress={() => confirmSearch()}>
                        <FontAwesome
                            name="search"
                            size={24}
                            color="black"
                        />
						</TouchableOpacity>
						<View style={styles.buttonList}>
                        <FlatList
                            horizontal
							data={searchTerms}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            renderItem={Item}
                            keyExtractor={(item) => item.id}
                        />
						</View>
                    </View>
                    <MapComponent
						location={location}
						onUserLocationChange={(location) => userLocationChange(location)}
						enableQRReader={() => toggleQRReader()}
						nodes={allNodes}
						routes={allRoutes}
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
				<SearchInfo 
				tourList={allTours}
				searching={searching}
				onRef={ref => setSlidingPanelRef(ref)}/>
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
        alignItems: "center",
		top: 30,
		height: Dimensions.get('window').height,
		width: Dimensions.get("window").width,
	},
	buttonList: {
		position:'absolute',
		flexGrow:0,
		height: 50,
		zIndex: 4,
		top: 60,
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
