import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, Animated, Alert, Image} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Button from './button';
import Carousel from 'react-native-snap-carousel';
import MarkerEditorComponent from './markerEditor';
import { Video } from 'expo-av';

const { height } = Dimensions.get("window") ;

const CarouselItem = props => {
	const [draggableRange, setDraggableRange] = useState({top: height + 40 , bottom: 180})
	const [photos, setPhotos] = useState([])
	const [modalVisible, setModalVisible] = useState(false)
	const { top, bottom } = draggableRange;
	const _draggedValue = new Animated.Value(180);

	const backgoundOpacity = _draggedValue.interpolate({
	inputRange: [height - 48, height],
	outputRange: [1, 0],
	extrapolate: "clamp"
	});

	const iconTranslateY = _draggedValue.interpolate({
	inputRange: [height - 56, height, top],
	outputRange: [0, 56, 180 - 32],
	extrapolate: "clamp"
	});

	const textTranslateY = _draggedValue.interpolate({
	inputRange: [bottom, top],
	outputRange: [0, 8],
	extrapolate: "clamp"
	});

	const textTranslateX = _draggedValue.interpolate({
	inputRange: [bottom, top],
	outputRange: [0, -50],
	extrapolate: "clamp"
	});

	const textScale = _draggedValue.interpolate({
	inputRange: [bottom, top],
	outputRange: [1, 0.7],
	extrapolate: "clamp"
	});

	const openImagePickerAsync = async () => {
		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}
		let pickerResult = await ImagePicker.launchImageLibraryAsync({base64: true});
		if (pickerResult.cancelled === true) {
			return;
	}
	if (props.contents.images == undefined || props.contents.images.length == 0) {
		props.contents.images=[{base64: pickerResult.base64, type: 'image'}]
		//setPhotos([{base64: pickerResult.base64}])
	} else {
		props.contents.images=[{base64: pickerResult.base64, type: 'image'}, ...props.contents.images]
		//setPhotos([{base64: pickerResult.base64}, ...photos])
	}
	setPhotos([...photos, {base64: pickerResult.base64, type: 'image'}]) // this is just to get the UI to update
	};

	const openVideoPickerAsync = async () => {
		let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Permission to access camera roll is required!");
			return;
		}
		let pickerResult = await ImagePicker.launchImageLibraryAsync({base64: true, mediaTypes: ImagePicker.MediaTypeOptions.Videos});
		if (pickerResult.cancelled === true) {
			return;
	}
	if (props.contents.images == undefined || props.contents.images.length == 0) {
		props.contents.images=[{base64: pickerResult.base64, type: 'video'}]
		//setPhotos([{base64: pickerResult.base64}])
	} else {
		props.contents.images=[{base64: pickerResult.base64, type: 'video'}, ...props.contents.images]
		//setPhotos([{base64: pickerResult.base64}, ...photos])
	}
	setPhotos([...photos, {base64: pickerResult.base64, type: 'video'}]) // this is just to get the UI to update
	};

	const toggleModal = () => {
        if (modalVisible === false) {
            setModalVisible(true)
        } else {
            setModalVisible(false)
        }
	}
	
	const updateNode = (title, descr) => {
		props.contents.name = title
		if (props.contents.type=='Node')
        props.contents.description = descr
    }

	const deleteSelected = () => {
	console.log('Delete called')
	Alert.alert('Delete?', 'Are you sure you want to delete this?\nThis cannot be undone',
		[{
			text: 'Yes',
			onPress: () => {props.deleteComponent(props.contents); }
		},
		{
			text: 'Cancel',
			onPress: () => ('Cancel pressed'),
			style: 'cancel'
		}],
		{ cancelable: true }
	)}

	const carouselImage = ({item, index}) => {
		return ( 
		<View>
			{item.type == 'image' ? 
				<Image 
					style={{width: 200, height: 200, 
					borderWidth: 1, aspectRatio: 1}} 
					source={{uri: `data:image/gif;base64,${item.base64}` }}
				/> 
				: 
				<Video
	 				source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
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

	if (props.contents == null){
		return (<View></View>)
	}

	return (
		<SlidingUpPanel
		ref={c => (panel = c)}
		draggableRange={draggableRange}
		animatedValue={_draggedValue}
		snappingPoints={[360]}
		height={750}
		friction={0.5}
		style={{zIndex: 10}}
		>
		{modalVisible && 
		<MarkerEditorComponent 
			onSubmit={updateNode} 
			toggle={toggleModal} 
			node={props.contents} 
			visible={modalVisible} />}
		<View style={styles.panel}>
			<Animated.View
			style={[
				styles.iconBg,
				{
				opacity: backgoundOpacity,
				transform: [{ translateY: iconTranslateY }]
				}
			]}
			/>
			<FontAwesome name="heart" size={24} style={styles.icon} />
			<View style={styles.panelHeader}>
			<Animated.View
				style={{
				transform: [
					{ translateY: textTranslateY },
					{ translateX: textTranslateX },
					{ scale: textScale }
				]}}>
				<Text style={styles.textHeader}>{props.contents.name}</Text>
			</Animated.View>
				<View style={styles.editTitleButton}>
				<TouchableOpacity onPress={() => toggleModal()}>
				<FontAwesome name="pencil" size={30} color="white" />
				</TouchableOpacity></View>
			</View>
			<View style={styles.bodyContainer}>
			<View style={styles.descriptionHeader}>
			<Text style={styles.sectionHeader}>Description:</Text>
				<TouchableOpacity onPress={() => toggleModal()}>
				<FontAwesome name="pencil" size={30} color="black" />
			</TouchableOpacity></View>
			<Text style={styles.descriptionText}>{(props.contents.desc != null)? props.contents.desc : props.contents.description}</Text>
			
			<Text style={styles.photosHeader}>Photos:</Text>

			<View style={styles.photosView}>

			<View style={styles.imageCarouselContainer}>
				{(props.contents.images != undefined) ? 
				<Carousel 
					ref={(c) => carousel = c}
					data={props.contents.images}
					renderItem={carouselImage}
					sliderWidth={Dimensions.get('window').width * 0.8}
					itemWidth={200}
					itemHeight={200}
					style={{height: 200}}
				/> :
				<Text style={{fontSize: 18}}>There are no images on this {props.contents.type}</Text> }
			</View>
			<Button title="Upload Photos" onPress={openImagePickerAsync} />
			<Button title="Upload Videos" onPress={openVideoPickerAsync} />


			</View>
			{/* <Text style={styles.sectionHeader}>{(props.contents.type=='Route')? 'Nodes Included:' : 'Parent Route' }</Text>
			<View style={styles.additionalInfo}>


			</View> */}

			<View style={styles.bottomContainer}>
				<Button title={`Delete This ${props.contents.type}`} buttonStyle={{backgroundColor:'crimson'}} onPress={() => deleteSelected()} />
			</View>
			</View>
		</View>
		</SlidingUpPanel>
	)  
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		zIndex: 10,
		flexGrow: 1
	},
	panel: {
		flex:1,
		zIndex: 10,
	},
	panelHeader: {
		height: 110,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		backgroundColor: '#4633af',
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
		color: "#FFF"
	},
	sectionHeader: {
		fontSize: 26,
		margin: 20
	},
	icon: {
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		color: '#413d52',
		top: -12,
		right: 6,
		width: 48,
		height: 48,
		zIndex: 1
	},
	iconBg: {
		backgroundColor: 'white',
		position: "absolute",
		top: -24,
		right: 18,
		width: 48,
		height: 48,
		borderRadius: 24,
		zIndex: 1
	},
	bottomContainer: {
		flexDirection:'column',
		backgroundColor:'white',
		position: 'absolute',
		bottom: 50,
		width: Dimensions.get('window').width,
		alignItems:'center'
	},
	editTitleButton: {
		position: 'absolute',
		flexDirection: 'column',
		alignItems:'center',
		width: 50,
		height: 50,
		right: 0,
	},
	descriptionHeader: {
		marginTop: 10,
		marginRight: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	descriptionText: {
		marginLeft: 30,
		fontSize: 20,
		marginBottom: 10
	},
	photosHeader: {
		fontSize: 26,
		margin: 20
	},
	photosView: {
		alignItems: 'center',
	},
	imageCarouselContainer: {
		alignItems: 'center',
		margin: 20,
		height: 200,
	}, 
	additionalInfo: {

	}
});

export default CarouselItem;
