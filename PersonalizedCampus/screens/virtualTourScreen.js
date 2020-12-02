import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader';
import Button from '../components/button';
import firebase, { auth } from 'firebase';
import Carousel from 'react-native-snap-carousel';

const VirtualTourScreen = props => {    
    const [tour, setTour] = useState(null);
    const [numNodes, setNumNodes] = useState(0);
    const [routeNodes, setRouteNodes] = useState([]);
    const [hasExecuted, setHasExecuted] = useState(false);
    const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
    const [currentNodeName, setCurrentNodeName] = useState(null);
    const [currentNodeDesc, setCurrentNodeDesc] = useState(null);
    const [currentNodeMedia, setCurrentNodeMedia] = useState([]);
    const [queryComplete, setQueryComplete] = useState(false);
	const [carousel, setCarousel] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        if (!hasExecuted) {
            setTour(props.route.params.tour);
            setNumNodes(props.route.params.tour.child('routes').child(props.route.params.route).child('nodes').numChildren());
            setRouteNodes(props.route.params.tour.child('routes').child(props.route.params.route).child('nodes').val());
            setHasExecuted(true);
        }
    });

    const getCurrentNodeInfo = () => {
        const node = tour.child('nodes').child(routeNodes[currentNodeIndex]).child('item');
        setCurrentNodeName(node.child('name').val());
        setCurrentNodeDesc(node.child('description').val());
        const images = node.child('images');
        if (images.hasChildren()) {
            setCurrentNodeMedia(images.val());
        } else {
            setCurrentNodeMedia(null);
        }
        setQueryComplete(true);
    }

    const carouselImage = ({item, index}) => {
		return ( 
		<View>
		<Image style={{width: 200, height: 200, 
			borderWidth: 1, aspectRatio: 1}} 
			source={item}
			/>
		</View> 
    )}
    
    const gotoNextStop = () => {
        if (currentNodeIndex == numNodes - 1) {
            Alert.alert(
                "End of tour",
                "You have reached the last stop!",
                [
                    {
                        text: "Go to main menu",
                        onPress: () => navigation.popToTop()
                    },
                    {
                        text: "Resume tour"
                    }
                ]
            );
            return;
        }
        setQueryComplete(false);
        setCurrentNodeIndex(currentNodeIndex + 1);
        getCurrentNodeInfo();
    }

    const gotoPreviousStop = () => {
        if (currentNodeIndex == 0) {
            Alert.alert(
                "First stop",
                "You are already at the first stop!",
                [
                    {
                        text: "OK"
                    }
                ]
            );
            return;
        }
        setQueryComplete(false);
        setCurrentNodeIndex(currentNodeIndex - 1);
        getCurrentNodeInfo();
    }

    const debug = () => {
        console.log(routeNodes);
        console.log(currentNodeIndex);
    }

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader name='Take Virtual Tour' openDrawer={(props.navigation != null) ? props.navigation.openDrawer : false} />
            <View style={styles.internalContainer}>
                <Text style={styles.title}>Current stop:</Text>
                <Text style={styles.description}>
                    {queryComplete == true ?
                        currentNodeName != null ?
                            currentNodeName : 'No name provided'
                        : 'Loading...'
                    }
                </Text>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.description}>
                    {queryComplete == true ?
                        currentNodeDesc != null ?
                            currentNodeDesc : 'No description provided'
                        : 'Loading...'
                    }
                </Text>
                <Text style={styles.title}>Images and videos:</Text>
                <View style={styles.imageCarouselContainer}>
                    {queryComplete == true ?
                        (currentNodeMedia != null ?
                            <Carousel
                                ref={(c) => setCarousel(c)}
                                data={currentNodeMedia}
                                renderItem={carouselImage}
                                sliderWidth={Dimensions.get('window').width * 0.8}
                                itemWidth={200}
                                itemHeight={200}
                                style={{ height: 200 }}
                            /> 
                            :
                            <Text style={{ fontSize: 18 }}>No media provided</Text>)
                        :
                        (<Text style={{ fontSize: 18 }}>Loading...</Text>)
                    }
                </View>
                <Text style={styles.title}>Stop {currentNodeIndex + 1} / {numNodes}</Text>
                <View style={styles.arrows}>
                    {numNodes == 0 ?
                        <Button title='Previous stop'></Button>
                        :
                        <Button title='Previous stop' onPress={() => gotoPreviousStop()}></Button>
                    }
                    {numNodes == 0 ?
                        <Button title='Next stop'></Button>
                        :
                        <Button title='Next stop' onPress={() => gotoNextStop()}></Button>
                    }
                </View>
                <Button title='Debug' onPress={() => getCurrentNodeInfo()}></Button>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 110 
        },
    internalContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        },
    header:{
        width:"100%",
        height:60,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:20,
    },
    itemIcon: {
        height: 50,
        width: 50
    },
    title: {
        fontSize: 16,
    },
    tourImg: {
        width: 75,
        height: 75,
        borderRadius: 10
    },
    thumbnail: {
        height: 250,
        aspectRatio: 1,
        resizeMode: "contain",
    },
    imageSelectionContainer: {
        margin: 25,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderColor: '#4633af',
        borderWidth: 2,
        width: Dimensions.get('window').width * 0.75
    },
    description: {
        fontSize: 20,
        marginBottom: 30,
    },
    imageCarouselContainer: {
		alignItems: 'center',
		margin: 20,
		height: 200,
    }, 
    arrows: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
});


export default VirtualTourScreen;