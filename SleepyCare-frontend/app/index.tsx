import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { registerTranslation } from 'react-native-paper-dates';
import { colors } from "./constants";


import PersonalDetailsEditScreen from './screens/PersonalDetailsEditScreen';
import ReminderItem from './components/ReminderItem';

import OpeningScreen from './screens/OpeningScreen';
export default function Index() {
  const router = useRouter();

  // אפשר להחליף בין הקומפוננטות כאן לפי הצורך
  return (
    <OpeningScreen/>
  
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#238',
    fontSize: 25,
    marginTop: 30,
    marginBottom: 30,
  },
  pressable: {
    padding: 8,
    fontSize: 20,
    backgroundColor: colors.pink,
    borderRadius: 5,
    margin: 10,
    width: 260,
  },
});
