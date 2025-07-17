// src/components/ReminderItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Linking, StyleSheet, Alert } from 'react-native';
import { Reminder } from '../types/content'; // Ensure path is correct

interface ReminderItemProps {
  reminder: Reminder;
  // Optional prop to specify if this item is being rendered for a counselor
  // This could help in conditional rendering if needed, though clientName check is often enough
  // isCounselorView?: boolean;
}

const MINUTES_BEFORE_TO_SHOW_LINK = 15;
const MINUTES_AFTER_TO_SHOW_LINK = 60;

const ReminderItem: React.FC<ReminderItemProps> = ({ reminder }) => {
  const { title, time, description, zoomLink, clientName } = reminder; // Added clientName
  const now = new Date();
  const meetingTime = new Date(time);

  const isUpcomingMeeting = () => {
    if (!zoomLink) return false;
    const startTimeToShow = new Date(meetingTime.getTime() - MINUTES_BEFORE_TO_SHOW_LINK * 60000);
    const endTimeToShow = new Date(meetingTime.getTime() + MINUTES_AFTER_TO_SHOW_LINK * 60000);
    return now >= startTimeToShow && now <= endTimeToShow;
  };

  const handleOpenZoomLink = async () => {
    if (zoomLink) {
      const supported = await Linking.canOpenURL(zoomLink);
      if (supported) {
        await Linking.openURL(zoomLink);
      } else {
        Alert.alert('Error', `Cannot open link: ${zoomLink}`);
      }
    }
  };

  const formattedTime = meetingTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const formattedDate = meetingTime.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const todayDate = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {clientName && <Text style={styles.clientName}>Client: {clientName}</Text>} {/* Display client name */}
      <Text style={styles.time}>
        Time: {formattedTime}
        {formattedDate !== todayDate && ` (${formattedDate})`}
      </Text>
      {description && <Text style={styles.description}>{description}</Text>}
      {isUpcomingMeeting() && zoomLink && (
        <TouchableOpacity style={styles.zoomButton} onPress={handleOpenZoomLink}>
          <Text style={styles.zoomButtonText}>Join Zoom Meeting</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4, // Adjusted margin
  },
  clientName: { // Style for client name
    fontSize: 15,
    color: '#4A90E2', // A different color to distinguish
    fontStyle: 'italic',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  zoomButton: {
    backgroundColor: '#0E71EB',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  zoomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReminderItem;