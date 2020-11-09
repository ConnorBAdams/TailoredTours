import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Button from './button'

const { height } = Dimensions.get("window") ;

const CarouselItem = props => {
    const [draggableRange, setDraggableRange] = useState({top: height + 40 , bottom: 180})
    const { top, bottom } = draggableRange;
    const _draggedValue = new Animated.Value(180);

    const backgoundOpacity = _draggedValue.interpolate({
      inputRange: [height - 48, height],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });

    const iconTranslateY = _draggedValue.interpolate({
      inputRange: [height - 56, height, top],
      outputRange: [0, 56, 180 - 32],
      extrapolate: "clamp"
    });

    const textTranslateY = _draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, 8],
      extrapolate: "clamp"
    });

    const textTranslateX = _draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, -50],
      extrapolate: "clamp"
    });

    const textScale = _draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [1, 0.7],
      extrapolate: "clamp"
    });

    return (
        <SlidingUpPanel
          ref={c => (panel = c)}
          draggableRange={draggableRange}
          animatedValue={_draggedValue}
          snappingPoints={[360]}
          height={750}
          friction={0.5}
          style={{zIndex: 10}}
        >
        <View style={styles.panel}>
            <Animated.View
              style={[
                styles.iconBg,
                {
                  opacity: backgoundOpacity,
                  transform: [{ translateY: iconTranslateY }]
                }
              ]}
            />
            <FontAwesome name="heart" size={24} style={styles.icon} />
            <View style={styles.panelHeader}>
              <Animated.View
                style={{
                  transform: [
                    { translateY: textTranslateY },
                    { translateX: textTranslateX },
                    { scale: textScale }
                  ]}}>
                <Text style={styles.textHeader}>{props.contents.name}</Text>
              </Animated.View>
            </View>
            <View style={styles.previewContainer}>
                <Text>Description: {props.contents.desc}</Text>
            </View>
            <View style={styles.bottomContainer}>
              <Text>Additional info as soon as I can get this fixed</Text>
              <TouchableOpacity onPress={() => (console.log('pressed the touchable opacity'))} onPressIn={(()=>console.log('pressin worked') )}>
                  <Text>Test button</Text>
              </TouchableOpacity>
            </View>
        </View>
        </SlidingUpPanel>
    )  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        backgroundColor:'red',
        flexGrow: 1
    },
    panel: {
        flex:1,
        backgroundColor: "white",
        zIndex: 10,
    },
    panelHeader: {
        height: 110,
        backgroundColor: '#4633af',
        justifyContent: "flex-end",
        padding: 24,
    },
    previewContainer: {
        padding: 20
    },
    bottomContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        height: 300,
    },
    textHeader: {
        fontSize: 28,
        color: "#FFF"
    },
    icon: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        color: '#413d52',
        top: -12,
        right: 6,
        width: 48,
        height: 48,
        zIndex: 1
    },
    iconBg: {
        backgroundColor: 'white',
        position: "absolute",
        top: -24,
        right: 18,
        width: 48,
        height: 48,
        borderRadius: 24,
        zIndex: 1
    },
});

export default CarouselItem;
