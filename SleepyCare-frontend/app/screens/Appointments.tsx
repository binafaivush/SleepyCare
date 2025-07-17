import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';
import styles from '../styles/appointments';
import { AppointmentType } from '../constants';
import { View, Text, ActivityIndicator, FlatList, StyleSheet, Pressable } from 'react-native';
import Appointment from '../components/Appointment';
import Loader from '../components/Loader';
import { url } from '../constants';
import ErrorScreen from './ErrorsScreen';
import { Ionicons } from '@expo/vector-icons';

const Appointments: React.FC = () => {

  const router = useRouter();

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(url);
        console.log("the data: ", response.data);
        setAppointments(response.data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.viewPressable}>
        {/* <Pressable style={styles.addButtons} onPress={() => router.push('/screens/addAppointment')}>
          <Ionicons name="add" size={24} style={styles.plus} />
        </Pressable> */}
      </View>
      {loading ? (
        <Loader />) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : appointments.length === 0 ? (<>
          <Text style={styles.error}>appointments not found</Text>
          <ErrorScreen errorType="empty" /></>
        ) : (
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.client_id}
          renderItem={({ item }) => <Appointment />}
          ListEmptyComponent={<Text>No appointments found</Text>}
        />
      )}
    </View>
  );
};



export default Appointments;
