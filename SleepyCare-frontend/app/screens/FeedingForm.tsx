    import React, { useEffect, useState } from 'react';
    import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
    import { useLocalSearchParams, useRouter } from 'expo-router';
    import Icon from 'react-native-vector-icons/Ionicons';
    import { Picker } from '@react-native-picker/picker';
    import { updateLastFeedingTime } from '../utils/updateLastFeedingTime';
    import { startRepeatingReminder } from '../utils/scheduleReminder';
    import styles from '../styles/timer-form';

    type FeedingType = 'Breastfeeding' | 'Bottle' | 'Pumping';
    type Side = 'left' | 'right' | 'both';

    export default function FeedingForm() {
        const params = useLocalSearchParams();
        const router = useRouter();

        const [feedingType, setFeedingType] = useState<FeedingType>('Breastfeeding');
        const [side, setSide] = useState<Side>('left');
        const [amount, setAmount] = useState('');
        const [start, setStart] = useState((params.start as string) || '');
        const [end, setEnd] = useState((params.end as string) || '');
        const [duration, setDuration] = useState('0:00');

        useEffect(() => {
            const secondsParam = parseInt((params.seconds as string) || '0', 10);
            if (start && end) {
                const diffSec = Math.floor((new Date(end).getTime() - new Date(start).getTime()) / 1000);
                const min = Math.floor(diffSec / 60);
                const sec = diffSec % 60;
                setDuration(`${min}:${sec.toString().padStart(2, '0')}`);
            } else if (secondsParam) {
                const min = Math.floor(secondsParam / 60);
                const sec = secondsParam % 60;
                setDuration(`${min}:${sec.toString().padStart(2, '0')}`);
            }
        }, [start, end, params.seconds]);

        function formatTime(dateString?: string) {
            if (!dateString) return '—';
            const date = new Date(dateString);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

        const handleSubmit = async () => {
            // try {
            //   const feedingData = {
            //     start,
            //     end,
            //     duration,
            //     feeding_type: feedingType,
            //     side: feedingType === 'Breastfeeding' ? side : null,
            //     amount: feedingType !== 'Breastfeeding' ? parseInt(amount) : null,
            //   };

            //   const response = await fetch('https://your-server.com/api/feeding-entries', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(feedingData),
            //   });

            //   if (!response.ok) throw new Error('שגיאה בשליחה');

            if (end) {
                updateLastFeedingTime(end);
                startRepeatingReminder(1, 1);
            }

            Alert.alert('הצלחה', 'טופס האכלה נשלח');
            // } catch (error) {
            //   console.error(error);
            //   Alert.alert('שגיאה', 'שליחת טופס נכשלה');
            // }
        };

        return (
            <ScrollView contentContainerStyle={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Icon name="arrow-back" size={24} color="#5C8D89" />
                    <Text style={styles.backText}>חזרה</Text>
                </TouchableOpacity>

                <Text style={styles.title}>טופס האכלה</Text>


                <Text style={styles.label}>⏱ שעת התחלה:</Text>
                <Text style={styles.durationText}>{formatTime(start)}</Text>

                <Text style={styles.label}>⏱ שעת סיום:</Text>
                <Text style={styles.durationText}>{formatTime(end)}</Text>

                <Text style={styles.label}>⏱ משך זמן:</Text>
                <Text style={styles.durationText}>{duration}</Text>

                <Text style={styles.label}>🍽 סוג האכלה:</Text>
                <View style={styles.picker}>
                    <Picker selectedValue={feedingType} onValueChange={(value) => setFeedingType(value as FeedingType)}>
                        <Picker.Item label="הנקה" value="Breastfeeding" />
                        <Picker.Item label="בקבוק" value="Bottle" />
                        <Picker.Item label="שאיבה" value="Pumping" />
                    </Picker>
                </View>

                {feedingType === 'Breastfeeding' && (
                    <>
                        <Text style={styles.label}>⬅️ צד:</Text>
                        <View style={styles.picker}>
                            <Picker selectedValue={side} onValueChange={(value) => setSide(value as Side)}>
                                <Picker.Item label="שמאל" value="left" />
                                <Picker.Item label="ימין" value="right" />
                                <Picker.Item label="שני הצדדים" value="both" />
                            </Picker>
                        </View>
                    </>
                )}

                {feedingType !== 'Breastfeeding' && (
                    <>
                        <Text style={styles.label}>🥛 כמות (מ"ל):</Text>
                        <TextInput style={styles.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="לדוג' 90" />
                    </>
                )}

                <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
                    <Text style={styles.saveButtonText}>שמור</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
