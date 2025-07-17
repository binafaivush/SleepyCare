import { FeedingRecord } from '../types/feedingRecord.type';

export const getFeedingData = async (): Promise<FeedingRecord[]> => {
  // כאן אמורה להיות קריאה ל-API או AsyncStorage
  // זו דוגמה לנתונים מדומים:
  return [
    {
      id: '1',
      time: '2025-07-14T08:00:00',
      amount: 100,
      type: 'breastmilk',
    },
    {
      id: '2',
      time: '2025-07-14T11:30:00',
      amount: 129,
      type: 'formula',
    },
    {
      id: '3',
      time: '2025-07-14T15:00:00',
      amount: 80,
      type: 'solid',
    },
    {
        id: '3',
        time: '2025-07-14T15:00:00',
        amount: 70,
        type: 'formula',
      },
  ];
};
