import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import "react-native-gesture-handler";

const DrawerHeader = ({ name, openDrawer, backButton }) => (
  <View style={styles.header}>
    <View style={styles.icon}>
      <TouchableOpacity style={{width: 50}} onPress={() => openDrawer()}>
        { (backButton != null && backButton)? <Feather name="arrow-left" size={36} color={"#fff"} /> :<Ionicons name="ios-menu" size={36} color={"#fff"} />}
      </TouchableOpacity>
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.text}>{name}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    marginTop: (Dimensions.get('window').height * 0.1),
    width: "100%",
    height: Dimensions.get('window').height * 0.1,
    backgroundColor: "#4633af",
    zIndex: 1000,
  },
  icon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    top: (Dimensions.get('window').height * 0.1)/3
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    bottom: 10
  },
  text: {
    color: "#fff",
    fontSize: 24,
  },
});

export default DrawerHeader;
