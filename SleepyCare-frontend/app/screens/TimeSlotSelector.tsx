import { useState } from "react";
import { Pressable, StyleSheet, ScrollView, Text, View } from "react-native";

const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
];

interface TimeSlotSelectorProps {
  selectedDate: string | undefined;
  onTimeSelected?: (timeSlot: string) => void;
}

const TimeSlotSelector = ({ selectedDate, onTimeSelected }: TimeSlotSelectorProps) => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const formatTimeSlot = (startTime: string): string => {
    const [hour, minute] = startTime.split(":").map(Number);
    const endMinutes = hour * 60 + minute + 30;
    const endHour = Math.floor(endMinutes / 60) % 24;
    const endMinute = endMinutes % 60;
    const formattedEnd = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
    return `${startTime}-${formattedEnd}`;
  };

  const handleSelect = (time: string) => {
    const selected = formatTimeSlot(time);
    setSelectedSlot(selected);
    if (onTimeSelected) onTimeSelected(selected);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {TIME_SLOTS.map((time) => {
          const formatted = formatTimeSlot(time);
          const isSelected = selectedSlot === formatted;

          return (
            <Pressable
              key={formatted}
              onPress={() => handleSelect(time)}
              style={[
                styles.timeSlot,
                isSelected && styles.selectedSlot,
              ]}
            >
              <Text style={[
                styles.timeText,
                isSelected && styles.selectedText,
              ]}>
                {formatted}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default TimeSlotSelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    // marginBottom: 20,
  },
  scrollContainer: {
    flexDirection: 'column',
    gap: 10,
    // paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 14,
    textAlign: 'center',
    color: '#008080',
  },
  timeSlot: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  selectedSlot: {
    backgroundColor: '#e0e0e0',
    borderColor: '#008080',
    borderWidth: 2,
  },
  timeText: {
    fontSize: 16,
    color: '#008080',
  },
  selectedText: {
    color: '#008080',
    fontWeight: 'bold',
  },
});
