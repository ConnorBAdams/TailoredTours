import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, View, ActivityIndicator, Alert } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import MapComponent from '../components/map'
import firebase from 'firebase'

const TourEditorModule = props => {
    [anchorLoc, setAnchorLoc] = useState(null);
    [allNodes, setAllNodes] = useState(null);
    [allRoutes, setAllRoutes] = useState(null);
    [tourID, setTourID] = useState(null);

    useEffect(() => {
        if (props.tour != null && props.tour.key != tourID)
        {
            buildNodes = props.tour.child('nodes').val()
            buildNodes = [...buildNodes, props.tour.child('anchor').val()]
            setAllRoutes(props.tour.child('routes').val())
            setAllNodes(buildNodes)
            setAnchorLoc({coords: {
                latitude: props.tour.child('anchor').child('latitude').val(),
                longitude: props.tour.child('anchor').child('longitude').val()}});
            setTourID(props.tour.key)
        }
    })
    
    const deleteComponent = (item) => {
        if (item.type == 'Node') {
            // first remove it from all routes
            for (var i = 0; i < allRoutes.length; i++) {
                for (var j = 0; j < allRoutes[i].nodes.length; j++){
                    console.log('Comparing: ', allRoutes[i].nodes[j], ' : ', item.id)
                    if (allRoutes[i].nodes[j] == item.id) {
                        console.log('Before: ', allRoutes[i].nodes)
                        allRoutes[i].nodes.splice(j, 1) // this could break if the node occurs more than once
                        console.log('After: ', allRoutes[i].nodes)
                        break;
                    }
                }
            }
            setAllRoutes(allRoutes)

            // now remove the nodes itself
            for (var i = 0; i < allNodes.length; i++) {
                if (allNodes[i].id == item.id) {
                    allNodes.splice(i, 1)
                    break;
                }
            }
            setAllNodes(allNodes)

        } else {
            // route removal
            for (var i = 0; i < allRoutes.length; i++) {
                if (allRoutes[i].id == item.id) {
                    allRoutes.splice(i, 1)
                    setAllNodes(allNodes)
                    break;
                }
            }
        }
        var user = firebase.auth().currentUser;
        // Remove from backend
        if (item.type == 'Node') { 
            console.log('Received a Node')
            var nodeRef = firebase.database().ref(`tours/${user.uid}/${tourID}/nodes/${item.id}/`)
            nodeRef.remove()
            .then(function() {
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
            console.log("Remove failed: " + error.message)
            });
        } else if (item.type == 'Route') {
            console.log('Received a Route')
            var reouteRef = firebase.database().ref(`tours/${user.uid}/${tourID}/routes/${item.id}/`)
            reouteRef.remove()
            .then(function() {
                console.log("Remove succeeded.")
            })
            .catch(function(error) {
            console.log("Remove failed: " + error.message)
            });
        }
    }

    const updateComponent = async (item) => {
        // First check for images that need uploading
        var user = firebase.auth().currentUser;
        uploadImagesToFirebase(item.images)
        .then((updatedPhotos) => {
            // Then update the photos and put everything into the realtime database
            if (updatedPhotos != null)
                item.images = updatedPhotos
            if (item.type == 'Node') {
                console.log('Received a Node')
                var nodeRef = firebase.database().ref(`tours/${user.uid}/${tourID}/nodes/${item.id}/`)
                nodeRef.set({item})
            } else if (item.type == 'Route') {
                console.log('Received a Route')
                var reouteRef = firebase.database().ref(`tours/${user.uid}/${tourID}/routes/${item.id}/`)
                reouteRef.set( item)
                .then((snapshot)=>{
                    console.log('Returned: ', snapshot)
                })
            }
        })
        // Then update the local state variables

        // TODO: This
    }

    // ensures all promises have been fulfilled
	const allFilesReplied = (arrToCheck) => {
		var returnVal = true
		arrToCheck.map((values) => {
            if (values.backendURL == undefined) {
                returnVal = false;
            }
		});
		return returnVal;
    };
	
	// This is going to handle uploading to firebase Storage
	const uploadImagesToFirebase = async (photos) => {
        console.log('Starting image uploads...')
		var user = firebase.auth().currentUser;
		var image_metadata = {
		  contentType: "image/jpeg",
        };
        var video_metadata = {
          contentType: "video/mp4",
        };

        return new Promise((resolve, reject) => {
		try {
		var promises = [];
        if (photos == null || photos == undefined) {
            resolve(null)
            return;
        }
		// Iterate through all chosen/taken pictures
        photos.forEach(async (image, index) => {
            // Does this one already have a directURL? 
            if (image.backendURL == null) {
                // this should porbably be a random string?
                var fileName = image.uri
                .substring(image.uri.lastIndexOf("/") + 1)
                .split(".")
                .slice(0, -1)
                .join(".");
                console.log("Trying to upload: ", image.uri, fileName);
                // Create blobs from the URIs (can this be refactored?)
                const response = await fetch(image.uri);
                const blob = await response.blob();
                // Individually upload each to firebase storage and add it to a promises array
                if (image.media_type == 'image') {
                    promises.push(
                    firebase
                        .storage()
                        .ref()
                        .child(`Images/${user.uid}/${fileName}`)
                        .put(blob, image_metadata)
                    );
                } else if (image.media_type == 'video') {
                    promises.push(
                    firebase
                        .storage()
                        .ref()
                        .child(`Videos/${user.uid}/${fileName}`)
                        .put(blob, video_metadata)
                    );
                }
            }
            // Check if all promises have been set and are being worked on
            if ( index == photos.length - 1) {
                setTimeout(() => {
                // Wait on the promises to resolve before finalizing
                console.log('Waiting on: ', promises.length, ' promises')
                if (promises.length==0) {
                    resolve(null)
                } else  {
                    Promise.all(promises).then(function (replies) {
                        // Map out the reply snapshots
                        replies.map((snapshot, snapIndex) => {
                        // Get the URLs
                        snapshot.ref.getDownloadURL().then(function (downloadURL) {
                            console.log("File available at", downloadURL);
                            photos[snapIndex].backendURL = downloadURL;
            
                            // Once all urls have been received make the final write (ffs)
                            if (allFilesReplied(photos)) {
                                resolve(photos)
                            }
                        });
                        });
                    });
                }

            }, 2000) // Wait for 2 seconds before checking that all promises have been fulfilled because I am lazy and not entirely sure how to do this properly
            }
        });

		} catch (e) {
		Alert.alert(e.message);
        console.error(e.message);
        reject('Error: ', e.message)
		}
    })
    };
	
    const finalizeSave = () => {
    try {
        var user = firebase.auth().currentUser;
        // Push the rest & storage URLs to real time database
        firebase
        .database()
        .ref(`/tours/${user.uid}/${tourID}/`)
        .push({
            name: name,
            size: size,
            cut: cut,
            year: year,
            manufacturer: manufacturer,
            images: jerseyPics.map((item) => ({
            location: item.location,
            source: item.source.backendURL,
            })),
        })
        .then(() => {
            console.log("Successfully saved to realtime database!");
            //Alert.alert('Saved successfully!')
        });
    } catch (e) {
        Alert.alert(e.message);
        console.error(e.message);
    }
    };


    // if the tour is null then show this while it loads
    if (props.tour == null){
        return (
            <View style={styles.internalContainer}>
            <ActivityIndicator size='large' />
            <Text>Loading...</Text>
        </View>
        );
    }
    else
    {
    // otherwise render this
    return (
        <View style={styles.internalContainer}>
            {anchorLoc != null &&
            <MapComponent 
            style={styles.mapStyle} 
            nodes={allNodes} 
            routes={allRoutes}
            location={anchorLoc} 
            deleteComponent={deleteComponent}
            updateComponent={updateComponent}
            carouselEnabled={true}
            showUser={false} />
            }
        </View>
    );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },    
    internalContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapStyle: {
        flex: 1,
        marginTop: -10,
        width: Dimensions.get('window').width,
    },
});

export default TourEditorModule;
