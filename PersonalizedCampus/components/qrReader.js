import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
    Text,
    Modal,
    TouchableWithoutFeedback,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import Button from "./button";
import globalStyles from "../styles";
import { BarCodeScanner } from "expo-barcode-scanner";
import firebase from "firebase";

const QRReader = (props) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [scanData, setScanData] = useState('')

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setScanData('querying');
        queryFromCode(data);
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    };

    const queryFromCode = (data) => {
        const tours_str = "/tours/" + data.slice(0, data.indexOf(" _ ")) + "/" + data.slice( data.indexOf(" _ ")+3, data.length );
        console.log(tours_str)
        firebase
            .database()
            .ref(tours_str)
            .once("value", function (snapshot) {
                console.log("Processing snapshot of user tour data");
                setScanData({
                    tourName: snapshot.child('tourName').val(), 
                    img: snapshot.child('thumbnail').val()
                })
                console.log("done");
            });
    }

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const confirmTour = () => {
        props.toggleSelf()
    }

    const denyTour = () => {
        setScanData('')
        setScanned(false)
    }

    return (
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.modalVisible}
                onRequestClose={() => {
                    props.toggleSelf()
                }}
            >
            <TouchableOpacity
                activeOpacity={1}
                style={styles.centeredView}
                onPress={() => props.toggleSelf()}
            >
            <View>
            <TouchableWithoutFeedback>
            <View style={styles.modalView}>
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                        marginHorizontal: 10,
                    }}
                >
                    Scan code!
                </Text>
                {!scanned &&
                <View style={{alignItems:'center'}}>
                    <Text
                    style={{
                        fontSize: 18,
                        textAlign:'center',
                        marginBottom: 15,
                        marginHorizontal: 10,
                    }}>
                    Scan a tour's sharable QR code to take
                    private tours!
                </Text>
                <View style={{
                    width: Dimensions.get("window").width * 0.75,
                    height: Dimensions.get("window").height * 0.5,}}>
                <BarCodeScanner
                    onBarCodeScanned={
                        scanned
                            ? undefined
                            : handleBarCodeScanned
                    }
                    style={StyleSheet.absoluteFillObject}
                    />
                </View>                
                <Button
                    buttonStyle={{ marginTop: 25 }}
                    title="Hide"
                    onPress={() => props.toggleSelf()}
                /></View>}
                {scanned && 
                <View style={{alignItems:'center'}}>
                    { scanData == 'querying' && 
                        <View style={{ flexDirection: "column" }}>
                            <ActivityIndicator size={"large"} />
                            <Text style={{ fontSize: 24 }}>Loading...</Text>
                        </View>
                    }
                    { scanData != 'querying' && scanData != ''&&
                        <View style={{alignItems: 'center', textAlign: 'center'}}>
                        <Text style={{fontSize: 20}}>Scanned:</Text>
                        <Text style={{fontSize: 24, marginVertical: 10, textDecorationLine: 'underline'}}>{scanData.tourName} </Text>

                        <Image 
                        source={{uri: `data:image/gif;base64,${scanData.img}`}}
                        style={{width: 200, height: 200}}
                        />
                        <Text style={{fontSize: 18, marginTop: 18, marginBottom: 40}} >Would you like to take this tour?</Text>
                        <Button title="Yes" onPress={() => confirmTour()} />
                        <Button title="No" buttonStyle={{backgroundColor:'darkred'}} onPress={() => denyTour()}/>
                        </View>
                    }
                </View>}
            </View>
            </TouchableWithoutFeedback>
            </View>
            </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        textAlign: "center",
    },
});

export default QRReader;
