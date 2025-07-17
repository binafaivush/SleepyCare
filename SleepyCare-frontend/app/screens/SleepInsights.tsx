// SleepInsightsScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import axios from 'axios';

interface AnalyticsData {
  avg_sleep_hours: number;
  avg_nap_count: number;
  summary_text?: string;
}

const SleepInsightsScreen = () => {
  const childId = useSelector((state: RootState) => state.client._id);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // const fetchAnalytics = async () => {
      // try {
        // const res = await axios.get(`http://localhost:5073/analytics/client/${childId}`);
        // setData(res.data);
      // } catch (err) {
        // setError('שגיאה בטעינת הנתונים');
      // } finally {
        // setLoading(false);
      // }
    // }

    // if (childId) fetchAnalytics();
    if (childId) {setError('שגיאה בטעינת הנתונים');setLoading(false);}
 else{setLoading(false); setData({ avg_sleep_hours: 8, avg_nap_count: 1, summary_text: 'ה נתונים מעודכנים.' }) };
  }, [childId]);

  const renderInsights = () => {
    if (!data) return <Text>no data</Text>;

    const insights = [];

    if (data.avg_sleep_hours < 10) {
      insights.push({
        message: 'הילד ישן פחות מ־10 שעות בממוצע.',
        tip: 'נסו להקדים את שעת ההשכבה בחצי שעה.',
      });
    }

    if (data.avg_nap_count > 2) {
      insights.push({
        message: 'תדירות היקיצות גבוהה מהרגיל.',
        tip: 'וודאו שהתנאים בסביבת השינה נוחים ואחידים.',
      });
    }

    if (insights.length === 0 && data.summary_text) {
      return (
        <View style={styles.card}>
          <Text style={styles.insightText}>{data.summary_text}</Text>
        </View>
      );
    }

    return insights.map((item, index) => (
      <View key={index} style={styles.card}>
        <Text style={styles.insightText}>{item.message}</Text>
        <Text style={styles.tipText}>💡 טיפ: {item.tip}</Text>
      </View>
    ));
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#0099cc" />;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Insights</Text>
      {renderInsights()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    color: '#336',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#eef6fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  insightText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  tipText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default SleepInsightsScreen;
