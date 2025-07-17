import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Alert } from 'react-native';
import { ExternalLinkItem } from '../types/content';
import { COLORS } from '../constants';
import Feather from 'react-native-vector-icons/Feather'; // Using Feather for a clean 'external-link' icon
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ExternalLinkProps {
  link: ExternalLinkItem;
}

const ExternalLink: React.FC<ExternalLinkProps> = ({ link }) => {
  
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(link.url);
    if (supported) {
      await Linking.openURL(link.url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${link.url}`);
    }
  };

  return (
    <Pressable onPress={handlePress} style={styles.container}>
      <Feather 
        name="external-link" 
        size={22} 
        color={COLORS.primary} // Turquoise color!
        style={styles.icon}
      />
      <Text style={styles.title}>{link.title}</Text>
      <MaterialCommunityIcons 
        name="chevron-right" 
        size={22} 
        color={COLORS.textSecondary} 
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  icon: {
    marginRight: 15,
  },
  title: {
    flex: 1, // This makes the title take all available space
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
});

export default ExternalLink;