// import React from "react";
// import { View, Text } from "react-native";

// const SleepDiary = () => {
//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text>SleepDiary</Text>
      
//     </View>
//   );
// };


// export default SleepDiary;

import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router"; // אם את משתמשת ב-expo-router
import SendPdfButton from "./SendPdfButton"; // שימי לב למסלול הנכון
import { router } from "expo-router";
import { styles } from "../styles/sleepDiary";


const SleepDiary = () => {
  const { clientId } = useLocalSearchParams(); // מקבלת את clientId מהניווט
// import { router } from "expo-router";
// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { styles } from "../styles/sleepDiary";

// const SleepDiary = () => {

  const goToAnalitycs = () => {
    console.log("go in goToAnalitycs");
    router.push('./SleepAnalytics');

  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>SleepDiary</Text>

      {clientId && <SendPdfButton clientId={String(clientId)} />}
      <TouchableOpacity style={styles.generateButton} onPress={goToAnalitycs}>
        <Text style={styles.generateButtonText}>go to generate analytics!</Text>
      </TouchableOpacity>
    </View>

  );
};

export default SleepDiary;
