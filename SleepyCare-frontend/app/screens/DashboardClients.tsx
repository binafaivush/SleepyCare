// data/clients.ts
export const clients = [
  {
    id: '1',
    name: 'תמר כהן',
    date: '2025-07-14',
    totalSleepHours: 12.5,
    nightWakes: 2,
    feedings: 5,
    moodNote: 'עייפות ביום',
    formsSubmitted: true,
  },
  {
    id: '2',
    name: 'יונתן לוי',
    date: '2025-07-14',
    totalSleepHours: 10.75,
    nightWakes: 3,
    feedings: 4,
    moodNote: 'בכי לפני השינה',
    formsSubmitted: false,
  },
];
// screens/DashboardScreen.tsx
// import React from 'react';
// import { View, Text, ScrollView, StyleSheet } from 'react-native';
// // import { clients } from '../data/clients';

// export default function DashboardClients() {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>דשבורד יועצת</Text>
//       {clients.map((client) => (
//         <View key={client.id} style={styles.card}>
//           <Text style={styles.name}>{client.name}</Text>
//           <Text>🗓️ {client.date}</Text>
//           <Text>🛏 שינה: {client.totalSleepHours} שעות</Text>
//           <Text>🌙 יקיצות: {client.nightWakes}</Text>
//           <Text>🍼 האכלות: {client.feedings}</Text>
//           <Text>📋 טופס: {client.formsSubmitted ? 'מולא' : 'לא מולא'}</Text>
//           <Text>📝 הערה: {client.moodNote}</Text>
//         </View>
//       ))}
//     </ScrollView>
//   );
  
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     backgroundColor: '#F8F9FB',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//     color: '#333',
//   },
//  // בתוך styles.card:
// card: {
//   backgroundColor: '#fff',
//   borderRadius: 16,
//   padding: 16,
//   marginBottom: 16,
//   elevation: 3,
//   shadowColor: '#000',
//   shadowOpacity: 0.1,
//   shadowRadius: 4,
//   alignItems: 'center', // הוספנו את זה
// },

// // בתוך styles.name (ובדומה בשאר ה־Text):
// name: {
//   fontSize: 20,
//   fontWeight: 'bold',
//   color: '#5C8D89',
//   marginBottom: 8,
//   textAlign: 'center', // הוספנו את זה
// },

// });

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
// import { clients } from '../data/clients';

export default function DashboardScreen() {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>דשבורד יועצת</Text>

      {/* כפתורי מעבר */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'daily' && styles.selectedButton,
          ]}
          onPress={() => setViewMode('daily')}
        >
          <Text style={styles.toggleText}>יומי</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'weekly' && styles.selectedButton,
          ]}
          onPress={() => setViewMode('weekly')}
        >
          <Text style={styles.toggleText}>שבועי</Text>
        </TouchableOpacity>
      </View>

      {/* כרטיסי לקוחות */}
      {clients.map((client) => (
        <View key={client.id} style={styles.card}>
          <Text style={styles.name}>{client.name}</Text>
          <Text style={styles.centeredText}>🗓️ {client.date}</Text>
          <Text style={styles.centeredText}>🛏 שינה: {client.totalSleepHours} שעות</Text>
          <Text style={styles.centeredText}>🌙 יקיצות: {client.nightWakes}</Text>
          <Text style={styles.centeredText}>🍼 האכלות: {client.feedings}</Text>
          <Text style={styles.centeredText}>📋 טופס: {client.formsSubmitted ? 'מולא' : 'לא מולא'}</Text>
          <Text style={styles.centeredText}>📝 הערה: {client.moodNote}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F8F9FB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#ddd',
    borderRadius: 20,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#4EB6AC',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5C8D89',
    marginBottom: 8,
    textAlign: 'center',
  },
  centeredText: {
    textAlign: 'center',
    marginBottom: 2,
    color: '#333',
  },
});
