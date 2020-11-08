import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, Dimensions, Animated} from 'react-native';
import SlidingUpPanel from 'rn-sliding-up-panel';
import Button from './button'

const { height } = Dimensions.get("window") ;

const CarouselItem = props => {
    const [draggableRange, setDraggableRange] = useState({top: height + 180 - 64, bottom: 180})
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
        <View style={styles.container}>
        <SlidingUpPanel
          ref={c => (panel = c)}
          draggableRange={draggableRange}
          animatedValue={_draggedValue}
          snappingPoints={[150]}
          height={750}
          friction={0.5}
          style={{zIndex: 10, elevation: 10}}
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
            <View style={styles.bottomContainer}>
              <Text>Bottom view content</Text>
              <Button title='Is this clickable?' style={{elevation: 5, zIndex: 5}} onPress={() => (console.log('yes it is'))} />
            </View>
        </View>
        </SlidingUpPanel>
      </View>
    )  
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10, elevation: 10,
    },
    panel: {
        flex:1,
        backgroundColor: "white",
        zIndex: 10, elevation: 10,
    },
    panelHeader: {
        height: 100,
        backgroundColor: "#b197fc",
        justifyContent: "flex-end",
        padding: 24,
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
        top: -24,
        right: 18,
        width: 48,
        height: 48,
        zIndex: 1
    },
    iconBg: {
        backgroundColor: "#2b8a3e",
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
