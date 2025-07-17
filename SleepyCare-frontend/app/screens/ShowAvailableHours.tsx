// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ListRenderItem } from 'react-native';
// import { useAppDispatch } from '../store/hooks'; // שימוש ב-dispatch עם טיפוסיות
// import { Slot, selectSlots, setAvailableTimes } from '../store/availabilitySlice'; // נייבא את הפעולות הנכונות
// import Toast from 'react-native-toast-message';

// // Props שהקומפוננטה תקבל
// interface TimeSlotModalContentProps {
//   date: string;
//   counselorId: string;
//   onSelectionConfirmed: () => void; // פונקציה שתופעל כשהמשתמש יאשר את הבחירה
// }

// // זו בגדול הקומפוננטה AvailableTimesScreen, עם שינויים קלים
// const TimeSlotModalContent: React.FC<TimeSlotModalContentProps> = ({ date, counselorId, onSelectionConfirmed }) => {
//   const dispatch = useAppDispatch();

//   const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
//   const [availableTimes, setLocalAvailableTimes] = useState<Slot[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // לוגיקת fetch ו-calculateAvailableSlots נשארת בדיוק כפי שהייתה בקוד הקודם
//   // ... (העתק-הדבק את הפונקציות fetchAvailableTimes ו-calculateAvailableSlots לכאן)
  
//   useEffect(() => {
//     if (date && counselorId) {
//       fetchAvailableTimes(date, counselorId);
//     }
//   }, [date, counselorId]);

//   const fetchAvailableTimes = async (selectedDate: string, counselorId: string): Promise<void> => {
//     setLoading(true);
//     try {
//       // API endpoints for fetching appointments and availability
//       const appointmentsResponse = await fetch(`https://api.sleepycare.com/appointments?date=${selectedDate}&counselorId=${counselorId}`);
//       const availabilityResponse = await fetch(`https://api.sleepycare.com/availability?date=${selectedDate}&counselorId=${counselorId}`);
      
//       if (!appointmentsResponse.ok || !availabilityResponse.ok) throw new Error('Failed to fetch');
      
//       const appointments = await appointmentsResponse.json();
//       const availability = await availabilityResponse.json();

//       const slots = calculateAvailableSlots(appointments, availability);
//       setLocalAvailableTimes(slots);
//       dispatch(setAvailableTimes(slots)); // עדכון גם ב-Redux אם יש צורך במקומות אחרים
//     } catch (error) {
//       console.error('Error fetching available times:', error);
//       Toast.show({ type: 'error', text1: 'Failed to load data' });
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   const calculateAvailableSlots = (appointments: any[], availability: any): Slot[] => {
//    const slots: Slot[] = [];
//     if (!availability?.start_time || !availability?.end_time) {
//         return []; 
//     }
//     const start = new Date(availability.start_time);
//     const end = new Date(availability.end_time);
//     let current = new Date(start);

//     while (current < end) {
//       const slotStart = new Date(current);
//       const slotEnd = new Date(current);
//       slotEnd.setMinutes(slotEnd.getMinutes() + 30);

//       if (slotStart >= end || slotEnd > end) break;

//       const overlap = appointments.some((app) => {
//         const appStart = new Date(app.start_time);
//         const appEnd = new Date(app.end_time);
//         return (slotStart < appEnd && slotEnd > appStart);
//       });

//       if (!overlap) {
//         const startTime = `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')}`;
//         const endTime = `${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`;
//         slots.push({ 
//             timeRange: `${startTime}-${endTime}`,
//             startTime: startTime,
//             endTime: endTime
//         });
//       }
//       current = slotEnd;
//     }
//     return slots;
//   };
  


//   const handleSlotPress = (slot: Slot): void => {
//     // ... לוגיקת הלחיצה זהה לחלוטין לקוד הקודם
//     const isAlreadySelected = selectedSlots.some(s => s.timeRange === slot.timeRange);

//     if (isAlreadySelected) {
//       setSelectedSlots(prevSlots => prevSlots.filter(s => s.timeRange !== slot.timeRange));
//     } else {
//       if (selectedSlots.length === 0) {
//         setSelectedSlots([slot]);
//       } else if (selectedSlots.length === 1) {
//         const firstSlot = selectedSlots[0];
//         const isConsecutive = firstSlot.endTime === slot.startTime || firstSlot.startTime === slot.endTime;
//         if (isConsecutive) {
//            const newSelection = [...selectedSlots, slot].sort((a, b) => a.startTime.localeCompare(b.startTime));
//            setSelectedSlots(newSelection);
//         } else {
//             Toast.show({ type: 'error', text1: 'יש לבחור שעות רצופות' });
//         }
//       } else {
//         Toast.show({ type: 'error', text1: 'ניתן לבחור עד 2 פגישות' });
//       }
//     }
//   };

//   const handleConfirmSelection = (): void => {
//     if (selectedSlots.length === 0) return;

//     dispatch(selectSlots(selectedSlots));
    
//     Toast.show({
//       type: 'success',
//       text1: 'השעות נבחרו בהצלחה',
//       position: 'bottom',
//       visibilityTime: 1000,
//     });
    
//     // קרא לפונקציה שקיבלנו ב-props כדי לסגור את המודאל
//     onSelectionConfirmed();
//   };

//   const renderItem: ListRenderItem<Slot> = ({ item }) => {
//     const isSelected = selectedSlots.some(slot => slot.timeRange === item.timeRange);
//     return (
//       <TouchableOpacity
//         onPress={() => handleSlotPress(item)}
//         style={[styles.slotButton, isSelected && styles.selectedSlotButton]}
//       >
//         <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>
//           {item.timeRange}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     // חשוב: לא להשתמש ב-View עם flex:1, כי זה תוכן של מודאל
//     <View style={styles.modalContentContainer}>
//       <Text style={styles.headerText}>בחר/י שעה ({date})</Text>
//       <Text style={styles.subHeaderText}>ניתן לבחור עד שתי פגישות רצופות.</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 20 }}/>
//       ) : availableTimes.length === 0 ? (
//         <Text style={styles.noTimesText}>אין שעות פנויות בתאריך זה</Text>
//       ) : (
//         <FlatList
//           data={availableTimes}
//           keyExtractor={(item) => item.timeRange}
//           renderItem={renderItem}
//           style={{ maxHeight: 300 }} // הגבלת גובה כדי שהמודאל לא יתפוס את כל המסך
//         />
//       )}

//       {selectedSlots.length > 0 && (
//         <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmSelection}>
//             <Text style={styles.confirmButtonText}>
//                 {`אישור בחירה (${selectedSlots.length} פגישות)`}
//             </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // העיצובים יכולים להיות באותו קובץ או מיובאים
// const styles = StyleSheet.create({
//     modalContentContainer: { padding: 20, width: '100%' },
//     headerText: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
//     subHeaderText: { fontSize: 15, textAlign: 'center', marginBottom: 15, color: 'gray' },
//     noTimesText: { textAlign: 'center', fontSize: 16, color: 'red', marginVertical: 20 },
//     slotButton: { paddingVertical: 12, backgroundColor: '#FFFFFF', borderRadius: 10, marginVertical: 6, alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
//     selectedSlotButton: { backgroundColor: '#007AFF', borderColor: '#0056b3' },
//     slotText: { fontSize: 16, fontWeight: '600', color: '#007AFF' },
//     selectedSlotText: { color: '#FFFFFF' },
//     confirmButton: { marginTop: 20, backgroundColor: '#34C759', paddingVertical: 15, borderRadius: 12, alignItems: 'center' },
//     confirmButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }
// });

// export default TimeSlotModalContent;
// ----------------------------- TimeSlotModalContent.tsx -----------------------------

import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import Toast from 'react-native-toast-message';

export interface Slot {
  timeRange: string;
  startTime: string;
  endTime: string;
}

const MOCK_AVAILABILITY = {
  start_time: '2025-06-23T09:00:00',
  end_time: '2025-06-23T13:00:00'
};

const MOCK_APPOINTMENTS = [
  { start_time: '2025-06-23T10:00:00', end_time: '2025-06-23T10:30:00' },
  { start_time: '2025-06-23T11:30:00', end_time: '2025-06-23T12:00:00' }
];

const MockAvailabilityScreen = () => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlots = () => {
      try {
        const available = calculateAvailableSlots(MOCK_APPOINTMENTS, MOCK_AVAILABILITY);
        setSlots(available);
      } catch (err) {
        console.log("\u274C \u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05e2\u05ea \u05d9\u05e6\u05d9\u05e8\u05ea \u05e4\u05d2\u05d9\u05e9\u05d5\u05ea:", err);
        Toast.show({ type: 'error', text1: '\u05e9\u05d2\u05d9\u05d0\u05d4 \u05d1\u05d9\u05e6\u05d9\u05e8\u05ea \u05d4\u05e4\u05d2\u05d9\u05e9\u05d5\u05ea' });
      } finally {
        setLoading(false);
      }
    };

    loadSlots();
  }, []);

  const calculateAvailableSlots = (appointments: any[], availability: any): Slot[] => {
    const slots: Slot[] = [];
    const start = new Date(availability.start_time);
    const end = new Date(availability.end_time);
    let current = new Date(start);

    while (current < end) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + 30);

      const overlap = appointments.some((app) => {
        const appStart = new Date(app.start_time);
        const appEnd = new Date(app.end_time);
        return (slotStart < appEnd && slotEnd > appStart);
      });

      if (!overlap && slotEnd <= end) {
        const format = (date: Date) =>
          `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        slots.push({
          timeRange: `${format(slotStart)}-${format(slotEnd)}`,
          startTime: format(slotStart),
          endTime: format(slotEnd)
        });
      }
      current = slotEnd;
    }

    return slots;
  };

  const handleSlotPress = (slot: Slot): void => {
    const isSelected = selectedSlots.some(s => s.timeRange === slot.timeRange);

    if (isSelected) {
      setSelectedSlots(prev => prev.filter(s => s.timeRange !== slot.timeRange));
    } else {
      if (selectedSlots.length === 0) {
        setSelectedSlots([slot]);
      } else if (selectedSlots.length === 1) {
        const first = selectedSlots[0];
        const isConsecutive = first.endTime === slot.startTime || first.startTime === slot.endTime;
        if (isConsecutive) {
          setSelectedSlots([first, slot].sort((a, b) => a.startTime.localeCompare(b.startTime)));
        } else {
          Toast.show({ type: 'error', text1: '\u05d9\u05e9 \u05dc\u05d1\u05d7\u05d5\u05e8 \u05e9\u05e2\u05d5\u05ea \u05e8\u05e6\u05d5\u05e4\u05d5\u05ea' });
        }
      } else {
        Toast.show({ type: 'error', text1: '\u05e0\u05d9\u05ea\u05df \u05dc\u05d1\u05d7\u05d5\u05e8 \u05e2\u05d3 2 \u05e4\u05d2\u05d9\u05e9\u05d5\u05ea' });
      }
    }
  };

  const handleConfirm = () => {
    Toast.show({
      type: 'success',
      text1: `\u05e0\u05d1\u05d7\u05e8\u05d5: ${selectedSlots.map(s => s.timeRange).join(', ')}`,
      visibilityTime: 1500
    });
  };

  const renderItem = ({ item }: { item: Slot }) => {
    const isSelected = selectedSlots.some(slot => slot.timeRange === item.timeRange);
    return (
      <TouchableOpacity
        onPress={() => handleSlotPress(item)}
        style={[styles.slotButton, isSelected && styles.selectedSlotButton]}
      >
        <Text style={[styles.slotText, isSelected && styles.selectedSlotText]}>
          {item.timeRange}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Mock Availability - 23/06/2025</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={slots}
          keyExtractor={(item) => item.timeRange}
          renderItem={renderItem}
        />
      )}

      {selectedSlots.length > 0 && (
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>\u05d0\u05d9\u05e9\u05d5\u05e8 \u05d1\u05d7\u05d9\u05e8\u05d4</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  slotButton: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center'
  },
  selectedSlotButton: {
    backgroundColor: '#007AFF'
  },
  slotText: {
    fontSize: 16,
    color: '#007AFF'
  },
  selectedSlotText: {
    color: 'white',
    fontWeight: 'bold'
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  confirmText: {
    color: 'white',
    fontSize: 16
  }
});

export default MockAvailabilityScreen;
