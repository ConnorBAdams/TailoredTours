import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import globalStyles from "../styles";
import Button from "../components/button";
import MapComponent from "./map";

const TourSetupComponent = (props) => {
  const [location, setLocation] = useState(null);
  const [tourTitle, setTourTitle] = useState(null);
  const [anchor, setAnchor] = useState(null);

  useEffect(() => {
    if (props.location != null && location == null) {
      setLocation(props.location);
      console.log(props.location);
    }
  });

  const isValidTourData = (text) => {
    setTourTitle(text);
  };

  const createAnchor = (e) => {
    console.log(
      "Anchor: ",
      e.nativeEvent.coordinate.latitude,
      e.nativeEvent.coordinate.longitude
    );
    setAnchor({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      name: "Anchor",
      radius: 1000,
      fillColor: (65, 61, 82),
      type: "Circle",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topOverlay}>
        <Text style={styles.titleText}>Tour Name:</Text>
        <TextInput
          style={{ ...globalStyles.inputField, marginTop: 0, marginBottom: 0 }}
          placeholder="Tour Name"
          onChangeText={(text) => isValidTourData(text)}
        />
        <Text style={styles.subtitleText}>Select general tour area</Text>
      </View>
      {location === null && <ActivityIndicator size="large" />}
      {location === null && <Text>Loading...</Text>}
      {location != null && (
        <View style={{ flex: 1, alignItems: "center" }}>
          <MapComponent
            style={styles.mapStyle}
            nodes={[anchor]}
            onPress={(e) => createAnchor(e)}
            location={location}
          />
          <View style={styles.bottomOverlay}>
            <Button
              title="Next Step"
              textStyle={{fontSize: 20}}
              buttonStyle={{width: 175,elevation: 5}}
              onPress={() => {
                props.submitTour({ title: tourTitle, anchor: anchor });
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.9,
  },
  titleText: {
    fontSize: 20,
    margin: 15,
  },
  subtitleText: {
    fontSize: 18,
    margin: 15,
  },
  topOverlay: {
    backgroundColor: "#fff",
    elevation: 20,
    zIndex: 20,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.33,
    shadowRadius: 4,
    position: "absolute",
    top: 10,
    alignItems: "center",
    borderRadius: 20,
    borderColor: '#4633af',
    borderWidth: 2,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 100,
  },
});

export default TourSetupComponent;