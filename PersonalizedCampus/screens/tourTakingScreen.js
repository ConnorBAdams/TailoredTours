import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, ActivityIndicator, Dimensions, TextInput, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/button'
import MapComponent from '../components/map'
import * as Location from 'expo-location'
import globalStyles from '../styles'

const searchTerms = [
  {
    id: '0',
    text: 'Featured',
  },
  {
    id: '1',
    text: 'Virtual Tour',
  },
  {
    id: '2',
    text: 'Popular',
  },
  {
    id: '3',
    text: 'Parks',
  },
  {
    id: '5',
    text: 'Museum',
  },
  {
    id: '6',
    text: 'Universities',
  },
];

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


    const Item = ({ item }) => (
      <View style={styles.item}>
        <Button 
        buttonStyle={globalStyles.touchableOpacityInverted}
        textStyle={globalStyles.touchableOpacityTextInverted}
        title={item.text} 
        onPress={() => {console.log('Pressed: ', item.text)}} />
      </View>
    );

    return (
    <SafeAreaView style={styles.container}>
		{location === null && <ActivityIndicator size="large" />}
		{location === null &&<Text>Loading...</Text>}
		{location != null && 
    <SafeAreaView >
      <View style={styles.searchBar}>
      <TextInput style={{...globalStyles.inputField, elevation: 2, width: Dimensions.get('window').width * 0.9}} 
      onChangeText={text => setSearchTerm(text)}
      inlineImageLeft='search_icon'
      placeholder='Search Tours'
      />
      <FlatList
        horizontal
        data={searchTerms}
        showsVerticalScrollIndicator ={false}
        showsHorizontalScrollIndicator={false}
        renderItem={Item}
        keyExtractor={item => item.id}
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
    flexDirection: 'column',
    justifyContent:'space-between',
    alignItems: 'flex-end',
    top: 30,
  },
  item: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
  },
});


export default TourTakingScreen;