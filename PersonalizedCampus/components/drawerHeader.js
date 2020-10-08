import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import 'react-native-gesture-handler';

const DrawerHeader = ({name, openDrawer}) => {
    return (
        <View style={styles.header}>
        <TouchableOpacity onPress={()=>openDrawer()}>
            <Ionicons name="ios-menu" size={32} />
        </TouchableOpacity>
        <Text>{name}</Text>
        <Text style={{width:50}}></Text>
      </View>
    )
    }


  const styles = StyleSheet.create({
    header:{
      width:"100%",
      height:60,
      backgroundColor: 'lightblue',
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      paddingHorizontal:20
    }
  });

  export default DrawerHeader;