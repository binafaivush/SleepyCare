import React, { useEffect } from "react";
import { Stack } from "expo-router";
import Toast from 'react-native-toast-message';
import { Provider as PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import { usePathname } from 'expo-router';
import type { RootState } from './store/store';

// import { TimerProvider } from "./contexts/TimerContext";
import configureNotificationHandler from "./utils/scheduleReminder";

import CounselorAppBar from './components/featurs/counselorAppBar';
import ParentAppBar from './components/common/AppBarPerentDashbord';
// import FloatingTimerButton from "./components/FloatingTimerButton";
import ReminderBanner from './components/ReminderBanner';
import FloatingSleepTimerButton from "./components/FloatingSleepTimerButton";
import FloatingFeedingTimerButton from "./components/FloatingFeadingTimerButton";
import { FeedingTimerProvider } from "./contexts/FeedingTimerContext";
import { SleepTimerProvider } from "./contexts/SleepTimerContext";

// (שאר הייבוא של מסכים ורכיבים שלא בשימוש כאן לא כלול כי הם לא בשימוש בקוד זה)

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <FeedingTimerProvider>
          <SleepTimerProvider>
          {/* <TimerProvider> */}
            <RootContent />
          {/* </TimerProvider> */}
          </SleepTimerProvider>
                    </FeedingTimerProvider>

        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

function RootContent() {
  useEffect(() => {
    configureNotificationHandler();
  }, []);

  return (
    <>
      <AppBarSwitcher />
      <Stack screenOptions={{ headerShown: false }} />
        <FloatingSleepTimerButton />
      <FloatingFeedingTimerButton />
      {/* <FloatingTimerButton /> */}
      <ReminderBanner />
      <Toast />
    </>
  );
}

function AppBarSwitcher() {
  const role = useSelector((state: RootState) => state.user.role);
  const pathname = usePathname();

  const hideAppBarRoutes = ['/screens/LoginSignup', '/screens/OpeningScreen', '/'];
  const shouldShowAppBar = !hideAppBarRoutes.includes(pathname);

  if (!shouldShowAppBar) return null;
  if (role === 'counselor') return <CounselorAppBar />;
  if (role === 'parent') return <ParentAppBar />;
  return null;
}
