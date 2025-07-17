
import { TouchableOpacity, Text, Animated, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSleepTimerContext } from '../contexts/SleepTimerContext';
import { useEffect, useRef } from 'react';
import styles from '../styles/FloatingTimerButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
export default function FloatingTimerButton() {
  const { isRunning } = useSleepTimerContext();
  const router = useRouter();
  const pathname = usePathname();

  const fadeAnim = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isRunning ? 1 : 0,
      duration: isRunning ? 300 : 200,
      useNativeDriver: true,
    }).start();
  }, [isRunning]);

  if (!isRunning ) return null;

  const isInTimerArea =
    pathname.includes('SleepTimer') 

  const handlePress = () => {
    if (isInTimerArea) {
      router.back(); 
        } else {
      router.push({
        pathname: '/screens/SleepTimer',
      });
    }
  };

  return (
    <Animated.View style={[styles.floatingButton, { opacity: fadeAnim },{ bottom: 80, right: 20 }]}>
      <TouchableOpacity onPress={handlePress} style={styles.touchable}>
      {isInTimerArea ? (
        <Ionicons name="arrow-forward" size={36}  />
      ) : (
        <View style={styles.iconWithText}>
          <Icon name="bed-outline" size={32}   />
          <Text style={styles.buttonText}>לטיימר שינה</Text>
        </View>
      )}
    </TouchableOpacity>
  </Animated.View>
);
}

