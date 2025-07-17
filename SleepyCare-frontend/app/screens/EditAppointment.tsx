// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
// import { useForm, Controller } from 'react-hook-form';
// import { useRouter, useLocalSearchParams } from 'expo-router';
// import styles from '../styles/addAppointment';
// import { AppointmentType } from '../constants';
// import { httpGetAppointmentById, httpUpdateAppointment } from '../contexts/appointmentService';

// export default function EditAppointment() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [loading, setLoading] = useState(true);
//   const [appointment, setAppointment] = useState<AppointmentType | null>(null);
//   const { control, handleSubmit, reset } = useForm<AppointmentType>();
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const data = await httpGetAppointmentById(id!);
//         setAppointment(data);
//         reset(data);
//       } catch (error) {
//         Alert.alert('Error', 'Failed to fetch appointment data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [id]);

//   const onSubmit = async (data: AppointmentType) => {
//     try {
//       await httpUpdateAppointment(data);
//       Alert.alert('Success', 'Appointment updated successfully');
//       router.back();
//     } catch (error) {
//       Alert.alert('Error', 'Failed to update appointment');
//     }
//   };

//   if (loading) {
//     return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
//   }

//   if (!appointment) {
//     return <Text>Appointment not found</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Edit Appointment</Text>

//       <Controller
//         control={control}
//         name="client_id"
//         rules={{ required: 'Required' }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Client ID"
//             value={value}
//             onChangeText={onChange}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="counselor_id"
//         rules={{ required: 'Required' }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Counselor ID"
//             value={value}
//             onChangeText={onChange}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="date"
//         rules={{ required: 'Required' }}
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Date (YYYY-MM-DD)"
//             value={value}
//             onChangeText={onChange}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="start_time"
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Start Time"
//             value={new Date(value).toISOString()}
//             onChangeText={(text) => onChange(new Date(text))}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="end_time"
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="End Time"
//             value={new Date(value).toISOString()}
//             onChangeText={(text) => onChange(new Date(text))}
//           />
//         )}
//       />

//       <Controller
//         control={control}
//         name="status"
//         render={({ field: { onChange, value } }) => (
//           <TextInput
//             style={styles.input}
//             placeholder="Status"
//             value={value}
//             onChangeText={onChange}
//           />
//         )}
//       />

//       <Text style={{ marginBottom: 10 }}>
//         Zoom Link (read-only): {appointment.zoom_link ?? 'None'}
//       </Text>

//       <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
//         <Text style={styles.buttonText}>Save Changes</Text>
//       </Pressable>
//     </View>
//   );
// }


import React, { useRef, useState, useEffect } from 'react';
import { CalendarList } from 'react-native-calendars';
import { StyleSheet, Modal, Pressable, Text, View, ScrollView, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import TimeSlotSelector from './TimeSlotSelector';
import { useUserData } from '../components/useUserData';
import { Menu, Provider } from 'react-native-paper';
import conversion from '../components/conversion';
import { httpGetAppointmentById,httpUpdateAppointment } from "../contexts/appointmentService";
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import styles from '../styles/addAppointment';

const AddAppointmentScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedChild, setSelectedChild] = useState<{ id: string; name: string }>();
  const [selectedCounselor, setSelectedCounselor] = useState<{ id: string; name: string }>();
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [counselors, setCounselors] = useState<{ id: string; name: string }[]>([]);
  const [childCode, setChildCode] = useState('');
  const [counselorCode, setCounselorCode] = useState('');
  const [childMenuVisible, setChildMenuVisible] = useState(false);
  const [counselorMenuVisible, setCounselorMenuVisible] = useState(false);
  const calendarRef = useRef<any>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const { children: userChildren, counselors: userCounselors, loading, currentCounselor } = useUserData();

    useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await httpGetAppointmentById(currentUser.id);
        // setSelectedChild(data.client_id);  // האם אני צריכה לגשת לשרת להביא את שם הילד והיועץ?
        // setSelectedCounselor(data.counselor_id);
        setSelectedDate(data.date);
        setSelectedTime(`${data.start_time} - ${data.end_time}`);      
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch appointment data');
      }
    };
    fetchData();
  }, [currentUser.id]);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  //הבאתי מהשרת את רשימת הילדים / היועצים - אם לא הצליח שמתי ערכים זמניים
  useEffect(() => {
    if (!loading) {
      setChildren(
        userChildren.length > 0
          ? userChildren
          : [
            { id: '1', name: 'Child A' },
            { id: '2', name: 'Child B' },
            { id: '3', name: 'Child C' },
            { id: '4', name: 'Child D' },
          ]
      );

      if (userCounselors.length > 0) {
        setCounselors(userCounselors);
      } else if (currentUser.role == "counselor") {
        setSelectedCounselor({ id: currentUser.id, name: currentUser.name });
      } else {
        setCounselors([
          { id: '1', name: 'counselor A' },
          { id: '2', name: 'counselor B' },
          { id: '3', name: 'counselor C' },
          { id: '4', name: 'counselor D' },
        ]);
      }
    }
  }, [loading, userChildren, userCounselors]);

  const goToToday = () => {
    const today = dayjs();
    calendarRef.current?.scrollToDay?.(
      { year: today.year(), month: today.month() + 1, day: today.date() },
      0,
      true
    );
  };

  const handleSubmitHour = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (!selectedChild || !selectedCounselor || !selectedDate || !selectedTime) {
      Alert.alert("Missing fields", "Please fill all fields before submitting.");
      return;
    }
    const data = { client_id: selectedChild?.id, counselor_id: selectedCounselor?.id, date: selectedDate, time: selectedTime };
    const appointmentToUpdate = conversion(data);
    httpUpdateAppointment(appointmentToUpdate)
      .then(res => {
        console.log("Appointment adding", res);
        Alert.alert("Appointment added successfully");
      })
      .catch(err => {
        console.log("Error adding Appointment", err);
        Alert.alert("Error adding Appointment: " + (err.message || "Unknown error occurred"));
      });
    Alert.alert("Submitted", `Date: ${selectedDate}, Child: ${selectedChild?.id}, Counselor: ${selectedCounselor?.id}, time: ${selectedTime}`);
  };
// חסימת התאריכים שעברו
  const getDisabledDates = () => {
    const disabled = {};
    const today = dayjs().startOf('day');
    const start = today.subtract(1, 'year');

    const dates = Array.from({ length: today.diff(start, 'day') }, (_, i) => start.add(i, 'day').format('YYYY-MM-DD'));

    dates.forEach(dateStr => {
      disabled[dateStr] = { disabled: true, disableTouchEvent: true };
    });

    return disabled;
  };


  const markedDates = {
    ...getDisabledDates(),
    [selectedDate]: {
      selected: true,
      selectedColor: '#00adf5',
    },
    [dayjs().format('YYYY-MM-DD')]: {
      marked: true,
      dotColor: 'red',
    },
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 2 }}>
          
          <Text style={{ textAlign: 'center', color: '#008080', fontSize: 25, margin: 25 }}>
            Let's edit your appointment!!
          </Text>

          <Text style={styles.label}>client id</Text>
          <Menu
            visible={childMenuVisible}
            onDismiss={() => setChildMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setChildMenuVisible(true)}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>
                  {selectedChild?.name || 'select client'}
                </Text>
              </TouchableOpacity>
            }
          >
            {children.map((child) => (
              <Menu.Item
                key={child.id}
                onPress={() => {
                  setChildCode(child.id);
                  setChildMenuVisible(false);
                  setSelectedChild(child);
                }}
                title={child.name}
              />
            ))}
          </Menu>

          <Text style={styles.label}>counselor id</Text>
          <Menu
            visible={counselorMenuVisible}
            onDismiss={() => setCounselorMenuVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setCounselorMenuVisible(true)}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>
                  {selectedCounselor?.name || 'select counselor'}
                </Text>
              </TouchableOpacity>
            }
          >
            {counselors.map((counselor) => (
              <Menu.Item
                key={counselor.id}
                onPress={() => {
                  setCounselorCode(counselor.id);
                  setCounselorMenuVisible(false);
                  setSelectedCounselor(counselor);
                }}
                title={counselor.name}
              />
            ))}
          </Menu>
          {selectedDate&&selectedTime?
            <Text style={styles.label}>Selected {selectedTime} at {selectedDate}</Text>:
            <Text style={styles.label}>please selected date:</Text>
          }
          <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
            <Text style={styles.todayTxtBtn}>Go To Today</Text>
          </TouchableOpacity>

          <CalendarList
            ref={calendarRef}
            pagingEnabled
            style={styles.calendar}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            pastScrollRange={12}
            futureScrollRange={12}
            showScrollIndicator
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
            <View style={styles.scrollableModalView}>
              <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TimeSlotSelector selectedDate={selectedDate} onTimeSelected={(time) => setSelectedTime(time)} />
                <Pressable style={[styles.button, styles.buttonClose]} onPress={handleSubmitHour}>
                  <Text style={styles.textStyle}>Finish</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AddAppointmentScreen;










