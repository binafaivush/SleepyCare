import * as React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'expo-router';
import { 
  View, 
  Text, 
  FlatList, 
  Pressable, 
  Linking, 
  Alert,
  ScrollView 
} from 'react-native';
import styles from '../styles/Meetings';
import Loader from '../components/Loader';
import { AppointmentType } from '../types/Meetings';
import { fetchAppointmentsByUserId ,fetchAppointmentsByCounselorId} from '../contexts/MeetingsService';

const Appointments: React.FC = () => {
  const router = useRouter();
  const userId = useSelector((state: any) => state.user.id);
  const userrole = useSelector((state: any) => state.user.role);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const fetchData = async () => {
    console.log("go in function fetchData", userId);
    setLoading(true);
    try {
      if (userId) {
        console.log(`Fetching appointments for user ID: ${userId}`);
        let response;
        if (userrole === 'parent') {
          response = await fetchAppointmentsByUserId(userId);
        } else {
          response = await fetchAppointmentsByCounselorId(userId);
        }
        if (!response || response.data.appointments.length === 0) {
          console.log("No appointments found for user ID:", userId);
        }
        console.log("data: ", response);
        setAppointments(response.data.appointments);
        setLoading(false);
        console.log("Appointments fetched successfully:", appointments);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const addAppointment = () => {
    router.push('/screens/addAppointment');
  };

  const toggleDropdown = (appointmentId: string) => {
    setActiveDropdown(activeDropdown === appointmentId ? null : appointmentId);
  };

  const selectMeetingType = (type: string) => {
    Alert.alert('Meeting Type', `Selected meeting type: ${type}`);
    setActiveDropdown(null);
  };

  const joinZoom = (zoomLink: string) => {
    if (zoomLink) {
      Linking.openURL(zoomLink);
    } else {
      Alert.alert('Zoom Link', 'No Zoom link available');
    }
  };

  const formatDate = (dateValue: string | number) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateValue: string | number) => {
    const date = new Date(dateValue);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return styles.statusApproved;
      case 'pending':
        return styles.statusPending;
      case 'rejected':
        return styles.statusRejected;
      default:
        return styles.statusPending;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '✗';
      default:
        return '⏳';
    }
  };

  const renderAppointmentCard = ({ item }: { item: AppointmentType }) => (
    <View style={styles.meetingCard}>
      <View style={styles.cardBorder} />
      
      <View style={styles.cardHeader}>
        <Text style={styles.meetingTitle}>📅 Meeting</Text>
        <Pressable
          style={styles.editMenuButton}
          onPress={() => toggleDropdown(item.id)}
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </Pressable>
        
        {activeDropdown === item.id && (
          <View style={styles.dropdownMenu}>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => selectMeetingType('phone')}
            >
              <Text style={styles.dropdownText}>📞 Phone</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => selectMeetingType('frontally')}
            >
              <Text style={styles.dropdownText}>👥 Frontally</Text>
            </Pressable>
            <Pressable
              style={styles.dropdownItem}
              onPress={() => selectMeetingType('zoom')}
            >
              <Text style={styles.dropdownText}>🎥 Zoom</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.meetingDate}>
      
        <Text style={styles.dateText}>{formatDate(item.start_time)}</Text>
      </View>

      <View style={styles.meetingTimes}>
        <View style={styles.timeSlot}>
          <Text style={styles.timeText}>
            <Text style={styles.timeLabel}>Start:</Text> {formatTime(item.start_time)}
          </Text>
        </View>
        <View style={styles.timeSlot}>
          <Text style={styles.timeText}>
            <Text style={styles.timeLabel}>End:</Text> {formatTime(item.end_time)}
          </Text>
        </View>
      </View>

      {item.zoom_link && (
        <Pressable
          style={styles.zoomLink}
          onPress={() => joinZoom(item.zoom_link)}
        >
          <Text style={styles.zoomText}>🎥 Join Zoom</Text>
        </Pressable>
      )}

      <View style={[styles.status, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>
          {getStatusIcon(item.status)} {item.status.toUpperCase()}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={styles.emptyTitle}>No Appointments</Text>
      <Text style={styles.emptyDescription}>No appointments found in the system</Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorMessage}>
      <Text style={styles.errorText}>❌ Error loading appointments</Text>
      <Text style={styles.errorDetails}>{error}</Text>
    </View>
  );

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>📅 My Appointments</Text>
        <Text style={styles.headerSubtitle}>Manage all your meetings in one place</Text>
      </View>

      {userrole === 'parent' && (
        <Pressable style={styles.addButton} onPress={addAppointment}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      )}

      <View style={styles.content}>
        {loading ? (
          <View style={styles.loader}>
            <Loader />
          </View>
        ) : error ? (
          renderErrorState()
        ) : appointments.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderAppointmentCard}
            contentContainerStyle={styles.meetingsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {userrole === 'parent' && (
        <Pressable style={styles.floatingAction} onPress={addAppointment}>
          <Text style={styles.floatingActionText}>+</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Appointments;