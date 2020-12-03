import React, { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    View,
    SafeAreaView,
    ActivityIndicator,
    Modal,
    TouchableWithoutFeedback,
} from "react-native";
import "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import DrawerHeader from "../components/drawerHeader";
import Button from "../components/button";
import firebase, { auth } from "firebase";
import QRCode from "react-native-qrcode-svg";

const MyToursScreen = (props) => {
    const [userID, setUserID] = useState(null);
    const [tours, setTours] = useState([]);
    const [queryComplete, setQueryComplete] = useState(false); // This could be optimized with context/redux
    const [shareModalVisible, setShareModalVisible] = useState(false); // this is for the sharing modal
    const [qrValue, setQRValue] = useState("");
	const [shareName, setShareName] = useState("");
    useEffect(() => {
        getuserID();
    }, []);
    useEffect(() => {
        getTours();
    });

    const default_image = require("../assets/default_thumbnail.png");
    const navigation = useNavigation();

    const getuserID = () => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUserID(user.uid);
            } else {
                setUserID(null);
            }
        });
    };

    const getTours = () => {
        if (userID != null) {
            const tours_str = "/tours/" + userID;
            firebase
                .database()
                .ref(tours_str)
                .once("value", function (snapshot) {
                    var arr = [];
                    console.log("Processing snapshot of user tour data");
                    snapshot.forEach((element) => {
                        arr.push({
                            id: element.key,
                            title: element.child("tourName").val(),
                            thumbnail: element.child("thumbnail").val(),
                        });
                    });
                    if (arr.length > tours.length) {
                        setTours(arr);
                    }
                    setQueryComplete(true);
                    console.log("done");
                });
        }
    };

    const elementPressed = (item) => {
        navigation.navigate("EditScreen", { tourID: item.id, userID: userID });
    };

    const shareTour = (item) => {
		setShareName(item.title)
        setQRValue(userID + " _ " + item.id);
        setShareModalVisible(true);
    };

    const Item = ({ item, onPress }) => (
        <TouchableOpacity
            onPress={() => elementPressed(item)}
            onLongPress={() => shareTour(item)}
            style={styles.item}
        >
            <Image
                style={styles.tourImg}
                source={
                    item.thumbnail == "default"
                        ? default_image
                        : { uri: "data:image/jpeg;base64," + item.thumbnail }
                }
            />
            <Text numberOfLines={1} style={styles.title}>
                {item.title}
            </Text>
        </TouchableOpacity>
    );

    const toursNotFound = <Text style={{ fontSize: 24 }}>No tours found.</Text>;
    const loading = (
        <View style={{ flexDirection: "column" }}>
            <ActivityIndicator size={"large"} />
            <Text style={{ fontSize: 24 }}>Loading...</Text>
        </View>
    );
    const toursFound = (
        <View>
            <Text
                style={{
                    fontSize: 26,
                    textAlign: "center",
                    marginTop: 15,
                    marginHorizontal: 15,
                }}
            >
                Select a tour to edit!
            </Text>
            <Text
                style={{
                    fontSize: 14,
                    textAlign: "center",
                    marginBottom: 15,
                    marginHorizontal: 15,
                }}
            >
                Press and hold a tour to show a sharable QR code!
            </Text>

            <FlatList
                data={tours}
                renderItem={Item}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 50 }}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={shareModalVisible}
                onRequestCLose={() => setShareModalVisible(false)}>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.centeredView}
                    onPress={() => setShareModalVisible(false)}>
                    <View>
						<TouchableWithoutFeedback>
						<View style={styles.modalView}>
						<Text style={{fontSize: 24, fontWeight: 'bold', marginBottom: 20, marginHorizontal: 10}}>Share me!</Text>
						<Text style={{fontSize: 24, textDecorationLine: 'underline', marginBottom: 15, marginHorizontal: 10}}>{shareName}</Text>
                        <QRCode
                            value={qrValue}
                            logo={require("../assets/Logo-Icon.png")}
                            logoSize={45}
                            size={200}
                            color={"#413d52"}
                            logoBackgroundColor="transparent"
                        />

                        <Button
                            buttonStyle={{ marginTop: 50 }}
                            title="Hide"
                            onPress={() => setShareModalVisible(false)}
                        />
						</View></TouchableWithoutFeedback>
                    </View>
                </TouchableOpacity>
            </Modal>
            <DrawerHeader
                name="My Tours"
                openDrawer={
                    props.navigation != null
                        ? props.navigation.openDrawer
                        : false
                }
            />
            <View style={styles.internalContainer}>
                {tours.length == 0
                    ? queryComplete
                        ? toursNotFound
                        : loading
                    : toursFound}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 110,
    },
    internalContainer: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    itemIcon: {
        height: 50,
        width: 50,
    },
    item: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 7,
        padding: 20,
        margin: 5,
        elevation: 2,
        width: 350,
        backgroundColor: "#00c9db",
    },
    title: {
        fontSize: 28,
    },
    tourImg: {
        width: 75,
        height: 75,
        borderRadius: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    openButton: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        fontSize: 26,
        textAlign: "center",
    },
});

export default MyToursScreen;
