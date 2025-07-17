import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useFeedingTimerContext } from '../contexts/FeedingTimerContext';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/Timer';

export default function FeedingTimer() {
  const { isRunning, startTime, elapsedSeconds, start, stop, reset } = useFeedingTimerContext();
  const router = useRouter();

  const formatTime = () => {
    const min = Math.floor(elapsedSeconds / 60);
    const sec = elapsedSeconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (isRunning) return Alert.alert('הטיימר כבר פועל');
    start();
  };

  // const handleStop = () => {
  //   if (!isRunning) return Alert.alert('הטיימר אינו פעיל');
  //   const endTime = new Date();
  //   stop();
  //   router.push({
  //     pathname: '/screens/FeedingForm',
  //     params: {
  //       start: startTime?.toISOString(),
  //       end: endTime.toISOString(),
  //       seconds: elapsedSeconds.toString(),
  //     },
  //   });
  // };

  const handleStop = () => {
  if (!isRunning) return Alert.alert('הטיימר אינו פעיל');

  const endTime = new Date();

  stop();

  router.push({
    pathname: '/screens/FeedingForm',
    params: {
      start: startTime?.toISOString(),
      end: endTime.toISOString(),
      seconds: elapsedSeconds.toString(),
    },
  });

  // מאפס את הטיימר רק אחרי שהניווט התרחש
  setTimeout(() => {
    reset();
  }, 300); // אפשר גם 500ms אם יש דיליי ניווט באפליקציה שלך
};
  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>🍼 {formatTime()}</Text>
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity style={styles.button} onPress={isRunning ? handleStop : handleStart}>
          <Icon name={isRunning ? 'stop' : 'play'} size={20} color="#FFF" />
          <Text style={styles.buttonText}>{isRunning ? 'סיים' : 'התחל'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={reset}>
          <Icon name="refresh" size={20} color="#FFF" />
          <Text style={styles.buttonText}>איפוס</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
