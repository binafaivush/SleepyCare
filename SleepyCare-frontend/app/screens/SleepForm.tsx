import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../styles/timer-form';

export default function SleepForm() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const [date] = useState(new Date());
    const [bedTime, setBedTime] = useState('');
    const [wakeTime, setWakeTime] = useState('');
    const [napTimes, setNapTimes] = useState('');
    const [wakeUpsCount, setWakeUpsCount] = useState('');
    const [mood, setMood] = useState('');
    const [notes, setNotes] = useState('');
    const [submittedByVoice, setSubmittedByVoice] = useState(false);

    // פרמטרים שהגיעו מהטיימר
    const start = params.start as string | undefined;
    const end = params.end as string | undefined;
    const duration = params.seconds as string | undefined;
    const formatAsMinutesSeconds = (seconds: number): string => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };
    function formatTime(dateString?: string) {
        if (!dateString) return '—';
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    const handleSubmit = async () => {
        try {
            const sleepData = {
                date: date.toISOString(),
                bed_time: bedTime,
                wake_time: wakeTime,
                nap_times: parseInt(napTimes),
                wake_ups_count: parseInt(wakeUpsCount),
                mood,
                notes,
                submitted_by_voice: submittedByVoice,
                start_time: start,
                end_time: end,
                total_duration: duration ? parseInt(duration) : null,
            };

            const response = await fetch('https://url/api/sleep-journals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sleepData),
            });

            if (!response.ok) throw new Error('שגיאה בשרת');
            Alert.alert('הצלחה', 'טופס שינה נשלח');
            router.back();
        } catch (error) {
            console.error(error);
            Alert.alert('שגיאה', 'שליחת טופס נכשלה');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Icon name="arrow-back" size={24} color="#5C8D89" />
                <Text style={styles.backText}>חזרה</Text>
            </TouchableOpacity>

            <Text style={styles.title}>טופס שינה</Text>

            <Text style={styles.label}>📅 תאריך:</Text>
            <Text style={styles.durationText}>{date.toLocaleDateString('he-IL')}</Text>
            <Text style={styles.label}>⏱ שעת התחלה:</Text>
            <Text style={styles.durationText}>{formatTime(start)}</Text>

            <Text style={styles.label}>⏱ שעת סיום:</Text>
            <Text style={styles.durationText}>{formatTime(end)}</Text>


            <Text style={styles.label}>⏳ משך שינה:</Text>
            <Text style={styles.durationText}>
                {duration ? formatAsMinutesSeconds(parseInt(duration)) : '—'}
            </Text>

            <Text style={styles.label}>🛏 שעת השכבה:</Text>
            <TextInput style={styles.input} value={bedTime} onChangeText={setBedTime} placeholder="22:00" />

            <Text style={styles.label}>🌅 שעת קימה:</Text>
            <TextInput style={styles.input} value={wakeTime} onChangeText={setWakeTime} placeholder="06:30" />

            <Text style={styles.label}>😴 מספר תנומות ביום:</Text>
            <TextInput style={styles.input} value={napTimes} onChangeText={setNapTimes} keyboardType="numeric" />

            <Text style={styles.label}>😬 מספר יקיצות בלילה:</Text>
            <TextInput style={styles.input} value={wakeUpsCount} onChangeText={setWakeUpsCount} keyboardType="numeric" />

            <Text style={styles.label}>🧠 מצב רגשי:</Text>
            <TextInput style={styles.input} value={mood} onChangeText={setMood} placeholder="טוב / עייף..." />

            <Text style={styles.label}>📝 הערות:</Text>
            <TextInput
                style={[styles.input, { height: 80 }]}
                value={notes}
                onChangeText={setNotes}
                multiline
            />

            <TouchableOpacity style={styles.checkboxRow} onPress={() => setSubmittedByVoice(!submittedByVoice)}>
                <Icon name={submittedByVoice ? 'checkbox' : 'square-outline'} size={24} color="#5C8D89" />
                <Text style={styles.label}>הוגש באמצעות קול</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                <Text style={styles.saveButtonText}>שמור</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
