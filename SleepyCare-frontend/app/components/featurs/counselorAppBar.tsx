import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';
import styles from '@/app/styles/appBar';
import LabeledAction from './LabeledAction';

export default function AppBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Appbar.Header style={styles.container}>
      {/* <Appbar.BackAction onPress={() => router.back()} /> */}
      {/* <Appbar.Content title="" /> */}
      <LabeledAction icon="calendar-month" label="meet" onPress={() => router.push('/screens/Meetings')} active={pathname === '/screens/Meetings'} />
      {/* <LabeledAction icon="clipboard-list" label="Questionnaires" onPress={() => router.push('/screens/QuestionnaireConstruction')} active={pathname === '/screens/QuestionnaireConstruction'} /> */}
      <LabeledAction icon="account-group" label="Clients" onPress={() => router.push('/screens/ClientList')} active={pathname === '/screens/ClientList'} />
      <LabeledAction icon="notebook-edit" label="Sleep Journal" onPress={() => router.push('/screens/WeeklySleepHeatmap')} />
      <LabeledAction icon="book-open-variant" label="Resources" onPress={() => router.push('/screens/ViewingContent')} active={pathname === '/screens/ViewingContent'} />
      <LabeledAction icon="bell" label="Reminders" onPress={() => router.push('/screens/CounselorReminders')} active={pathname === '/screens/CounselorReminders'} />
      <LabeledAction icon="account-circle" label="Profile" onPress={() => router.push('/screens/PersonalDetailsEditScreen')} active={pathname === '/screens/PersonalDetailsEditScreen'} />
    </Appbar.Header>
  );
}




