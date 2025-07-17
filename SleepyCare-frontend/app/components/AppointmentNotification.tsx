import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Animated } from 'react-native';
import { Reminder } from '../types/reminder';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { reminderService } from '../contexts/reminderService';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const NOTIFICATION_THRESHOLD_MINUTES = 30;
const REFRESH_INTERVAL = 60000; // 1 minute

const AppointmentNotification: React.FC = () => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextReminder, setNextReminder] = useState<Reminder | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();
  
  // Get both user ID and token from Redux
  const { id: userId, token: authToken } = useSelector((state: RootState) => state.user);

  const loadUpcomingAppointments = async () => {
    try {
      if (!userId || !authToken) {
        console.log('No user ID or token available, user probably not logged in');
        setLoading(false);
        return;
      }

      console.log('Fetching appointments for user:', userId);
      const appointments = await reminderService.getUpcomingAppointments(userId);
      console.log('Fetched appointments:', appointments);

      if (!appointments || appointments.length === 0) {
        console.log('No appointments found');
        setNextReminder(null);
        setLoading(false);
        return;
      }

      const upcoming = appointments.find((reminder) => {
        const reminderTime = new Date(reminder.time).getTime();
        const diffInMinutes = (reminderTime - Date.now()) / (1000 * 60);
        return diffInMinutes > 0 && diffInMinutes <= NOTIFICATION_THRESHOLD_MINUTES;
      });
      
      console.log('Found upcoming appointment:', upcoming);
      
      if (upcoming) {
        setNextReminder(upcoming);
        fadeAnim.setValue(0); // Reset animation
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        setNextReminder(null);
      }
    } catch (err) {
      console.error('Failed to load upcoming appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load upcoming appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('AppointmentNotification mounted. User ID:', userId);
    return () => console.log('AppointmentNotification unmounted');
  }, []);

  useEffect(() => {
    if (userId) {
      console.log('Loading appointments for user:', userId);
      loadUpcomingAppointments();

      // Set up auto-refresh
      const intervalId = setInterval(() => {
        console.log('Refreshing appointments...');
        loadUpcomingAppointments();
      }, REFRESH_INTERVAL);

      return () => clearInterval(intervalId);
    } else {
      console.log('No user ID available, skipping appointment load');
      setLoading(false);
    }
  }, [userId]);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDismissed(true);
    });
  };

  if (!userId) {
    console.log('No user ID, not showing notification');
    return null;
  }

  if (loading) {
    return <ActivityIndicator size="small" color="#2196F3" style={styles.loading} />;
  }
  
  if (isDismissed || !nextReminder) {
    return null;
  }
  
  if (error) {
    console.error('Notification error:', error);
    return null;
  }

  const timeUntilAppointment = () => {
    const now = new Date();
    const appointmentTime = new Date(nextReminder.time);
    const diffInMinutes = Math.floor((appointmentTime.getTime() - now.getTime()) / (1000 * 60));
    return `in ${diffInMinutes} minutes`;
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.notification}>
        <Pressable 
          style={styles.contentContainer}
          onPress={() => {
            console.log('Navigating to Reminders with ID:', nextReminder.id);
            router.push({
              pathname: '/screens/Reminders',
              params: { reminderId: nextReminder.id },
            });
          }}
        >
          <View style={styles.textContainer}>
            <Text style={styles.notificationText}>
              Upcoming meeting with {nextReminder.clientName}
            </Text>
            <Text style={styles.timeText}>
              {new Date(nextReminder.time).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {' '}
              <Text style={styles.countdown}>{timeUntilAppointment()}</Text>
            </Text>
          </View>
        </Pressable>
        <Pressable 
          onPress={handleDismiss} 
          style={styles.iconButton}
          accessibilityLabel="Close notification"
        >
          <Icon name="close" size={20} color="#1a1a1a" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  notification: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  notificationText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'left',
  },
  timeText: {
    color: '#666666',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
  },
  countdown: {
    color: '#2196F3',
    fontWeight: '500',
  },
  loading: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  iconButton: {
    marginLeft: 12,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
});

export default AppointmentNotification;
