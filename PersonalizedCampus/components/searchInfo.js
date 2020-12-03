import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    ActivityIndicator,
    Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { FlatList, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import SlidingUpPanel from "rn-sliding-up-panel";
import Button from "./button";
import Carousel from "react-native-snap-carousel";
import { useNavigation  } from '@react-navigation/native';
import MarkerEditorComponent from "./markerEditor";
import firebase from "firebase";

const { height } = Dimensions.get("window");

const SearchInfo = (props) => {
    const [draggableRange, setDraggableRange] = useState({
        top: height,
        bottom: 0,
    });
    const [selectedTour, setSelectedTour] = useState(null);
    const [showTourInfo, setShowTourInfo] = useState(false)

    // Local references
    const [slidingPanel, setSlidingPanel] = useState(null);
	const navigation = useNavigation();


    const { top, bottom } = draggableRange;
    const _draggedValue = new Animated.Value(0);
    const default_image = require("../assets/default_thumbnail.png");

    useEffect(() => {
        props.onRef(slidingPanel);
        if (props.scannedTour != null && selectedTour != props.scannedTour) {
            queryAllTourInfo(props.scannedTour)
            props.resetScanData()
        }
    });

    const textTranslateY = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [0, 8],
        extrapolate: "clamp",
    });

    const textTranslateX = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [0, -50],
        extrapolate: "clamp",
    });

    const textScale = _draggedValue.interpolate({
        inputRange: [bottom, top],
        outputRange: [1, 0.7],
        extrapolate: "clamp",
    });


    const queryAllTourInfo = (tour) => {
        firebase.database().ref('/tours/' + tour.owner + '/' + tour.id)
        .once("value", function(snapshot) {
            var fullTourData = tour
            fullTourData.routes = snapshot.child('routes').val()
            fullTourData.nodes = snapshot.child('nodes').val()
            if (snapshot.child('ratings').val() != null) {
                var avgRating = 0
                var count = 0
                snapshot.child('ratings').forEach((rating) =>
                {
                    console.log(rating,  rating.child('rating').val())
                    avgRating += rating.child('rating').val()
                    count +=1
                });
                console.log(avgRating, count)
                fullTourData.ratings = (avgRating/count)

            }
            setSelectedTour(fullTourData)
            setShowTourInfo(true)
        })
    }

    const chooseTour = (tour) => {
        queryAllTourInfo(tour)
    };

    const takeInPerson = () => {
        console.log("Take in person")
    }

    const takeVirtually = () => {
        console.log("Take virtually")
        // setShowTourInfo(false)
        navigation.navigate('Virtual Tour Splash', {
            tour: selectedTour
        })
    }

    const routePreview = ({item, index}) => {
        console.log(item)
		return ( 
		<View style={{width: 250, height: 250, backgroundColor: `rgba(${item.routeColor.r},${item.routeColor.g},${item.routeColor.b},1)`}}>
            <View style={{height: '80%', width: '100%'}}>
            {item.images!=null && 
            <Image source={{uri: item.images[0].backendURL}} style={{height:250, width: 250}} /> }
            </View>
            <View style={{bottom: -5, backgroundColor:'rgba(52, 52, 52, 0.8)'}}>
            <Text style={{fontSize:20, color: 'white', paddingLeft: 15}}>{item.name}</Text>
            {item.description != null && <Text style={{color: 'white',  paddingLeft: 15}}>{item.description}</Text>}
            </View>
		</View> 
	)}

    const tourItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => chooseTour(item)}
            >
                <Text>{item.tourName}</Text>
                <Text>{item.tourDescription}</Text>
                <Image
                    style={styles.tourImg}
                    source={
                        item.thumbnail == "default"
                            ? default_image
                            : {
                                  uri:
                                      "data:image/jpeg;base64," +
                                      item.thumbnail,
                              }
                    }
                />
            </TouchableOpacity>
        );
    };

    return (
        <SlidingUpPanel
            ref={(c) => setSlidingPanel(c)}
            draggableRange={draggableRange}
            animatedValue={_draggedValue}
            snappingPoints={[750]}
            height={Dimensions.get("window").height}
            friction={0.5}
            style={{ zIndex: 10 }}
        >
            <View style={styles.panel}>
                <View style={styles.panelHeader}></View>
                <View style={styles.bodyContainer}>
                    {showTourInfo && 
                    <View>
                        <TouchableOpacity style={styles.icon} onPress={() => setShowTourInfo(false) } >
                        <Feather name="arrow-left" style={{width: 38, textAlign:'center'}} size={32} />
                        </TouchableOpacity>
                        <View style={{alignItems:'center', paddingHorizontal: 20}}>
                        <Text style={{paddingBottom: 10, fontSize: 28, fontWeight: 'bold'}}>{selectedTour.tourName}</Text>
                        <ScrollView style={styles.infoScrollView}>
                        <View style={{alignItems:'flex-start', width: '100%', padding: 20}}>
                        <Text style={styles.fieldHeader}>Description: </Text>
                        <Text>{selectedTour.tourDescription != null ? selectedTour.tourDescription : "No description provided"}</Text>
                        <Text style={styles.fieldHeader}>Total Routes:</Text>
                        <Text> {selectedTour.routes.length}</Text>
                        <Text style={styles.fieldHeader}>Times taken:</Text>
                        <Text>{selectedTour.takenCount == null? "Nobody has taken this tour yet, be the first!" : selectedTour.takenCount}</Text>
                        <Text style={styles.fieldHeader}>Rating:</Text>
                        <Text>{selectedTour.ratings == null? "No ratings yet" : selectedTour.ratings} / 5</Text>
                        <View style={styles.previewToursBox}>
                        <Text style={{fontSize: 18, marginVertical: 20}}> Preview Routes </Text>
                        <Carousel
                            data={selectedTour.routes}
                            renderItem={routePreview}
                            sliderWidth={Dimensions.get('window').width * 0.5}
                            itemWidth={200}
                            itemHeight={200}
                            style={{height: 200}}
                        />
                        </View>
                        <Text style={{fontSize: 14}}>Uploaded on: { selectedTour.createdAt }, </Text>
                        <Text style={{fontSize: 14}}>Last Updated: { selectedTour.lastModified }</Text>
                        </View>
                        </ScrollView>

                        <View style={{alignItems:"flex-start", justifyContent:"space-between", flexDirection:"row"}}>
                        <Button title="Take tour in person" onPress={() => takeInPerson()} />
                        <Button title="Take tour virtually" onPress={() => takeVirtually()}/>
                        </View>
                        </View>

                    </View>
                    }


                    {showTourInfo == false && 
                    <View>
                    <View style={styles.descriptionHeader}>
                        <Text style={styles.sectionHeader}>
                            Search Results:
                        </Text>
                    </View>
                    {props.tourList != null && (
                        <View style={styles.resultsList}>
                            <FlatList
                                data={props.tourList}
                                renderItem={tourItem}
                                keyExtractor={(item) => item.id}
                            />
                        </View>
                    )}
                    
                    {(props.tourList == null || props.searching == true) && (
                        <View>
                            <ActivityIndicator size="large" />
                        </View>
                    )}
                    </View>
                    }
                    </View>
                    
            </View>
        </SlidingUpPanel>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        flexGrow: 1,
    },
    panel: {
        flex: 1,
        zIndex: 10,
    },
    infoScrollView: {
        height: '70%',
        width: '100%',
        borderRadius: 20,
        borderColor:'black',
        borderWidth: 1  ,
        marginBottom: 10
    },
    previewToursBox: {
        alignItems: 'center',
        justifyContent: "center",
        textAlign:'center',
        width: '100%',
        marginBottom: 50
    },
    panelHeader: {
        height: Dimensions.get("window").height * 0.3,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: "#4633af",
        justifyContent: "flex-end",
        padding: 24,
    },
    previewContainer: {
        padding: 20,
        backgroundColor: "white",
    },
    bodyContainer: {
        flex: 1,
        backgroundColor: "white",
        height: 300,
    },
    textHeader: {
        fontSize: 28,
        color: "#FFF",
    },
    sectionHeader: {
        fontSize: 26,
        margin: 20,
    },
    bottomContainer: {
        flexDirection: "column",
        backgroundColor: "white",
        position: "absolute",
        bottom: 50,
        width: Dimensions.get("window").width,
        alignItems: "center",
    },
    descriptionHeader: {
        marginTop: 10,
        marginRight: 10,
        flexDirection: "row",
        alignItems: "center",
    },
    descriptionText: {
        marginLeft: 30,
        fontSize: 20,
        marginBottom: 10,
    },
    resultsList: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height * 0.6,
    },
    item: {
        borderWidth: 2,
        borderRadius: 20,
        borderColor: "#4633af",
        backgroundColor: "#fff",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        height: 100,
    },
    tourImg: {
        position: "absolute",
        right: 15,
        top: 10,
        width: 75,
        height: 75,
        borderRadius: 10,
    },
    fieldHeader: {
        fontSize: 16,
        marginTop: 8, 
        textDecorationLine: 'underline'
    }
});

export default SearchInfo;
