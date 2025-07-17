import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ContentItem } from '../types/content';
import { COLORS } from '../constants';
import { useRouter } from 'expo-router';

interface ListItemCardProps {
  item: ContentItem;
}

const ListItemCard: React.FC<ListItemCardProps> = ({ item }) => {
  const router = useRouter();

  const handlePress = () => {
    console.log('Pressed list item:', item.id);
    // Here you can navigate to the specific article/video page later
  };

  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      {/* Image on the left */}
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      
      {/* Info on the right */}
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        <Text style={styles.author}>By: {item.author}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row', // This is key: image and info are side-by-side
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginHorizontal: 15, // Creates padding from the screen edges
    marginBottom: 20,    // Creates space between cards
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Important for the image to respect the border radius
  },
  thumbnail: {
    width: 100,
    height: 125, // Fixed height for a consistent look
  },
  infoContainer: {
    flex: 1, // Takes up the remaining space
    padding: 12,
    justifyContent: 'center', // Vertically center the text content
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  author: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
});

export default ListItemCard;