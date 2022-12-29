import React, {FC, useState} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const Wheel = () => {
  return (
    <>
      <View style={styles.circleRow}>
        <View style={[styles.pizza, styles.pizzaRed]} />
        <View style={[styles.pizza, styles.pizzaBlue]} />
      </View>
      <View style={styles.circleRow}>
        <View style={[styles.pizza, styles.pizzaGreen]} />
        <View style={[styles.pizza, styles.pizzaYellow]} />
      </View>
    </>
  );
};

const Info: FC<{currentColor: string; currentAngle: number}> = ({
  currentAngle,
  currentColor,
}) => {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.text}>Current Color: {currentColor}</Text>
      <Text style={styles.text}>Current Angle: {currentAngle}</Text>
    </View>
  );
};

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
    if (currentAngle < 91) return 'Red';
    if (currentAngle < 181) return 'Green';
    if (currentAngle < 271) return 'Yellow';
    return 'Blue';
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View style={styles.circleContainer}>
          <View style={styles.pointer} />
          <Animated.View style={[styles.circle, animatedStyles]}>
            <Wheel />
          </Animated.View>
        </View>
      </GestureDetector>
      <Info currentAngle={currentAngle} currentColor={getCurrentColor()} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 16,
  },
  infoBox: {
    marginTop: 15,
    height: 40,
    justifyContent: 'space-between',
  },
  circleRow: {width: '100%', height: '50%', flexDirection: 'row'},
  pizza: {width: '50%', height: '100%'},
  pizzaRed: {backgroundColor: '#ce4257'},
  pizzaBlue: {backgroundColor: '#4361ee'},
  pizzaYellow: {backgroundColor: '#fee440'},
  pizzaGreen: {backgroundColor: '#06d6a0'},
  circle: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 150,
    borderWidth: 2,
    overflow: 'hidden',
    borderColor: '#ced4da',
  },
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
    backgroundColor: '#343a40',
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
