import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import ListItemCard from '../components/ListItemCard';
import { ContentItem } from '../types/content';
import { COLORS } from '../constants';
import BackButton from '../components/BackButton';

const AllArticlesScreen: React.FC = () => {
  const params = useLocalSearchParams<{ items?: string; title?: string }>();
  
  let articles: ContentItem[] = [];
  try {
    if (params.items) {
      articles = JSON.parse(params.items);
    }
  } catch (e) {
    console.error("Failed to parse articles:", e);
  }
  
  const screenTitle = params.title || 'Articles';

  return (
    <> 
      {/* 
        STEP 1: Tell the Stack to completely hide its own header.
        We will create our own header below.
      */}
      <Stack.Screen options={{ headerShown: false }} />

      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

        {/* 
          STEP 2: Create our own custom header inside the screen's content.
          This will appear below your global header.
        */}
        <View style={styles.customHeader}>
          <BackButton />
          <Text style={styles.headerTitle}>{screenTitle}</Text>
          {/* A placeholder view to keep the title centered correctly */}
          <View style={{ width: 40 }} /> 
        </View>
        
        {articles.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No articles to display.</Text>
          </View>
        ) : (
          <FlatList
            data={articles}
            renderItem={({ item }) => <ListItemCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </SafeAreaView>
    </>
  );
};

// --- Updated Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  // --- NEW STYLES FOR OUR CUSTOM HEADER ---
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // This helps center the title
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  // --- EXISTING STYLES ---
  listContainer: {
    paddingTop: 10, // Reduced padding because the header has its own
    paddingBottom: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default AllArticlesScreen;