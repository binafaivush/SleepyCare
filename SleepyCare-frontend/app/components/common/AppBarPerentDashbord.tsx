// import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';
import styles from '@/app/styles/AppBarPerentDashbord';
import LabeledAction from '../featurs/LabeledAction';

export default function AppBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Appbar.Header style={styles.container}>
      <LabeledAction icon="calendar-month" label="Diary" onPress={() => router.push('/screens/SleepDiary')} active={pathname === '/screens/SleepDiary'} />
      <LabeledAction icon="file-document-multiple" label="Content" onPress={() => router.push('/screens/ViewingContent')} active={pathname === '/screens/ViewingContent'} />
      <LabeledAction icon="video-account" label="Meetings" onPress={() => router.push('/screens/Meetings')} active={pathname === '/screens/Meetings'} />
      <LabeledAction icon="bell-alert" label="Reminders" onPress={() => router.push('/screens/Reminders')} active={pathname === '/screens/Reminders'} />
      <LabeledAction icon="account-circle" label="Profile" onPress={() => router.push('/screens/PersonalDetailsEditScreen')} active={pathname === '/screens/PersonalDetailsEditScreen'} />
    </Appbar.Header>
  );
}