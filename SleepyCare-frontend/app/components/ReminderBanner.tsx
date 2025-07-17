import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/ReminderBanner'; 

export default function ReminderBanner() {
  const [showReminder, setShowReminder] = useState(false); 

  useEffect(() => {
    const checkLastFeedingTime = async () => {
      try {
        const lastTimeStr = await AsyncStorage.getItem('lastFeedingTime'); 
                if (!lastTimeStr) return;

        const lastTime = new Date(lastTimeStr); 
        const now = new Date();
        const diffMs = now.getTime() - lastTime.getTime();
        const diffMinutes = diffMs / (1000 * 60); 

        if (diffMinutes >= 1) {
          setShowReminder(true); 
        } else {
          setShowReminder(false); 
                }
      } catch (err) {
        console.error('שגיאה בבדיקת זמן האכלה:', err);
            }
    };

    checkLastFeedingTime(); 
    const interval = setInterval(checkLastFeedingTime, 30 * 1000); 
    return () => clearInterval(interval); 
  }, []);

  const clearFeedingTime = async () => {
    await AsyncStorage.removeItem('lastFeedingTime'); 
    setShowReminder(false); 
    console.log('🧹 זמן האכלה נמחק');
  };

  return (
    <View style={styles.wrapper}>
      {showReminder && ( 
        <View style={styles.banner}>
          <Text style={styles.text}>🍼 עברה דקה מההאכלה האחרונה!</Text>
          <TouchableOpacity onPress={clearFeedingTime} style={styles.ackButton}>
            <Text style={styles.ackButtonText}>אישור קיבלתי</Text>
          </TouchableOpacity>
        </View>
      )}
{/*       <Button title="איפוס זמן האכלה" onPress={clearFeedingTime} color="#4EB6AC" /> */}
    </View>
  );
}
