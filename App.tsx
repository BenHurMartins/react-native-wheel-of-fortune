import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const App = () => {
  const rotation = useSharedValue(0);
  const [currentAngle, setCurrentAngle] = useState(rotation.value);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{rotateZ: `${rotation.value}deg`}],
    };
  });

  const handleAngle = (value: number) => {
    setCurrentAngle(parseInt(value.toFixed(), 10));
  };
  const easing = Easing.bezier(0.23, 1, 0.32, 1);
  const gesture = Gesture.Pan().onUpdate(e => {
    rotation.value = withTiming(
      Math.abs(e.velocityY) / 7 + rotation.value,
      {
        duration: 1000,
        easing: easing,
      },
      () => runOnJS(handleAngle)(rotation.value % 360),
    );
  });

  const getCurrentColor = () => {
    const angle = currentAngle % 360;
    const possibleValues = [
      {color: 'red', maxAngle: 90},
      {color: 'green', maxAngle: 180},
      {color: 'yellow', maxAngle: 270},
      {color: 'blue', maxAngle: 260},
    ];
    const color = possibleValues.reduce((prev, curr, ix) => {
      if (ix === 0 && angle === 0) return 'blue';
      if (ix === 0 && curr.maxAngle > angle) return curr.color;
      if (
        ix > 0 &&
        curr.maxAngle > angle &&
        possibleValues[ix - 1].maxAngle < angle
      )
        return curr.color;
      return prev;
    }, '');
    return color || 'blue';
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.circleContainer}>
          <View style={styles.pointer} />

          <Animated.View style={[styles.circle, animatedStyles]}>
            <View style={styles.circleRow}>
              <View style={styles.pizzaRed} />
              <View style={styles.pizzaBlue} />
            </View>
            <View style={styles.circleRow}>
              <View style={styles.pizzaGreen} />
              <View style={styles.pizzaYellow} />
            </View>
          </Animated.View>
        </View>
      </GestureDetector>
      <Text>Current Color = {getCurrentColor()}</Text>
      <Text>Current Angle = {currentAngle}</Text>
      {/* <Ball /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    borderWidth: 2,
    overflow: 'hidden',
  },
  circleRow: {width: '100%', height: '50%', flexDirection: 'row'},
  pizzaRed: {width: '50%', height: '100%', backgroundColor: 'red'},
  pizzaBlue: {width: '50%', height: '100%', backgroundColor: 'blue'},
  pizzaYellow: {width: '50%', height: '100%', backgroundColor: 'yellow'},
  pizzaGreen: {width: '50%', height: '100%', backgroundColor: 'green'},
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointer: {
    width: 10,
    height: 30,
    backgroundColor: 'black',
    position: 'absolute',
    top: -15,
    borderWidth: 2,
    borderColor: 'white',
    zIndex: 6000,
  },
});

export default App;
