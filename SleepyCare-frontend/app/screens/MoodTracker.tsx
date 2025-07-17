import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../styles/MoodTracker';

// 🌈 נתוני המצב הרגשי לאורך השבוע – כל יום עם תאריך, מצב ופתק
const moodData = [
  { date: '2025-07-01', mood: 'good', note: 'היה יום רגוע ונעים' },
  { date: '2025-07-02', mood: 'stressed', note: 'התינוק בכה המון' },
  { date: '2025-07-03', mood: 'average', note: 'בסדר סה"כ, עייפות' },
  { date: '2025-07-04', mood: 'good', note: 'ישנתי טוב' },
  { date: '2025-07-05', mood: 'average', note: 'לא רע, אבל מתוח' },
  { date: '2025-07-06', mood: 'stressed', note: 'קושי בשינה בצהריים' },
  { date: '2025-07-07', mood: 'good', note: 'הרגשה כללית טובה' },
];

// 🎨 צבעים מותאמים לכל מצב רגשי
const moodColors = {
  good: '#4EB6AC',
  average: '#FFD700',
  stressed: '#FF7F50',
};

// 📊 גבהים שונים לעמודות לפי מצב רגשי (לייצוג חזותי)
const moodHeights = {
  good: 100,
  average: 60,
  stressed: 30,
};

export default function MoodTrackerWithModal() {
  // 🧠 מצב לבחירת יום שהמשתמש לחץ עליו להצגת פרטים
  const [selected, setSelected] = useState<typeof moodData[0] | null>(null);

  // 📋 סיכום כמה ימים מכל מצב רגשי בשבוע
  const summary = moodData.reduce(
    (acc, item) => {
      acc[item.mood] = (acc[item.mood] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <View style={styles.container}>
      {/* כותרת ראשית */}
      <Text style={styles.title}>📊 מעקב רגשי - השבוע האחרון</Text>

      {/* גלילה אופקית של העמודות */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartRow}>
          {moodData.map((item) => (
            <View key={item.date} style={styles.chartItem}>
              {/* כל עמודה ניתנת ללחיצה */}
              <TouchableWithoutFeedback onPress={() => setSelected(item)}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: moodHeights[item.mood as keyof typeof moodHeights], // גובה משתנה לפי מצב רגשי
                      backgroundColor:
                        moodColors[item.mood as keyof typeof moodColors] || '#ccc', // צבע לפי מצב רגשי
                    },
                  ]}
                />
              </TouchableWithoutFeedback>
              {/* תאריך ביום בלבד (בלי השנה) */}
              <Text style={styles.label}>{item.date.slice(5)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* סיכום של כל המצבים בשבוע */}
      <View style={styles.summaryBox}>
        <Text style={styles.summaryTitle}>📝 סיכום שבועי:</Text>

        {/* ימים טובים */}
        <View style={styles.summaryItemRow}>
          <View style={[styles.dot, { backgroundColor: moodColors.good }]} />
          <Text style={styles.summaryText}>ימים טובים: {summary.good || 0}</Text>
        </View>

        {/* ימים בינוניים */}
        <View style={styles.summaryItemRow}>
          <View style={[styles.dot, { backgroundColor: moodColors.average }]} />
          <Text style={styles.summaryText}>ימים בינוניים: {summary.average || 0}</Text>
        </View>

        {/* ימים קשים */}
        <View style={styles.summaryItemRow}>
          <View style={[styles.dot, { backgroundColor: moodColors.stressed }]} />
          <Text style={styles.summaryText}>ימים קשים: {summary.stressed || 0}</Text>
        </View>
      </View>

      {/* --- מודאל להצגת פרטי היום שנבחר --- */}
      <Modal
        visible={!!selected} // המודאל פתוח רק כשיש יום שנבחר
        transparent
        animationType="slide"
        onRequestClose={() => setSelected(null)} // סגירת המודאל עם כפתור חזרה במובייל
      >
        <TouchableOpacity
          style={styles.modalOverlay} // רקע כהה מאחורי המודאל
          activeOpacity={1}
          onPressOut={() => setSelected(null)} // סגירה בלחיצה מחוץ למודאל
        >
          <View style={styles.modalContent}>
            {/* תאריך */}
            <Text style={styles.modalTitle}>{selected?.date}</Text>

            {/* תצוגת מצב רגשי עם אימוג'י */}
            <Text style={styles.modalMood}>
              מצב רגשי: {selected?.mood === 'good' ? 'טוב 😊' : selected?.mood === 'average' ? 'בינוני 😐' : 'קשה 😟'}
            </Text>

            {/* הפתק שהמשתמש הוסיף ליום */}
            <Text style={styles.modalNote}>{selected?.note}</Text>

            {/* כפתור סגירה */}
            <TouchableOpacity
              onPress={() => setSelected(null)}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>סגור</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
