// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, Image, Linking, Alert,StyleProp, ViewStyle } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { ContentItem } from '../types/content';

// interface ContentCardProps {
//   item: ContentItem;
//   cardStyle?: StyleProp<ViewStyle>;
// }

// const ContentCard: React.FC<ContentCardProps> = ({ item,cardStyle  }) => {
//   const handlePress = async () => {
//     try {
//       const supported = await Linking.canOpenURL(item.url.toString());

//       if (supported) {
//         await Linking.openURL(item.url.toString());
//       } else {
//         Alert.alert(`Error`, `Cannot open this URL: ${item.url.toString()}`);
//       }
//     } catch (error) {
//         console.error("Failed to open URL: ", error);
//         Alert.alert(`Error`, `Failed to open URL.`);
//     }
//   };

//   const typeIcon = item.type === 'Article' ? 'file-text-o' : 'youtube-play';

//   return (
// <TouchableOpacity style={[styles.card, cardStyle]} onPress={handlePress} activeOpacity={0.7}>
//       {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} resizeMode="cover" />}
//       <View style={styles.contentWrapper}>
//         <View style={styles.iconContainer}>
//           <Icon name={typeIcon} size={18} color="#4A90E2" />
//           <Text style={styles.typeText}>{item.type}</Text>
//         </View>
//         <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
//         <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
//         <Text style={styles.uploadedBy}>By: {item.uploaded_by}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginHorizontal: 8,
//     width: 280,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 5,
//     overflow: 'hidden', 
//   },
//   thumbnail: {
//     width: '100%',
//     height: 140,
//   },
//   contentWrapper: {
//     padding: 15,
//   },
//   iconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   typeText: {
//     marginLeft: 8,
//     fontSize: 12, 
//     color: '#4A90E2',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//   },
//   title: {
//     fontSize: 17, 
//     fontWeight: 'bold',
//     color: '#333333',
//     marginBottom: 6,
//     minHeight: 40, 
//   },
//   description: {
//     fontSize: 13, 
//     color: '#666666',
//     marginBottom: 10,
//     minHeight: 50, 
//   },
//   uploadedBy: {
//     fontSize: 12,
//     color: '#888888',
//     marginTop: 'auto',
//   },
// });

// export default ContentCard;
import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { ContentItem } from '../types/content';
import { COLORS } from '../constants';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

interface ContentCardProps {
  item: ContentItem;
}

const ContentCard: React.FC<ContentCardProps> = ({ item }) => {
  const router = useRouter();
  
  // Decide if it's a video or article based on some logic
  // For now, let's assume if it's in the 'vid' dummy data, it's a video.
  const isVideo = item.id.startsWith('vid');

  const handlePress = () => {
    // Navigate to a detail screen when pressed
    // You can adapt this later
    console.log('Pressed item:', item.id);
  };

  return (
    <Pressable onPress={handlePress} style={styles.cardContainer}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        {isVideo && (
          <MaterialCommunityIcons 
            name="play-circle" 
            size={24} 
            color={COLORS.primary} // Turquoise color!
            style={styles.playIcon} 
          />
        )}
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        <Text style={styles.author}>By: {item.author}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 240, // Reduced card width
    marginRight: 12,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    overflow: 'hidden', // Ensures the image respects the border radius
  },
  thumbnail: {
    width: '100%',
    height: 120, // Adjusted height for a smaller card
  },
  infoContainer: {
    padding: 12,
  },
  playIcon: {
    position: 'absolute',
    top: -15, // Position it half over the image, half over the info
    right: 12,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    minHeight: 40, // Ensure consistent height
  },
  author: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default ContentCard;