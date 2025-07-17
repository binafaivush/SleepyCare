 export type SleepJournalInput = {
    date: Date;                  // התאריך שנרשמת השינה עבורו
    bed_time: string;            // שעת התחלת שינה ("22:00")
    wake_time: string;           // שעת יקיצה ("06:45")
    nap_times: number;           // כמה תנומות ביום
    wake_ups_count: number;      // כמה פעמים התעורר בלילה
    mood: string;                // מצב רוח (אפשר לבחור מרשימה)
    notes: string;               // הערות חופשיות
  };
