import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import MapComponent from '../components/map'
import * as Location from 'expo-location'
import globalStyles from '../styles'

const TourTakingScreen = props => {
	const [location, setLocation] = useState(null);
	const [errorMsg, setErrorMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
			setErrorMsg('Permission to access location was denied, is is required for the map');
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        console.log(location)
      })();
    }, []);
    const navigation = useNavigation();

    return (
    <SafeAreaView style={styles.container}>
		{location === null && <ActivityIndicator size="large" />}
		{location === null &&<Text>Loading...</Text>}
		{location != null && 
    <SafeAreaView >
      <View style={styles.searchBar}>
      <TextInput style={{...globalStyles.inputField, width: Dimensions.get('window').width * 0.9}} 
      onChangeText={text => setSearchTerm(text)}
      inlineImageLeft='search_icon'
      placeholder='Search Tours'
      />
      
      </View>
      <MapComponent location={location} style={styles.map} showUser={true} takingTour={true} /> 
    </SafeAreaView>
    }
    </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    margin: '15%',
    alignContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchBar: {
    zIndex: 1,
    position:'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'flex-end',
    top: 30,
  }
});


export default TourTakingScreen;