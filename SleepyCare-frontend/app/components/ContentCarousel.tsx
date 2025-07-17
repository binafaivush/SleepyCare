import React from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../constants';
import { ContentItem } from '../types/content';
import ContentCard from './ContentCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Make sure this import is here

interface ContentCarouselProps {
  title: string;
  data: ContentItem[];
  onViewAllPress: () => void;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, data, onViewAllPress }) => {
  const showViewAll = data.length > 3;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {showViewAll && (
          <Pressable onPress={onViewAllPress} style={styles.viewAllContainer}>
            <Text style={styles.viewAllText}>View All</Text>
            {/* This is the new arrow icon */}
            <MaterialCommunityIcons 
              name="chevron-right" 
              size={20} 
              color={COLORS.primary} 
            />
          </Pressable>
        )}
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <ContentCard item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 25,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  // Container for the "View All" text and the new arrow
  viewAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Style for the text itself
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary, // Turquoise color
  },
  listContentContainer: {
    paddingLeft: 15,
    paddingRight: 5,
  },
});

export default ContentCarousel;