import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing'; // אם את באקספו
import * as FileSystem from 'expo-file-system';

export default function SendPdfButton({ clientId }: { clientId: string }) {
  const handlePress = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/sleep-journals/last7days/${clientId}`);
      const journals = await res.json();
      console.log(journals+'00000000000000000');
      
      if (!Array.isArray(journals) || journals.length === 0) {
        Alert.alert("אין נתונים", "לא נמצאו רשומות מהשבוע האחרון.");
        return;
      }

      const html = `
        <h1>יומן שינה - 7 ימים</h1>
        <ul>
          ${journals.map(j => `
            <li>
              <strong>תאריך:</strong> ${new Date(j.date).toLocaleDateString()}<br/>
              שעת שינה: ${j.bed_time}<br/>
              שעת יקיצה: ${j.wake_time}<br/>
              מצב רוח: ${j.mood}<br/>
              הערות: ${j.notes}
            </li>
          `).join('')}
        </ul>
      `;

      const file = await RNHTMLtoPDF.convert({
        html,
        fileName: 'sleep-journal',
        base64: false
      });

      await Sharing.shareAsync(file.filePath || '');
    } catch (err) {
      Alert.alert("שגיאה", "לא ניתן לשלוח PDF.");
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>שלח PDF למייל</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4DB6AC',
    padding: 10,
    borderRadius: 10,
    margin: 16,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16
  }
});
