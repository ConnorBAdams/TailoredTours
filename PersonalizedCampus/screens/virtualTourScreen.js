import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, Image, TouchableOpacity, View, SafeAreaView, ActivityIndicator, Dimensions, Alert } from 'react-native';
import 'react-native-gesture-handler';
import { useNavigation  } from '@react-navigation/native';
import DrawerHeader from '../components/drawerHeader';
import Button from '../components/button';
import firebase, { auth } from 'firebase';
import Carousel from 'react-native-snap-carousel';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons'; 

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
    const [rating, setRating] = useState(null)
    const navigation = useNavigation();

    useEffect(() => {
        if (!hasExecuted) {
            setTour(props.route.params.tour);
            setNumNodes(props.route.params.tour.routes[props.route.params.route].nodes.length)
            console.log(props.route.params.tour.routes[props.route.params.route].nodes.length)
            //setNumNodes(props.route.params.tour.child('routes').child(props.route.params.route).child('nodes').numChildren());
            setRouteNodes(props.route.params.tour.routes[props.route.params.route].nodes)
            //setRouteNodes(props.route.params.tour.child('routes').child(props.route.params.route).child('nodes').val());
            setHasExecuted(true);
        }
    });

    const getCurrentNodeInfo = () => {
        //const node = tour.child('nodes').child(routeNodes[currentNodeIndex]).child('item');
        if (currentNodeIndex+1 >= numNodes){
            return;
        }
        const node = tour.nodes[currentNodeIndex];
        //setCurrentNodeName(node.child('name').val());
        setCurrentNodeName(node.name);
        //setCurrentNodeDesc(node.child('description').val());
        setCurrentNodeDesc(node.description);
        //const images = node.child('images');
        const images = node.images;
        if (images != null) {
            setCurrentNodeMedia(images);
        } else {
            setCurrentNodeMedia(null);
        }
        setQueryComplete(true);
    }

	const carouselImage = ({item, index}) => {
		return ( 
		<View>
			{item.media_type == 'image' ? 
				<Image 
					style={{width: 200, height: 200, 
					borderWidth: 1, aspectRatio: 1}} 
					source={item}
				/> 
				: 
				<Video
	 				source={item}
	  				rate={1.0}
	  				volume={1.0}
	 				isMuted={false}
	 				resizeMode="cover"
	  				shouldPlay
					isLooping
					//useNativeControls
	  				style={{ width: 200, height: 200 }}
				/>
			}
		</View> 
    )}
    
    const rateTour = (val) => {
        if (val == rating) {
            setRating(0)
        } else {
            setRating(val)
        }
    }
    
    const gotoNextStop = () => {
        if (currentNodeIndex >= numNodes) {
            console.log("It should be stopping here")
            return;
        }
        setQueryComplete(false);
        setCurrentNodeIndex(currentNodeIndex + 1);
        console.log(currentNodeIndex)
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
        if (currentNodeIndex < numNodes)
            getCurrentNodeInfo();
    }

    const debug = () => {
        console.log(routeNodes);
        console.log(currentNodeIndex);
    }

    const backToRoutes = () => {
        if (rating != null) {
            firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/ratings/").push({rating: rating})
        }
        firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").once("value", function(snapshot) {  
            if (snapshot.val() != null ) {
                firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").set(
                {
                    takenCount: snapshot.val() + 1
                })
            } else {
            firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").set(
                {
                    takenCount: 1
                })
            }})
        navigation.pop()
    }

    const backHome = () => {
        if (rating != null) {
            firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/ratings/").push({rating: rating})
        }
        firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").once("value", function(snapshot) {  
            if (snapshot.val() != null ) {
                firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").set(
                {
                    takenCount: snapshot.val() + 1
                })
            } else {
            firebase.database().ref('tours/'+tour.owner+"/"+tour.id+"/takenCount/").set(
                {
                    takenCount: 1
                })
            }})
        navigation.popToTop()
    }

    return (
        <SafeAreaView style={styles.container}>
            <DrawerHeader
                name="Take Virtual Tour"
                backButton={true}
                openDrawer={
                    props.navigation != null ? props.navigation.pop : false
                }
            />
            
            <View style={styles.internalContainer}>
                { currentNodeIndex < numNodes && 
                <View style={{height: '80%'}}>
                <Text style={styles.title}>Current stop:</Text>
                <Text style={styles.description}>
                    {queryComplete == true ?
                        currentNodeName != null && currentNodeName != '' ?
                            currentNodeName : 'No name provided'
                        : 'Loading...'
                    }
                </Text>
                <Text style={styles.title}>Description:</Text>
                <Text style={styles.description}>
                    {queryComplete == true ?
                        currentNodeDesc != null && currentNodeDesc != '' ?
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
                </View>}
                { currentNodeIndex == numNodes &&
                <View style={{height: '80%', alignItems:'center',}}>
                    <Text style={{fontSize: 28, margin: 25}}>Route Finished!</Text>
                    <Text style={{fontSize: 20}}>Would you like to take another route?</Text>
                    <Button title="Take another route" onPress={() => backToRoutes()} />
                    <Text style={{fontSize: 20, marginTop: 25}}>Or return to home</Text>
                    <Button title="Return to home" onPress={() => backHome()} />
                    <Text style={{fontSize: 20, marginTop: 100}}>If you enjoyed this route, rate the tour below!</Text>
                    <View style={{flexDirection:'row'}}>
                        <TouchableOpacity onPress={() => rateTour(1)}>
                        {(rating != null && rating >= 1) ?
                        <Ionicons name="md-star" size={50} color='#00c9db' />
                        :
                        <Ionicons name="md-star-outline" size={50} color='#4633af' />}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => rateTour(2)}>
                        {(rating != null && rating >= 2) ?
                        <Ionicons name="md-star" size={50} color='#00c9db' />
                        :
                        <Ionicons name="md-star-outline" size={50} color='#4633af' />}</TouchableOpacity>
                        <TouchableOpacity onPress={() => rateTour(3)}>
                        {(rating != null && rating >= 3) ?
                        <Ionicons name="md-star" size={50} color='#00c9db' />
                        :
                        <Ionicons name="md-star-outline" size={50} color='#4633af' />}</TouchableOpacity>
                        <TouchableOpacity onPress={() => rateTour(4)}>
                        {(rating != null && rating >= 4) ?
                        <Ionicons name="md-star" size={50} color='#00c9db' />
                        :
                        <Ionicons name="md-star-outline" size={50} color='#4633af' />}</TouchableOpacity>
                        <TouchableOpacity onPress={() => rateTour(5)}>
                        {(rating != null && rating >= 5) ?
                        <Ionicons name="md-star" size={50} color='#00c9db' />
                        :
                        <Ionicons name="md-star-outline" size={50} color='#4633af' />}</TouchableOpacity>
                    </View>
                </View>}
                <Text style={styles.title}>Stop {(currentNodeIndex+1 > numNodes)?numNodes : currentNodeIndex + 1} / {numNodes}</Text>
                <View style={styles.arrows}>
                    {currentNodeIndex == 0 ?
                        <Text></Text>
                        :
                        <Button title='Previous stop' onPress={() => gotoPreviousStop()}></Button>
                    }
                    {currentNodeIndex == numNodes ?
                        <Text></Text>
                        :
                        <Button title={ currentNodeIndex == numNodes - 1 ? 'Finish Tour' : 'Next stop'} onPress={() => gotoNextStop()}></Button>
                    }
                </View>
                {/* <Button title='Debug' onPress={() => getCurrentNodeInfo()}></Button> */}
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