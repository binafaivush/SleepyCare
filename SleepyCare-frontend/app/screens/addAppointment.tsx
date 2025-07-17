import React, { useRef, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import { StyleSheet, Modal, Pressable, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { Menu, Provider } from 'react-native-paper';
import CalendarStrip from 'react-native-calendar-strip';
import TimeSlotSelector from './TimeSlotSelector';
import { useUserData } from '../components/useUserData';
import conversion from '../components/conversion';
import { httpAddAppointment } from "../contexts/appointmentService";
import { RootState } from '../store/store';
import { httpGetChildrenByParentId } from '../contexts/childrenService';
import { httpGetWorkingDatesAndHoursByCounselor } from '../contexts/workingHoursService';
import { DailyWorkingHours, TimeRangeType } from '../constants';
import styles from '../styles/addAppointment';
import { useRouter } from 'expo-router';

const AddAppointmentScreen = () => {

    const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedChild, setSelectedChild] = useState<{ _id: string; child_name: string; counselor_id?: string }>();
  const [selectedCounselor, setSelectedCounselor] = useState<{ id: string; name: string }>();
  const [children, setChildren] = useState<{ _id: string; child_name: string; counselor_id?: string }[]>([]);
  const [counselors, setCounselors] = useState<{ id: string; name: string }[]>([]);
  const [childCode, setChildCode] = useState('');
  const [counselorCode, setCounselorCode] = useState('');
  const [childMenuVisible, setChildMenuVisible] = useState(false);
  const [counselorMenuVisible, setCounselorMenuVisible] = useState(false);
  const [availableDates, setAvailableDates] = useState<DailyWorkingHours[]>([]);
  const [timeRanges, setTimeRanges] = useState<TimeRangeType[]>([]);
  const calendarRef = useRef<CalendarStrip>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const { children: userChildren, counselors: userCounselors, loading, currentCounselor } = useUserData();

  const router = useRouter();

  console.log("Current user data:", currentUser);

  const handleDayPress = (date: any) => {
    const dateString = dayjs(date).format('YYYY-MM-DD');
    // רק אם התאריך זמין ולא עבר - נאפשר בחירה
    if (isDateAvailable(dateString) && !dayjs(date).isBefore(dayjs(), 'day')) {
      setSelectedDate(dateString);
      setModalVisible(true);
    }
  };

  const availableTime = async (id: string) => {
    try {
      const result: DailyWorkingHours[] = await httpGetWorkingDatesAndHoursByCounselor(id);
      console.log("Available dates for counselor:", result);
      //@ts-ignore
      await setAvailableDates(result.data.availableDates || []);
    }
    catch (error) {
      console.error("Error fetching working dates:", error);
    }
  }

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        console.log("Fetching children for user:", currentUser.id);
        const result = await httpGetChildrenByParentId(currentUser.id);
        console.log("Fetched children:", result)

        const fetchedChildren: { _id: string; child_name: string; counselor_id?: string }[] = Array.isArray(result.data)
          ? result.data.map((child: any) => ({
            _id: child._id?.toString?.() ?? '',
            child_name: child.child_name ?? '',
            counselor_id: child.counselor_id?.toString?.() ?? ''

          }))
          : [];
        setChildren(
          fetchedChildren.length > 0
            ? fetchedChildren
            : [
              { _id: '1', child_name: 'Child A', counselor_id: '1' },
              { _id: '2', child_name: 'Child B', counselor_id: '2' },
              { _id: '3', child_name: 'Child C', counselor_id: '3' },
              { _id: '4', child_name: 'Child D', counselor_id: '4' },
            ]
        );

      } catch (error) {
        setChildren([
          { _id: '1', child_name: 'Child A', counselor_id: '1' },
          { _id: '2', child_name: 'Child B', counselor_id: '2' },
          { _id: '3', child_name: 'Child C', counselor_id: '3' },
          { _id: '4', child_name: 'Child D', counselor_id: '4' },
        ]);
      }
      setCounselors([]);
      setSelectedCounselor(undefined);
    };

    if (!loading) {
      fetchChildren();
    }
  }, [loading, currentUser]);

  useEffect(() => {
    if (selectedChild) {
      const child = children.find((c) => c._id === selectedChild._id);
      if (child && child.counselor_id) {
        const id = child.counselor_id;
        setSelectedCounselor({ id: child.counselor_id, name: `Counselor ${child.counselor_id}` });
        availableTime(id); 
      } else {
        setSelectedCounselor(undefined);
      }
    } else {
      setSelectedCounselor(undefined);
    }
  }, [selectedChild, children]);

  const goToToday = () => {
    if (calendarRef.current) {
      calendarRef.current.setSelectedDate(new Date());
    }
  };

  const handleSubmitHour = () => {
    setModalVisible(false);
  };

  const handleSubmit = () => {
    if (!selectedChild || !selectedCounselor || !selectedDate || !selectedTime) {
      Alert.alert("Missing fields", "Please fill all fields before submitting.");
      return;
    }
    const formattedDate = dayjs(selectedDate).format('DD-MM-YYYY');
    const data = { creator_id: currentUser.id, client_id: selectedChild?._id, counselor_id: selectedCounselor?.id, date: formattedDate, time: selectedTime };
    const appointmentToAdd = conversion(data);
    console.log("Appointment to add:", appointmentToAdd);

    httpAddAppointment(appointmentToAdd)
      .then(res => {
        console.log("Appointment adding", res);
        setSelectedChild(undefined);
        setSelectedCounselor(undefined);
        setSelectedDate(undefined);
        setSelectedTime('');
        setTimeout(() => {
        Alert.alert("Appointment added successfully");
        router.push('/screens/Meetings');
        }, 500);
        console.log("after alert")
        navigation.goBack();

      })
      .catch(err => {
        console.log("Error adding Appointment from client", err);
        Alert.alert("Error adding Appointment: " + (err.message || "Unknown error occurred"));
      });
    Alert.alert("Submitted", `Date: ${formattedDate}, Child: ${selectedChild?._id}, Counselor: ${selectedCounselor?.id}, time: ${selectedTime}`);
  };

  const isDateAvailable = (date: string) => {
    return availableDates.some(item => item.date === date);
  };

  // פונקציה ליצירת רשימה שחורה של תאריכים לא זמינים
  const getDatesBlacklist = () => {
    const blacklist = [];
    const startDate = dayjs();
    const endDate = dayjs().add(3, 'month');
    
    // עובר על כל התאריכים ב-3 החודשים הקרובים
    for (let current = startDate; current.isBefore(endDate); current = current.add(1, 'day')) {
      const dateString = current.format('YYYY-MM-DD');
      // אם התאריך לא זמין - מוסיף לרשימה השחורה
      if (!isDateAvailable(dateString)) {
        blacklist.push({
          start: current.toDate(),
          end: current.toDate(),
        });
      }
    }
    
    return blacklist;
  };

  // פונקציה לסטיילינג מותאם של תאריכים זמינים
  const getCustomDatesStyles = () => {
    return availableDates
      .filter(item => !dayjs(item.date).isBefore(dayjs(), 'day')) // רק תאריכים עתידיים
      .map(item => {
        const isToday = dayjs(item.date).isSame(dayjs(), 'day');
        return {
          startDate: new Date(item.date),
          endDate: new Date(item.date),
          dateNameStyle: {
            color: '#20B2AA',
            fontWeight: '600',
          },
          dateNumberStyle: {
            color: '#20B2AA',
            fontWeight: '600',
          },
          dateContainerStyle: {
            backgroundColor: '#E0F8F8',
            borderColor: isToday ? '#FFA500' : '#20B2AA', // כתום להיום
            borderWidth: isToday ? 3 : 1.5,
            borderRadius: 12,
          },
        };
      });
  };

  // סטיילים דינמיים עבור הנקודות זמינות
  const getMarkedDates = () => {
    const marked: any[] = [];
    
    availableDates.forEach(item => {
      const date = dayjs(item.date).toDate();
      const isPast = dayjs(date).isBefore(dayjs(), 'day');
      
      if (!isPast) {
        marked.push({
          date,
          dots: [{
            color: '#20B2AA',
            selectedColor: '#FFFFFF',
          }]
        });
      }
    });
    
    return marked;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Fixed Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Schedule Appointment</Text>
          <Text style={styles.headerSubtitle}>Choose your preferred date and time</Text>
        </View>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Client Selection Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Select Client</Text>
            <Menu
              visible={childMenuVisible}
              onDismiss={() => setChildMenuVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setChildMenuVisible(true)}
                  style={styles.dropdown}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownContent}>
                    <Text style={[styles.dropdownText, selectedChild && styles.dropdownTextSelected]}>
                      {selectedChild?.child_name || 'Select a client'}
                    </Text>
                    <Text style={styles.dropdownArrow}>▼</Text>
                  </View>
                </TouchableOpacity>
              }
            >
              {children.map((child) => (
                <Menu.Item
                  key={child._id}
                  onPress={() => {
                    setChildCode(child._id);
                    setChildMenuVisible(false);
                    setSelectedChild(child);
                  }}
                  title={child.child_name}
                />
              ))}
            </Menu>
          </View>

          {/* Date & Time Selection Status */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Appointment Details</Text>
            {selectedDate && selectedTime ? (
              <View style={styles.selectedInfo}>
                <View style={styles.selectedRow}>
                  <Text style={styles.selectedLabel}>Date:</Text>
                  <Text style={styles.selectedValue}>
                    {dayjs(selectedDate).format('DD-MM-YYYY')}
                  </Text>
                </View>
                <View style={styles.selectedRow}>
                  <Text style={styles.selectedLabel}>Time:</Text>
                  <Text style={styles.selectedValue}>{selectedTime}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.instructionBox}>
                <Text style={styles.instructionText}>
                  📅 Please select a date from the calendar below
                </Text>
              </View>
            )}
          </View>

          {/* Calendar Navigation Header */}
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Available Dates</Text>
            <TouchableOpacity style={styles.todayButton} onPress={goToToday}>
              <Text style={styles.todayButtonText}>Today</Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Strip */}
          <View style={styles.calendarContainer}>
            <CalendarStrip
              ref={calendarRef}
              scrollable
              style={styles.calendarStrip}
              calendarColor={'#FFFFFF'}
              calendarHeaderStyle={styles.calendarHeaderStyle}
              dateNumberStyle={styles.dateNumberStyle}
              dayNameStyle={styles.dayNameStyle}
              highlightDateNumberStyle={styles.highlightDateNumberStyle}
              highlightDateNameStyle={styles.highlightDateNameStyle}
              disabledDateNameStyle={styles.disabledDateNameStyle}
              disabledDateNumberStyle={styles.disabledDateNumberStyle}
              selectedDate={selectedDate ? new Date(selectedDate) : undefined}
              onDateSelected={handleDayPress}
              startingDate={new Date()}
              maxDate={dayjs().add(3, 'month').toDate()}
              markedDates={getMarkedDates()}
              showMonth={true}
              useIsoWeekday={false}
              leftSelector={[]}
              rightSelector={[]}
              iconLeft={null}
              iconRight={null}
              iconContainer={{}}
              calendarHeaderFormat={'MMMM YYYY'}
              calendarHeaderPosition={'above'}
              daySelectionAnimation={{
                type: 'background',
                duration: 200,
                highlightColor: '#20B2AA',
              }}
              // כל התאריכים מוגבלים כברירת מחדל
              minDate={new Date()}
              // נאפשר רק תאריכים זמינים
              datesBlacklist={getDatesBlacklist()}
              customDatesStyles={getCustomDatesStyles()}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton, 
              (!selectedChild || !selectedDate || !selectedTime) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            disabled={!selectedChild || !selectedDate || !selectedTime}
          >
            <Text style={styles.submitButtonText}>Book Appointment</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Time Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setModalVisible(false)} />
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Time</Text>
                <Text style={styles.modalSubtitle}>
                  {selectedDate ? dayjs(selectedDate).format('DD MMMM YYYY') : ''}
                </Text>
              </View>
              <ScrollView style={styles.modalContent}>
                <TimeSlotSelector 
                  selectedDate={selectedDate ? dayjs(selectedDate).format('DD-MM-YYYY') : ''} 
                  onTimeSelected={(time) => setSelectedTime(time)} 
                />
              </ScrollView>
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.modalButton} 
                  onPress={handleSubmitHour}
                >
                  <Text style={styles.modalButtonText}>Confirm Time</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


export default AddAppointmentScreen;