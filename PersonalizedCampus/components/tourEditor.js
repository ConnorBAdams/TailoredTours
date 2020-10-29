import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, View, ActivityIndicator } from 'react-native';
import { useNavigation  } from '@react-navigation/native';
import MapComponent from '../components/map'
import firebase from 'firebase'

const TourEditorModule = props => {
    [anchorLoc, setAnchorLoc] = useState(null);
    [allNodes, setAllNodes] = useState(null);
    [tourID, setTourID] = useState(null);

    useEffect(() => {
        if (props.tour != null && props.tour.key != tourID)
        {
            console.log('Props not null', props.tour.key)
            buildNodes = [props.tour.child('anchor').val()]
            allRoutes = props.tour.child('routes').val()
            //props.tour.child('routes').foreach(element => console.log(element) )
            for (var i in allRoutes) {
                buildNodes.push.apply(buildNodes, allRoutes[i]['nodes'])
            }
            setAllNodes(buildNodes)
            setAnchorLoc({coords: {
                latitude: props.tour.child('anchor').child('latitude').val(),
                longitude: props.tour.child('anchor').child('longitude').val()}});
            setTourID(props.tour.key)

        }
    })


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
            <MapComponent style={styles.mapStyle} nodes={allNodes} onPress={e => console.log(e)} location={anchorLoc} showUser={false} />
            }
            <Text>Loading: {props.tour.key} for user: {props.tour.child('owner').val()}</Text>
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
        width: Dimensions.get('window').width,
        height: 400,
    },
});

export default TourEditorModule;
