import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, View, ActivityIndicator } from 'react-native';
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
    }


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
        width: Dimensions.get('window').width,
    },
});

export default TourEditorModule;
