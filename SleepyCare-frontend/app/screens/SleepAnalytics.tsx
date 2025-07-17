import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Platform, findNodeHandle, UIManager } from "react-native";
import styles, { PRIMARY_COLOR } from "../styles/SleepAnalytics";
import DateTimePicker from '@react-native-community/datetimepicker';
import { SleepAnalyticsResponseType, ClientType } from "../constants"; // ודא ש-ClientType מיובא
import { httpGenerateClientAnalytics } from "../contexts/analyticsService"; // ודא שהנתיב נכון
import ClientPicker from "../components/ClientPicker"; // ייבוא רכיב ClientPicker המעודכן
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { httpGetClientsByParentId } from "../contexts/childrenService";
import BackButton from "../components/BackButton";
// import DateTimePicker from 'expo-datetimepicker';
// import * as DateTimePicker from 'expo-datetimepicker';


// דמה לתשובה מוצלחת
export const dummyAnalyticsSuccess = {
  average_sleep_hours: "0",
  average_nap_count: "0",
  summary_text: "No data available for the selected dates.",
  message: "No analytics data found."
};

// דמה לתשובת שגיאה
export const dummyAnalyticsError = {
  status: 404,
  message: "No analytics data found for this client and date range."
};

const SleepAnalyticsScreen: React.FC = () => {
  const [clientId, setClientId] = useState<string>(''); // הגדרה ל-string ריק כברירת מחדל
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [analytics, setAnalytics] = useState<SleepAnalyticsResponseType | null>(null);
  const currentUser = useSelector((state: RootState) => state.user);
  const scrollViewRef = useRef<ScrollView>(null);
  const resultRef = useRef<View>(null);

  // מצבים חדשים לניהול טעינת לקוחות
  const [clients, setClients] = useState<ClientType[]>([]);
  const [loadingClients, setLoadingClients] = useState<boolean>(true);
  const [errorClients, setErrorClients] = useState<string | null>(null);

  // טעינת לקוחות ברגע שהקומפוננטה נטענת
  useEffect(() => {
    const fetchClientsForParent = async () => {
      try {
        setLoadingClients(true);
        setErrorClients(null); // Reset previous errors
        const fetchedClients = await httpGetClientsByParentId(currentUser.id);

        if (Array.isArray(fetchedClients) && fetchedClients.length > 0) {
          setClients(fetchedClients);
          setClientId(fetchedClients[0]._id);
        } else {
          console.error("Fetched clients is not an array:", fetchedClients);
          setClients([]);
        }
      } catch (err) {
        console.error("Error fetching clients for counselor:", err);
        setErrorClients("Failed to load clients. Please try again later.");
      } finally {
        setTimeout(() => setLoadingClients(false), 1000); // Delay to avoid showing error immediately
      }
    };

    fetchClientsForParent();
  }, []); // המערך הריק מבטיח שהאפקט ירוץ רק פעם אחת לאחר הרינדור הראשוני

  const scrollToResult = () => {
    if (resultRef.current && scrollViewRef.current) {
      const resultHandle = findNodeHandle(resultRef.current);
      const scrollHandle = findNodeHandle(scrollViewRef.current);

      if (resultHandle && scrollHandle) {
        UIManager.measureLayout(
          resultHandle,
          scrollHandle,
          () => console.warn('Failed to scroll to result'),
          (x, y) => {
            scrollViewRef.current?.scrollTo({ y, animated: true });
          }
        );
      }
    }
  };

  const handleGenerateAnalytics = async () => {
    if (!clientId) {
      Alert.alert("Please select a client");
      return;
    }
    try {
      const result = await httpGenerateClientAnalytics(
        clientId,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      setAnalytics(result || dummyAnalyticsSuccess);

      setTimeout(scrollToResult, 300);
    } catch (error) {
      console.error(error);
      setAnalytics(dummyAnalyticsError);
      Alert.alert("Error generating analytics");

      setTimeout(scrollToResult, 300);
    }
  };


  // const onChangeStartDate = (event: any, selectedDate?: Date) => {
  //   setShowStartPicker(Platform.OS === 'ios');
  //   if (selectedDate) setStartDate(selectedDate);
  // };

  // const onChangeEndDate = (event: any, selectedDate?: Date) => {
  //   setShowEndPicker(Platform.OS === 'ios');
  //   if (selectedDate) setEndDate(selectedDate);
  // };

 const onChangeStartDate: (event: any, date?: Date) => void = (event, selectedDate) => {
  setShowStartPicker(Platform.OS === 'ios');
  if (selectedDate) setStartDate(selectedDate);
};

const onChangeEndDate: (event: any, date?: Date) => void = (event, selectedDate) => {
  setShowEndPicker(Platform.OS === 'ios');
  if (selectedDate) setEndDate(selectedDate);
};
  
  // Added fallback for empty analytics data
  if (analytics && !("average_sleep_hours" in analytics || "status" in analytics)) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
          No analytics data available for the selected client and date range.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
        <BackButton />
        <Text style={styles.title}>Sleep Analytics</Text>
        {/* בחירת לקוח - מותאם לרכיב ClientPicker החדש */}
        <View style={{ marginBottom: 20, backgroundColor: "F7F8FC" }}>
          {loadingClients ? (
            <Text style={{ textAlign: 'center', color: PRIMARY_COLOR }}>Loading clients...</Text>
          ) : errorClients ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorClients}</Text>
          ) : (
            <ClientPicker
              clients={clients} // מעבירים את רשימת הלקוחות
              onClientSelect={setClientId}
              selectedClientId={clientId} // מעבירים את הלקוח שנבחר כרגע
            />
          )}
        </View>

        {/* בחירת תאריכים */}
        <Text style={styles.title}>Select date range:</Text>
        {Platform.OS !== 'web' && (
          <>
            <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateButtonText}>
                Select Start Date: {startDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onChangeStartDate}
              />
            )}

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateButtonText}>
                Select End Date: {endDate.toDateString()}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onChangeEndDate}
              />
            )}
          </>
        )}

        {Platform.OS === 'web' && (
          <View>
            <Text style={styles.dateLabel}>Start Date:</Text>
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              style={styles.webDateInput}
            />
            <Text style={styles.dateLabel}>End Date:</Text>
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              style={styles.webDateInput}
            />
          </View>
        )}

        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateAnalytics}>
          <Text style={styles.generateButtonText}>Generate Analytics</Text>
        </TouchableOpacity>

        {/* תוצאות */}
        {analytics && (
          <View ref={resultRef}>
            {"average_sleep_hours" in analytics ? (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Analytics Result:</Text>
                <Text>Average Sleep Hours: {analytics.average_sleep_hours}</Text>
                <Text>Average Nap Count: {analytics.average_nap_count}</Text>
                <Text>Summary:</Text>
                <Text>{analytics.summary_text}</Text>
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Error:</Text>
                <Text>{analytics.message}</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SleepAnalyticsScreen;

// import React, { useState, useEffect, useRef } from "react";
// import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, ScrollView, Platform, findNodeHandle, UIManager } from "react-native";
// import styles, { PRIMARY_COLOR } from "../styles/SleepAnalytics";
// import DateTimePicker from 'expo-datepicker'; // ✅ תואם ל־Expo
// import { SleepAnalyticsResponseType, ClientType } from "../constants";
// import { httpGenerateClientAnalytics } from "../contexts/analyticsService";
// import ClientPicker from "../components/ClientPicker";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/store";
// import { httpGetClientsByParentId } from "../contexts/childrenService";
// import BackButton from "../components/BackButton";

// // דמה לתשובה מוצלחת
// export const dummyAnalyticsSuccess = {
//   average_sleep_hours: "0",
//   average_nap_count: "0",
//   summary_text: "No data available for the selected dates.",
//   message: "No analytics data found."
// };

// // דמה לתשובת שגיאה
// export const dummyAnalyticsError = {
//   status: 404,
//   message: "No analytics data found for this client and date range."
// };

// const SleepAnalyticsScreen: React.FC = () => {
//   const [clientId, setClientId] = useState<string>('');
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [analytics, setAnalytics] = useState<SleepAnalyticsResponseType | null>(null);
//   const currentUser = useSelector((state: RootState) => state.user);
//   const scrollViewRef = useRef<ScrollView>(null);
//   const resultRef = useRef<View>(null);

//   const [clients, setClients] = useState<ClientType[]>([]);
//   const [loadingClients, setLoadingClients] = useState<boolean>(true);
//   const [errorClients, setErrorClients] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchClientsForParent = async () => {
//       try {
//         setLoadingClients(true);
//         setErrorClients(null);
//         const fetchedClients = await httpGetClientsByParentId(currentUser.id);
//         if (Array.isArray(fetchedClients) && fetchedClients.length > 0) {
//           setClients(fetchedClients);
//           setClientId(fetchedClients[0]._id);
//         } else {
//           setClients([]);
//         }
//       } catch (err) {
//         console.error("Error fetching clients for counselor:", err);
//         setErrorClients("Failed to load clients. Please try again later.");
//       } finally {
//         setTimeout(() => setLoadingClients(false), 1000);
//       }
//     };
//     fetchClientsForParent();
//   }, []);

//   const scrollToResult = () => {
//     if (resultRef.current && scrollViewRef.current) {
//       const resultHandle = findNodeHandle(resultRef.current);
//       const scrollHandle = findNodeHandle(scrollViewRef.current);
//       if (resultHandle && scrollHandle) {
//         UIManager.measureLayout(
//           resultHandle,
//           scrollHandle,
//           () => console.warn('Failed to scroll to result'),
//           (x, y) => {
//             scrollViewRef.current?.scrollTo({ y, animated: true });
//           }
//         );
//       }
//     }
//   };

//   const handleGenerateAnalytics = async () => {
//     if (!clientId) {
//       Alert.alert("Please select a client");
//       return;
//     }
//     try {
//       const result = await httpGenerateClientAnalytics(
//         clientId,
//         startDate.toISOString().split("T")[0],
//         endDate.toISOString().split("T")[0]
//       );
//       setAnalytics(result || dummyAnalyticsSuccess);
//       setTimeout(scrollToResult, 300);
//     } catch (error) {
//       console.error(error);
//       setAnalytics(dummyAnalyticsError);
//       Alert.alert("Error generating analytics");
//       setTimeout(scrollToResult, 300);
//     }
//   };

//   if (analytics && !("average_sleep_hours" in analytics || "status" in analytics)) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>
//           No analytics data available for the selected client and date range.
//         </Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
//         <BackButton />
//         <Text style={styles.title}>Sleep Analytics</Text>

//         <View style={{ marginBottom: 20, backgroundColor: "F7F8FC" }}>
//           {loadingClients ? (
//             <Text style={{ textAlign: 'center', color: PRIMARY_COLOR }}>Loading clients...</Text>
//           ) : errorClients ? (
//             <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorClients}</Text>
//           ) : (
//             <ClientPicker
//               clients={clients}
//               onClientSelect={setClientId}
//               selectedClientId={clientId}
//             />
//           )}
//         </View>

//         <Text style={styles.title}>Select date range:</Text>

//         <View style={{ marginVertical: 10 }}>
//           <Text style={styles.dateLabel}>Start Date:</Text>
//          <DateTimePicker
//   date={startDate.toISOString().split("T")[0]}
//   onChange={(dateStr) => setStartDate(new Date(dateStr))}
//   mode="date"/>

//         </View>

//         <View style={{ marginVertical: 10 }}>
//           <Text style={styles.dateLabel}>End Date:</Text>
//          <DateTimePicker
//   date={endDate.toISOString().split("T")[0]} // ממירה את Date ל־string בפורמט ISO
//   onChange={(dateStr) => setEndDate(new Date(dateStr))} // ממירה מ־string חזרה ל־Date
//   mode="date"
// />

//         </View>

//         <TouchableOpacity style={styles.generateButton} onPress={handleGenerateAnalytics}>
//           <Text style={styles.generateButtonText}>Generate Analytics</Text>
//         </TouchableOpacity>

//         {analytics && (
//           <View ref={resultRef}>
//             {"average_sleep_hours" in analytics ? (
//               <View style={styles.resultContainer}>
//                 <Text style={styles.resultTitle}>Analytics Result:</Text>
//                 <Text>Average Sleep Hours: {analytics.average_sleep_hours}</Text>
//                 <Text>Average Nap Count: {analytics.average_nap_count}</Text>
//                 <Text>Summary:</Text>
//                 <Text>{analytics.summary_text}</Text>
//               </View>
//             ) : (
//               <View style={styles.resultContainer}>
//                 <Text style={styles.resultTitle}>Error:</Text>
//                 <Text>{analytics.message}</Text>
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SleepAnalyticsScreen;
