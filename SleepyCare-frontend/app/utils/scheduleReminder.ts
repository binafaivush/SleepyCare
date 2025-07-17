

import * as Notifications from 'expo-notifications';

let intervalId: NodeJS.Timeout | null = null;
let delayTimeoutId: NodeJS.Timeout | null = null;
let startTime: number = 0;


export const configureNotificationHandler = async () => {
   try {
  console.log('⚙️ מפעיל את configureNotificationHandler');
  const { status } = await Notifications.requestPermissionsAsync();
if (status !== 'granted') {
  console.log('🚫 לא ניתנה הרשאה להתראות');
  return;
}

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  Notifications.setNotificationCategoryAsync('FEEDING_REMINDER', [
    {
      identifier: 'MARK_AS_DONE',
      buttonTitle: '✅ אישור',
      options: {
        isDestructive: false,
        opensAppToForeground: false,
      },
    },
  ]).then(() => {
    console.log('✅ קטגוריית כפתור "אישור" נרשמה בהצלחה');
  });

  Notifications.addNotificationResponseReceivedListener(async (response) => {
    console.log('📲 נלחצה התראה:', response);

    if (response.actionIdentifier === 'MARK_AS_DONE') {
      console.log('✅ נלחץ כפתור אישור – עוצר תזכורות');
      await stopRepeatingReminder();
    } else {
      console.log('ℹ️ נלחצה התראה – אבל לא על כפתור "אישור"');
    }
  });
   } catch (e) {
    console.log('❌ שגיאה בהגדרת התראות', e);
  }
};

/**
 * התחלת תזכורות חוזרות, עם דיליי אופציונלי.
 */

export const startRepeatingReminder = async (
  intervalMinutes: number,//= 2,
  delayBeforeStartMinutes: number = 0
) => {
  console.log(`🚀 התחלת תזכורות חוזרות – כל ${intervalMinutes} דקות, התחלה בעוד ${delayBeforeStartMinutes} דקות`);
  
  await Notifications.cancelAllScheduledNotificationsAsync();
   stopRepeatingReminder();

  startTime = Date.now() + delayBeforeStartMinutes * 60 * 1000;

  delayTimeoutId = setTimeout(() => {
    console.log('🔔 שליחת תזכורת ראשונה...');
    sendNotification(0);

    intervalId = setInterval(() => {
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
      console.log(`🔁 תזכורת חוזרת – עברו ${elapsedMinutes} דקות`);
      sendNotification(elapsedMinutes);
    }, intervalMinutes * 60 * 1000);
  }, delayBeforeStartMinutes * 60 * 1000);
};

/**
 * שליחת התראה עם כפתור אישור.
 */
const sendNotification = async (elapsedMinutes: number) => {
  console.log(`📤 שולח התראה עם כפתור אישור – ${elapsedMinutes} דקות`);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '🍼 תזכורת להאכלה',
      body: `עברו ${elapsedMinutes} דקות מההאכלה האחרונה.`,
      sound: true,
      categoryIdentifier: 'FEEDING_REMINDER',
      sticky: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    },
    trigger: null,
  });
};

/**
 * עצירה מלאה של התזכורות החוזרות.
 */
export const stopRepeatingReminder = async () => {
  console.log('⛔ מבצע עצירה מלאה של תזכורות');

  if (intervalId) {
    clearInterval(intervalId);
    console.log('🛑 interval הופסק');
  }
  if (delayTimeoutId) {
    clearTimeout(delayTimeoutId);
    console.log('🛑 delay הופסק');
  }

  intervalId = null;
  delayTimeoutId = null;

  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log('📵 כל ההתראות שנקבעו – בוטלו');
};


export default configureNotificationHandler;
