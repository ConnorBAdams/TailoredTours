import React, { useState, useEffect } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, TextInput } from "react-native";
import globalStyles from '../styles'
import Button from './button'

const MarkerEditorComponent = props => {
    const [title, setTitle] = useState(props.node.name)
    const [description, setDescription] = useState(props.node.description)

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={props.visible}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>Edit tour node:</Text>
                <TextInput placeholder="Node Title" 
                value={title}
                style={globalStyles.inputField} 
                onChangeText={text => setTitle(text)}/>
                <TextInput placeholder="Node Description" multiline={true} 
                value={description}
                style={globalStyles.inputField} 
                onChangeText={text => setDescription(text)} />
                <Button title="Submit"
                onPress={() => { props.toggle(); props.onSubmit(title, description) }} />
                <Button title="Cancel"
                onPress={() => { props.toggle() }} />
                {/* <Button title="Delete"
                onPress={() => { props.toggle() }} /> 
                This option needs to be added since I often add a node by accident
                and have no way of deleting it. */}
            </View>
            </View>
        </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 24,
    textAlign: "center"
  }
});

export default MarkerEditorComponent;