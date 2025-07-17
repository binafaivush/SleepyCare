// SleepLog.tsx - עם עיצוב, אייקונים, כפתור צף, וולידציות

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5, MaterialIcons, Feather } from '@expo/vector-icons';
import { SleepJournalInput } from '../types/SleepLog';

export default function SleepLog() {
  const [bedTime, setBedTime] = useState('');
  const [showBedTimePicker, setShowBedTimePicker] = useState(false);
  const [wakeTime, setWakeTime] = useState('');
  const [showWakeTimePicker, setShowWakeTimePicker] = useState(false);
  const [napTimes, setNapTimes] = useState(0);
  const [wakeUpsCount, setWakeUpsCount] = useState(0);
  const [mood, setMood] = useState('happy');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const renderRow = (icon: React.ReactNode, label: string) => (
    <View style={styles.rowLabel}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!bedTime) newErrors.bedTime = 'Please select bed time';
    if (!wakeTime) newErrors.wakeTime = 'Please select wake time';
    if (napTimes < 0) newErrors.napTimes = 'Value must be 0 or more';
    if (wakeUpsCount < 0) newErrors.wakeUpsCount = 'Value must be 0 or more';
    if (!mood) newErrors.mood = 'Please select mood';
    if (date > new Date()) newErrors.date = 'Date cannot be in the future';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const sleepData: SleepJournalInput = {
        date,
        bed_time: bedTime,
        wake_time: wakeTime,
        nap_times: napTimes,
        wake_ups_count: wakeUpsCount,
        mood,
        notes,
      };
      console.log(sleepData);
    }
  };

  const renderError = (field: string) => errors[field] && (
    <Text style={styles.errorText}>{errors[field]}</Text>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {renderRow(<FontAwesome5 name="bed" size={18} color="#4EB6AC" />, 'Bed Time')}
        <TouchableOpacity onPress={() => setShowBedTimePicker(true)} style={styles.input}>
          <Text style={styles.inputText}>{bedTime || 'Select bed time'}</Text>
        </TouchableOpacity>
        {renderError('bedTime')}
        {showBedTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={(_, selectedDate) => {
              setShowBedTimePicker(false);
              if (selectedDate) {
                const h = selectedDate.getHours().toString().padStart(2, '0');
                const m = selectedDate.getMinutes().toString().padStart(2, '0');
                setBedTime(`${h}:${m}`);
              }
            }}
          />
        )}

        {renderRow(<Feather name="sunrise" size={18} color="#4EB6AC" />, 'Wake Time')}
        <TouchableOpacity onPress={() => setShowWakeTimePicker(true)} style={styles.input}>
          <Text style={styles.inputText}>{wakeTime || 'Select wake time'}</Text>
        </TouchableOpacity>
        {renderError('wakeTime')}
        {showWakeTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            is24Hour
            display="default"
            onChange={(_, selectedDate) => {
              setShowWakeTimePicker(false);
              if (selectedDate) {
                const h = selectedDate.getHours().toString().padStart(2, '0');
                const m = selectedDate.getMinutes().toString().padStart(2, '0');
                setWakeTime(`${h}:${m}`);
              }
            }}
          />
        )}

        {renderRow(<FontAwesome5 name="baby" size={18} color="#4EB6AC" />, 'Nap Times')}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={napTimes.toString()}
          onChangeText={(text) => setNapTimes(Number(text))}
        />
        {renderError('napTimes')}

        {renderRow(<FontAwesome5 name="bell" size={18} color="#4EB6AC" />, 'Wake Ups Count')}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={wakeUpsCount.toString()}
          onChangeText={(text) => setWakeUpsCount(Number(text))}
        />
        {renderError('wakeUpsCount')}

        {renderRow(<FontAwesome5 name="smile" size={18} color="#4EB6AC" />, 'Mood')}
        <View style={styles.pickerContainer}>
          <Picker selectedValue={mood} onValueChange={setMood} style={styles.picker}>
            <Picker.Item label="Happy" value="happy" />
            <Picker.Item label="Tired" value="tired" />
            <Picker.Item label="Cranky" value="cranky" />
          </Picker>
        </View>
        {renderError('mood')}

        {renderRow(<FontAwesome5 name="sticky-note" size={18} color="#4EB6AC" />, 'Notes')}
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {renderRow(<FontAwesome5 name="calendar" size={18} color="#4EB6AC" />, 'Date')}
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
          <Text style={styles.inputText}>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {renderError('date')}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleSubmit}>
        <MaterialIcons name="send" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    marginLeft: 6,
    color: '#000',
    fontWeight: '600',
  },
  rowLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: '#F5F5F5',
  },
  inputText: {
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginTop: 6,
  },
  picker: {
    color: '#000',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#4EB6AC',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});