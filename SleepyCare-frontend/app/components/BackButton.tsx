import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPressBeforeGoBack?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPressBeforeGoBack }) => {
  const handlePress = () => {
    if (onPressBeforeGoBack) {
      onPressBeforeGoBack();
    }
    router.back();
  };

  return (
    <Pressable style={styles.circle} onPress={handlePress}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
