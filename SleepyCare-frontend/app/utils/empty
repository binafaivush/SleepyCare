import AsyncStorage from '@react-native-async-storage/async-storage';

export async function updateLastFeedingTime(time: string) {
  try {
    await AsyncStorage.setItem('lastFeedingTime', time);
    console.log('🍼 זמן האכלה עודכן:', time);
  } catch (err) {
    console.error('⚠️ שגיאה בעדכון זמן האכלה:', err);
  }
}
