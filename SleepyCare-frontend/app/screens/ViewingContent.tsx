import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, StatusBar, Alert } from 'react-native';
import ContentCarousel from '../components/ContentCarousel';
import ExternalLink from '../components/ExternalLink';
import { ContentItem, ExternalLinkItem } from '../types/content';
import { useRouter } from 'expo-router';
import Loader from '../components/Loader';
import { COLORS } from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

// --- DUMMY DATA (Now with 'author' property to match the ContentItem type) ---
const dummyArticles: ContentItem[] = [
  { id: 'art1', title: '10 Tips for Positive Parenting', description: 'Discover effective strategies to foster a positive...', thumbnail: 'https://picsum.photos/seed/parenting1/400/300', author: 'Dr. Jane Doe' },
  { id: 'art2', title: 'Understanding Toddler Tantrums', description: 'A guide to understanding the causes of tantrums...', thumbnail: 'https://picsum.photos/seed/toddler2/400/300', author: 'John Smith' },
  { id: 'art3', title: 'The Importance of a Bedtime Routine', description: 'Learn why a consistent bedtime routine is crucial...', thumbnail: 'https://picsum.photos/seed/bedtime3/400/300', author: 'Dr. Emily Carter' },
  { id: 'art4', title: 'Healthy Eating Habits for Kids', description: 'Simple ways to encourage your children...', thumbnail: 'https://picsum.photos/seed/food4/400/300', author: 'Nutrition Experts' },
];

const dummyVideos: ContentItem[] = [
  { id: 'vid1', title: 'Communicate with Your Teen', description: 'Practical tips for opening up communication...', thumbnail: 'https://picsum.photos/seed/teen1/400/300', author: 'Family Center' },
  { id: 'vid2', title: 'Creative Play Ideas', description: 'Get inspired with fun and educational play activities.', thumbnail: 'https://picsum.photos/seed/play2/400/300', author: 'Playful Learning' },
  { id: 'vid3', title: 'Mindfulness for a Calmer Household', description: 'Learn simple mindfulness exercises to practice...', thumbnail: 'https://picsum.photos/seed/mindful3/400/300', author: 'Peaceful Minds' },
  { id: 'vid4', title: 'Navigating Sibling Rivalry', description: 'Strategies to help manage conflicts between siblings.', thumbnail: 'https://picsum.photos/seed/siblings4/400/300', author: 'Dr. John Smith' },
  { id: 'vid5', title: 'Building Resilience in Children', description: 'Help your children build the skills to cope...', thumbnail: 'https://picsum.photos/seed/resilience5/400/300', author: 'ChildDev Institute' },
];

const dummyExternalLinks: ExternalLinkItem[] = [
  { id: 'ext1', title: 'Parenting Support Center', url: 'https://example.com/parenting-support' },
  { id: 'ext2', title: 'Child Development Institute', url: 'https://example.com/child-development' },
];

const ViewingContentScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [articles, setArticles] = useState<ContentItem[]>([]);
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [externalLinks, setExternalLinks] = useState<ExternalLinkItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const role = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    // ... (Your useEffect logic remains the same)
    const fetchContentWithDummyData = () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setArticles(dummyArticles);
          setVideos(dummyVideos);
          setExternalLinks(dummyExternalLinks);
        } catch (error) {
          console.error('Error setting dummy data:', error);
          Alert.alert('Error', 'Failed to load dummy content.');
        } finally {
          setLoading(false);
        }
      }, 1000);
    };
    fetchContentWithDummyData();
  }, []);

  const router = useRouter();
  const handleViewAllArticles = () => { router.push({ pathname: '/screens/allArticles', params: { items: JSON.stringify(articles), title: 'All Articles' } }); };
  const handleViewAllVideos = () => { router.push({ pathname: '/screens/allVideos', params: { items: JSON.stringify(videos), title: 'All Videos' } }); };

  if (loading) return <Loader />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {role === 'counselor' && (
        <Pressable style={styles.floatingAddButton} onPress={() => router.push('/screens/ContentManagerScreen')}>
          <MaterialCommunityIcons name="file-upload" size={28} color="#888" style={{ marginRight: 8 }} />
          <Text style={styles.addButtonText}>Add Content</Text>
        </Pressable>
      )}
      <ScrollView style={styles.scrollView}>
        {/* <View style={styles.headerContainer}> */}
        {/*   ...הסרנו את הכפתור מכאן... */}
        {/* </View> */}
        <ContentCarousel title="Recommended Articles" data={articles} onViewAllPress={handleViewAllArticles} />
        <ContentCarousel title="Helpful Videos" data={videos} onViewAllPress={handleViewAllVideos} />
        {externalLinks.length > 0 && (
          <View style={styles.externalLinksSection}>
            <Text style={styles.sectionTitle}>Useful External Links</Text>
            {externalLinks.map(link => <ExternalLink key={link.id} link={link} />)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  scrollView: { flex: 1, paddingTop: 80 },
  headerContainer: { paddingHorizontal: 15, paddingTop: 20 },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginLeft: 15,
    marginBottom: 15,
    marginTop: 10,
  },
  externalLinksSection: { marginTop: 20 },
  addCircle: {
    backgroundColor: COLORS.primary, // Turquoise
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 15,
    right: 15,
    elevation: 4,
  },
  floatingAddButton: {
    position: 'absolute',
    top: 25,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#888', // light gray
    backgroundColor: '#fff',
    elevation: 0,
    zIndex: 10,
  },
  addButtonText: {
    color: '#888', // light gray
    fontSize: 15,
    fontWeight: 'bold',
  }
});

export default ViewingContentScreen;