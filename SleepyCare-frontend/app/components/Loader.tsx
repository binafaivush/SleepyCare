import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const CalmLoader = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, { transform: [{ scale: scaleAnim }] }]} />
      <Text style={styles.text}>Please wait...</Text>
    </View>
  );
};

export default CalmLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500'
  }
});
