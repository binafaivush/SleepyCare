import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageSourcePropType, Dimensions } from 'react-native';

const errorImage: ImageSourcePropType = require('../../assets/images/error.jpg');

const { width } = Dimensions.get('window');

interface OopsScreenProps {
  onRetry: () => void; // פונקציה שתופעל בלחיצה על "Try Again"
}

const OopsScreen: React.FC<OopsScreenProps> = ({ onRetry }) => {
  return (
    <View style={styles.fullScreenContainer}>
      <Image source={errorImage} style={styles.illustration} />

      <Text style={styles.titleText}>Oops!</Text>

      <Text style={styles.messageText}>
        Something went wrong,{'\n'}
        on the way!
      </Text>

      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1, 
    justifyContent: 'center',
    alignItems: 'center',  
    paddingHorizontal: 30,  
  },
  illustration: {
    width: width * 0.7, 
    height: width * 0.5, 
    resizeMode: 'contain',
    marginBottom: 10, 
  },
  titleText: {
    fontSize: 40, 
    fontWeight: 'bold',
    color: '#D81B60', 
    marginBottom: 15,
    textAlign: 'center',
  },
  messageText: {
    fontSize: 17, 
    color: '#7f8c8d', 
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#D81B60', 
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OopsScreen;