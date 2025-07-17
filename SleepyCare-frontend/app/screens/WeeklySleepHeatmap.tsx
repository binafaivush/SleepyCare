import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const screenWidth = Dimensions.get("window").width;
const dayWidth = (screenWidth - 60) / days.length;
const blockHeight = 10;

const parseTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const SleepGraphScreen = () => {
  const [sleepData] = useState([
    { id: "1", client_id: "123", date: new Date("2025-07-06"), bed_time: "01:00", wake_time: "02:30" },
    { id: "2", client_id: "123", date: new Date("2025-07-07"), bed_time: "03:15", wake_time: "04:30" },
    { id: "3", client_id: "123", date: new Date("2025-07-08"), bed_time: "05:00", wake_time: "06:30" },
    { id: "4", client_id: "123", date: new Date("2025-07-09"), bed_time: "07:00", wake_time: "08:00" },
    { id: "5", client_id: "123", date: new Date("2025-07-10"), bed_time: "09:00", wake_time: "08:30" },
    { id: "6", client_id: "123", date: new Date("2025-07-11"), bed_time: "11:15", wake_time: "12:00" },
    { id: "7", client_id: "123", date: new Date("2025-08-12"), bed_time: "13:00", wake_time: "12:30" },
  ]);

  const renderBlock = (entry: any, i: number, currentDay: number) => {
    const bed = parseTime(entry.bed_time);
    const wake = parseTime(entry.wake_time);
    const startDay = new Date(entry.date).getDay();
    const endDay = (startDay + (wake <= bed ? 1 : 0)) % 7;

    const blocks = [];

    // בלוק חלק ראשון – עד חצות
    if (currentDay === startDay) {
      const end = wake <= bed ? 1440 : wake;
      const partEnd = wake <= bed ? 1440 : wake;
      const height = ((partEnd - bed) / 5) * blockHeight;
      blocks.push(
        <View
          key={`${i}-start`}
          style={[
            styles.block,
            {
              left: 5,
              top: (bed / 5) * blockHeight,
              height,
              width: dayWidth - 10,
            },
          ]}
        />
      );
    }

    // בלוק חלק שני – אחרי חצות
    if (wake <= bed && currentDay === endDay && startDay !== 6) {
      const height = (wake / 5) * blockHeight;
      blocks.push(
        <View
          key={`${i}-end`}
          style={[
            styles.block,
            {
              left: 5,
              top: 0,
              height,
              width: dayWidth - 10,
            },
          ]}
        />
      );
    }

    return blocks;
  };

  const renderHour = (i: number) => {
    const totalMin = i * 5;
    const h = Math.floor(totalMin / 60);
    return totalMin % 60 === 0 ? `${String(h).padStart(2, "0")}:00` : "";
  };

  return (
    <View style={styles.container}>
      {/* <Text style = {styles.headerText}>{sleepData[0].date.getMonth() && (sleepData[0].date.getMonth()!== sleepData[6].date.getMonth()) ? {sleepData[0].date.getMonth() - sleepData[6].date.getMonth()} : sleepData[0].date.getMonth()} /{sleepData[0].date.getFullYear()}</Text> */}
      <Text style={styles.headerText}>
  {
    (sleepData[0].date.getMonth() !== sleepData[6].date.getMonth()
      ? `${sleepData[0].date.getMonth()+1} - ${sleepData[6].date.getMonth()+1}`
      : sleepData[0].date.getMonth()+1)
  }
  /
  {sleepData[0].date.getFullYear()}
</Text>

      {/* כותרת ימים */}
      <View style={styles.headerRow}>
        <View style={[styles.headerCell, { width: 60 }]} />
        {days.map((d, i) => (
          <View key={i} style={[styles.headerCell, { width: dayWidth }]}>
            <Text style={styles.headerText}>{d}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal>
        <ScrollView>
          <View style={[styles.graphRow, { flexDirection: "row" }]}>
            {/* סרגל שעות בצד שמאל */}
            <View>
              {Array.from({ length: 288 }).map((_, i) => (
                <View key={i} style={[styles.hourCell, { height: blockHeight }]}>
                  <Text style={styles.hourText}>{renderHour(i)}</Text>
                </View>
              ))}
            </View>

            {/* עמודות ימים */}
            {days.map((_, dayIdx) => (
              <View key={dayIdx} style={[styles.dayCol, { width: dayWidth }]}>
                {Array.from({ length: 288 }).map((_, i) => (
                  <View
                    key={i}
                    style={[styles.divider, { top: i * blockHeight }]}
                  />
                ))}

                {sleepData
                  .map((entry, i) => renderBlock(entry, i, dayIdx))
                  .flat()}
              </View>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 4, backgroundColor: "#fff" },
  headerRow: { flexDirection: "row", backgroundColor: "#eee" },
  headerCell: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderWidth: 0.5,
    borderColor: "#ccc",
  },
  headerText: { fontSize: 14, fontWeight: "bold" },
  graphRow: { flexDirection: "row" },
  dayCol: {
    height: 288 * blockHeight,
    borderLeftWidth: 0.5,
    borderColor: "#ccc",
    position: "relative",
  },
  divider: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#bbb",
    opacity: 0.3,
  },
  block: {
    position: "absolute",
    backgroundColor: "#3e3c4b",
    borderRadius: 4,
  },
  hourCell: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  hourText: { fontSize: 10, fontWeight: "600" },
});

export default SleepGraphScreen;
