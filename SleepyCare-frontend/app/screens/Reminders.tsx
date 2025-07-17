// import React from 'react';
// import { View, Text, FlatList, StyleSheet, SafeAreaView, RefreshControl, TouchableOpacity } from 'react-native';
// import ReminderItem from '../components/ReminderItem';
// import Loader from '../components/Loader';
// import { useReminders } from '../hooks/useReminders';

// const ParentRemindersScreen: React.FC = () => {
//   const { reminders, loading, refreshing, error, loadReminders, onRefresh } = useReminders();

//   if (loading && !refreshing) {
//     return (
//       <View style={styles.centered}>
//         <Loader />
//         <Text>Loading your schedule...</Text>
//       </View>
//     );
//   }

//   if (error && reminders.length === 0) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={() => loadReminders()} style={styles.retryButton}>
//             <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>My Schedule</Text>
//       </View>
//       {error && reminders.length > 0 && !refreshing && (
//           <Text style={styles.inlineErrorText}>{error} Pull down to refresh.</Text>
//       )}
//       <FlatList
//         data={reminders}
//         renderItem={({ item }) => <ReminderItem reminder={item} />}
//         keyExtractor={(item) => item.id}
//         ListEmptyComponent={
//           !loading && !refreshing ? (
//             <View style={styles.centered}>
//                 <Text style={styles.emptyText}>No upcoming appointments or reminders.</Text>
//             </View>
//           ) : null
//         }
//         contentContainerStyle={styles.listContent}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={["#007AFF"]}
//             tintColor={"#007AFF"}
//           />
//         }
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: { flex: 1, backgroundColor: '#f7f7f7' },
//   header: { paddingVertical: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', alignItems: 'center', backgroundColor: '#ffffff' },
//   headerText: { fontSize: 22, fontWeight: '600', color: '#2c3e50' },
//   listContent: { paddingBottom: 20, flexGrow: 1 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   errorText: { color: '#e74c3c', fontSize: 16, textAlign: 'center', marginBottom: 15 },
//   inlineErrorText: { color: '#f39c12', textAlign: 'center', paddingVertical: 8, paddingHorizontal: 15, backgroundColor: '#fff8e1', fontSize: 14},
//   emptyText: { textAlign: 'center', fontSize: 17, color: '#7f8c8d' },
//   retryButton: { marginTop: 20, backgroundColor: '#3498db', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, elevation: 4 },
//   retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' }
// });

// export default ParentRemindersScreen;
// ParentRemindersScreen.tsx

import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  RefreshControl, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

// 1. ייבוא סוג הנתונים והצבעים מהקובץ המרכזי שלך
import { COLORS, AppointmentType } from '../constants'; // התאימי את הנתיב לקובץ שלך
import { useReminders } from '../hooks/useReminders'; // ה-hook שלך

// הגדרת ה-Type למסך התזכורות שלנו
interface Reminder {
  id: string;
  title: string;
  time: string;
}

// 2. פונקציית עזר להמרת נתוני השרת למבנה שהמסך צריך
// זהו נוהג טוב שמפריד בין מבנה הנתונים מה-API למבנה הנתונים של ה-UI
const transformAppointmentToReminder = (appointment: AppointmentType): Reminder => {
  return {
    id: appointment.counselor_id, // יש להשתמש ב-ID ייחודי, התאימי לפי הצורך
    title: `${appointment.client_id}`, // התאימי את הטקסט לפי הצורך
    time: new Date(appointment.start_time).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
  };
};

// 3. נתוני דמה במבנה של AppointmentType מהשרת
const mockAppointments: AppointmentType[] = [
  { creator_id: 'c1', client_id: 'dany', counselor_id: 'm1', date: '2023-10-27', start_time: new Date('2023-10-27T14:30:00'), end_time: new Date(), zoom_link: null, status: 'confirmed' },
  { creator_id: 'c2', client_id: 'rony', counselor_id: 'm2', date: '2023-10-27', start_time: new Date('2023-10-27T17:00:00'), end_time: new Date(), zoom_link: null, status: 'confirmed' },
  { creator_id: 'c3', client_id: 'yossi', counselor_id: 'm3', date: '2023-10-27', start_time: new Date('2023-10-27T16:00:00'), end_time: new Date(), zoom_link: null, status: 'confirmed' },
];

const ParentRemindersScreen: React.FC = () => {
  // --- מצב פיתוח עם נתוני דמה ---
  // הקריאות האמיתיות לשרת נמצאות בהערה למטה
  const reminders: Reminder[] = mockAppointments.map(transformAppointmentToReminder);
  const loading = false;
  const refreshing = false;
  const error = null; // אפשר לשנות לטקסט כדי לבדוק מצב שגיאה
  const loadReminders = () => console.log("Attempting to load reminders...");
  const onRefresh = () => console.log("Refreshing...");

  // --- מצב פרודקשן (בהערה) ---
  // כשתעלי לגיט, הסירי את ההערה מהבלוק הבא והסירי את בלוק נתוני הדמה למעלה
  /*
  const { appointments, loading, refreshing, error, loadReminders, onRefresh } = useReminders(); // נניח שה-hook מחזיר appointments
  const reminders: Reminder[] = appointments ? appointments.map(transformAppointmentToReminder) : [];
  */

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>טוען את לוח הזמנים שלך...</Text>
      </View>
    );
  }

  if (error && (!reminders || reminders.length === 0)) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => loadReminders()} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>נסה שוב</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList<Reminder>
        data={reminders}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemContainer}>
            <View style={styles.iconContainer}>
              {/* כאן תוכלי להציג אייקון */}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemSubtitle}>{item.time}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.headerText}>התזכורות שלי</Text>}
        ListEmptyComponent={
          !loading && !refreshing ? (
            <View style={styles.centered}>
                <Text style={styles.emptyText}>אין לך תזכורות קרובות.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
};

// 4. הגדרת העיצובים עם שימוש ב-COLORS מהפלטה שלך
const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background, // #FFFFFF
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary, // #263238
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  listContent: { 
    paddingHorizontal: 15,
    paddingBottom: 20, 
    flexGrow: 1 
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: COLORS.background, // #FFFFFF
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border, // #CFD8DC
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary, // #4DB6AC
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary, // #263238
  },
  itemSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary, // #757575
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.border, // #CFD8DC
    fontWeight: 'bold',
  },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: COLORS.background, // #FFFFFF
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary, // #757575
  },
  errorText: { 
    color: COLORS.error, // #D32F2F
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 20 
  },
  emptyText: { 
    textAlign: 'center', 
    fontSize: 17, 
    color: COLORS.textSecondary, // #757575
  },
  actionButton: {
    backgroundColor: COLORS.primary, // #4DB6AC
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 3,
  },
  actionButtonText: { 
    color: COLORS.white, // #FFFFFF
    fontSize: 16, 
    fontWeight: 'bold' 
  },
});

export default ParentRemindersScreen;