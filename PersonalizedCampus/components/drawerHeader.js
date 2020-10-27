import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

const DrawerHeader =({name, openDrawer})=> (
  <View style={styles.header}>
      <View style={styles.icon}>
      <TouchableOpacity onPress={()=>openDrawer()}>
          <Ionicons name="ios-menu" size={36} />
      </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
      </View>
  </View>
)

const styles = StyleSheet.create({
  header:{
      width:"100%",
      height: 150,
      backgroundColor: '#4633af',

    },
    icon: {
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingHorizontal:20,
      marginTop: 100,
    },
    textContainer: {
      marginTop: -36,
      flexDirection:"row",
      justifyContent:"center",
      alignItems:"center",
    },
    text: {
        fontSize: 24
    }
});

  export default DrawerHeader;