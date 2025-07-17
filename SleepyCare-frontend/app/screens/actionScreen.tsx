import React, { useState, useEffect } from 'react';
import {  View,  Text,  TextInput,  TouchableOpacity,  FlatList,  Alert,} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import  styles  from '../styles/action.style';

const STORAGE_KEY = '@daily_tasks';
const NOTIF_KEY = '@notifications_enabled';



type NotificationBehavior = {
  shouldShowAlert: true;
  shouldPlaySound: true;
  shouldSetBadge: false;
};

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    } as Notifications.NotificationBehavior;
  },
});


type Task = {
  text: string;
  done: boolean;
};

const ActionsScreen: React.FC = () => {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadTasks();
    loadNotificationsState();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (notificationsEnabled) {
      scheduleDailyNotification();
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [notificationsEnabled]);

  const loadTasks = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setTaskList(JSON.parse(saved));
      }
    } catch (err) {
      console.error('שגיאה בטעינת משימות', err);
    }
  };

  const saveTasks = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('שגיאה בשמירת משימות', err);
    }
  };

  const loadNotificationsState = async () => {
    try {
      const saved = await AsyncStorage.getItem(NOTIF_KEY);
      if (saved !== null) {
        setNotificationsEnabled(JSON.parse(saved));
      }
    } catch (err) {
      console.error('שגיאה בטעינת מצב התראות', err);
    }
  };

  const saveNotificationsState = async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem(NOTIF_KEY, JSON.stringify(enabled));
    } catch (err) {
      console.error('שגיאה בשמירת מצב התראות', err);
    }
  };

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('אישור התראות נדחה');
    }
  };

  const scheduleDailyNotification = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    const now = new Date();
    const nextTime = new Date();
    nextTime.setHours(10, 58, 0, 0);
    if (nextTime <= now) nextTime.setDate(nextTime.getDate() + 1);

    const secondsUntilNotification = Math.floor(
      (nextTime.getTime() - now.getTime()) / 1000
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'תזכורת יומית 🌙',
        body: 'האם סימנת את הפעולות שלך להיום?',
        sound: true,
      },
      trigger: {
        type: 'timeInterval',
        seconds: secondsUntilNotification,
        repeats: true,
      } as Notifications.TimeIntervalTriggerInput,
    });
  };

  const addTask = () => {
    if (task.trim() === '') {
      Alert.alert('אנא הזיני משימה');
      return;
    }
    const updated = [{ text: task.trim(), done: false }, ...taskList];
    setTaskList(updated);
    setTask('');
    saveTasks(updated);
  };

  const toggleDone = (index: number) => {
    const updated = [...taskList];
    updated[index].done = !updated[index].done;
    setTaskList(updated);
    saveTasks(updated);
  };

  const deleteTask = (index: number) => {
    const updated = [...taskList];
    updated.splice(index, 1);
    setTaskList(updated);
    saveTasks(updated);
  };

  const confirmTasks = () => {
    Alert.alert('תודה שהשלמת את המשימות!');
    setNotificationsEnabled(false);
    saveNotificationsState(false);
    Notifications.cancelAllScheduledNotificationsAsync();
  };

  const renderItem = ({ item, index }: { item: Task; index: number }) => (
    <View style={[styles.taskItem, item.done && styles.taskItemDone]}>
      <TouchableOpacity onPress={() => toggleDone(index)} style={styles.circle}>
        {item.done && <Text style={styles.check}>✓</Text>}
      </TouchableOpacity>

      <Text style={[styles.taskText, item.done && styles.taskDone]}>
        {item.text}
      </Text>

      <TouchableOpacity onPress={() => deleteTask(index)} style={styles.deleteCircle}>
        <FontAwesome5 name="trash-alt" size={20} color="#000000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Daily action table</Text>
        <View style={styles.titleUnderline} />
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add Action"
          placeholderTextColor="#888"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      {taskList.length === 0 && (
        <Text style={styles.emptyList}>רשימת המשימות ריקה</Text>
      )}

      <FlatList
        data={taskList}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      />

      {notificationsEnabled && taskList.length > 0 && (
        <TouchableOpacity style={styles.confirmBtn} onPress={confirmTasks}>
          <Text style={styles.confirmBtnText}>סיימתי את המשימות להיום</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ActionsScreen;
