import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import ReminderItem from '../components/ReminderItem';
import Loader from '../components/Loader';
import { Reminder } from '../types/content';
import { RootState } from '../store/store';

const API_BASE_URL = 'https://your-api.com/api/v1';

const fetchCounselorReminders = async (userId: string, authToken: string): Promise<Reminder[]> => {
  if (!userId || !authToken) {
    console.warn("CounselorRemindersScreen: User ID or Auth Token is missing from Redux store.");
    throw new Error("Authentication details not found. Please log in again.");
  }

  const API_ENDPOINT = `${API_BASE_URL}/users/${userId}/reminders`;
  console.log(`Fetching counselor reminders from ${API_ENDPOINT} for user ${userId}`);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {}
      console.error(`API Error (${API_ENDPOINT}): ${response.status} - ${errorMessage}`);
      if (response.status === 401 || response.status === 403) {
        Alert.alert("Authentication Error", "Your session may have expired. Please log in again.");
      }
      throw new Error(`Failed to fetch reminders: ${errorMessage}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
       console.error("API Error: Expected an array of reminders, got:", data);
       throw new Error("Invalid data format received from server.");
    }
    
    return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      time: new Date(item.time),
      description: item.description,
      zoomLink: item.zoomLink,
      clientName: item.clientName,
    }));

  } catch (error: any) {
    console.error('Error in fetchCounselorReminders:', error.message);
    throw error;
  }
};

const CounselorRemindersScreen: React.FC = () => {
  const userId = useSelector((state: RootState) => state.user.id);
  const authToken = useSelector((state: RootState) => state.user.token);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const fetchedReminders = await fetchCounselorReminders(userId, authToken);
      fetchedReminders.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      setReminders(fetchedReminders);
    } catch (e: any) {
      console.error("CounselorRemindersScreen: Failed to load reminders:", e);
      setError(e.message || 'An error occurred while loading reminders.');
    } finally {
      if (!isRefresh) setLoading(false);
      else setRefreshing(false);
    }
  }, [userId, authToken]);

  useEffect(() => {
    loadReminders();
    const intervalId = setInterval(() => {
      setReminders(prevReminders => [...prevReminders]);
    }, 60000);
    return () => clearInterval(intervalId);
  }, [loadReminders]);

  const onRefresh = useCallback(() => {
    loadReminders(true);
  }, [loadReminders]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <Loader />
        <Text>Loading your schedule...</Text>
      </View>
    );
  }

  if (error && reminders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => loadReminders()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Schedule</Text>
      </View>
      {error && reminders.length > 0 && !refreshing && (
          <Text style={styles.inlineErrorText}>{error} Pull down to refresh.</Text>
      )}
      <FlatList
        data={reminders}
        renderItem={({ item }) => <ReminderItem reminder={item} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>No upcoming appointments or reminders.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007AFF"]}
            tintColor={"#007AFF"}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
  header: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', alignItems: 'center', backgroundColor: '#ffffff' },
  headerText: { fontSize: 22, fontWeight: '600', color: '#2c3e50' },
  listContent: { paddingBottom: 20, flexGrow: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginBottom: 15 },
  inlineErrorText: { color: '#f39c12', textAlign: 'center', paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fff8e1', fontSize: 14},
  emptyText: { textAlign: 'center', fontSize: 17, color: '#7f8c8d' },
  retryButton: { marginTop: 20, backgroundColor: '#3498db', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, elevation: 4 },
  retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
});

export default CounselorRemindersScreen;