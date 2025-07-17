import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from "react-native";
import { colors } from "../../constants";
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState } from "react";

const BUTTONS = [
  {
    label: "Appointments",
    icon: "calendar-check",
    screen: "Meetings",
    bg: colors.torkis,
  },
  {
    label: "Questionnaires",
    icon: "clipboard-list-outline",
    screen: "QuestionnaireConstruction", // עדכון שם המסך
    bg: colors.pink,
  },
  {
    label: "Parent Messages",
    icon: "message-text-outline",
    screen: "ParentMessages", // placeholder
    bg: colors.appBar,
  },
  {
    label: "Resources",
    icon: "folder-information-outline",
    screen: "ViewingContent",
    bg: colors.home,
  },
   {
    label: "Clients Dashboard",
    icon: "account-group-outline",
    screen: "DashboardClients",
    bg: "#A0D995",
  },
];

const CAROUSEL_ITEMS = [
  { text: '"Dear consultant! Thank you for your help! Our Yoni is much calmer now!!"', icon: "account-heart-outline" },
  { text: '"We finally sleep through the night. You changed our lives!"', icon: "account-heart-outline" },
  { text: '"Your support and advice made all the difference. Thank you!"', icon: "account-heart-outline" },
  { text: '"We appreciate your patience and professionalism. Highly recommended!"', icon: "account-heart-outline" },
  { text: '"Thanks to you, bedtime is no longer a struggle. Forever grateful!"', icon: "account-heart-outline" },
];

export default function SleepConsultant() {
  const router = useRouter();
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [pressedIdx, setPressedIdx] = useState<number | null>(null);
  const windowWidth = Dimensions.get('window').width;

  // קרוסלה אמיתית עם FlatList
  const onViewRef = React.useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCarouselIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={styles.scrollContent}>
      <View style={{ flexGrow: 1, width: '100%' }}>
        <Text style={styles.title}>Welcome, Consultant!</Text>
        <View style={styles.buttonsGrid}>
          {BUTTONS.map((btn, idx) => (
            <TouchableOpacity
              key={btn.label}
              style={[
                styles.buttonSquare,
                pressedIdx === idx && styles.buttonSquareActive,
                { backgroundColor: btn.bg },
              ]}
              onPress={() => router.push(`/screens/${btn.screen}` as any)}
              onPressIn={() => setPressedIdx(idx)}
              onPressOut={() => setPressedIdx(null)}
              activeOpacity={0.8}
            >
              <Icon name={btn.icon} size={36} color={btn.bg === colors.appBar || btn.bg === colors.home ? colors.torkis : '#fff'} style={{ marginBottom: 8 }} />
              <Text style={[styles.buttonText, { color: btn.bg === colors.appBar || btn.bg === colors.home ? colors.torkis : '#fff' }]}>{btn.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.carouselTitle}>Clients Share</Text>
      <View style={styles.carouselContainer}>
        <FlatList
          data={CAROUSEL_ITEMS}
          keyExtractor={(_, idx) => idx.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.carouselItem, { width: windowWidth * 0.8 }]}> 
              <Icon name={item.icon} size={28} color={colors.torkis} style={{ marginBottom: 4 }} />
              <Text style={styles.carouselText}>{item.text}</Text>
            </View>
          )}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={viewConfigRef.current}
          style={{ flexGrow: 0 }}
          snapToAlignment="center"
          decelerationRate={0.95}
          contentContainerStyle={{ alignItems: 'center' }}
        />
      </View>
      <View style={styles.carouselIndicators}>
        {CAROUSEL_ITEMS.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.carouselIndicator,
              carouselIndex === idx && styles.carouselIndicatorActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 16,
    color: colors.torkis,
    textAlign: 'center',
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 0, // אין רווח מתחת לכפתורים
    paddingHorizontal: 8,
  },

  buttonSquare: {
    flexBasis: '44%',
    maxWidth: 130,
    height: 130,//הגדלת גובה הכפתור לעורך
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    padding: 0,
    backgroundColor: '#fff',
    
  },
  buttonSquareActive: {
    elevation: 6,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.torkis,
    textAlign: 'center',
    marginBottom: 0, // אין רווח בין הכפתורים לכותרת הקרוסלה
    marginTop: 8,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 10, // less margin below carousel
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    padding: 12,
    width: '95%',
    maxWidth: 500,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    justifyContent: 'center',
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  carouselIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  carouselIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#b0b0b0',
    marginHorizontal: 4,
  },
  carouselIndicatorActive: {
    backgroundColor: colors.torkis,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  carouselText: {
    fontSize: 16,
    color: colors.torkis, // dark text for contrast
    textAlign: 'center',
  },
});
