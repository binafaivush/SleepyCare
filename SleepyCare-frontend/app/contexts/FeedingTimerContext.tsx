import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
} from 'react';

// 🎯 מגדירים את סוג הנתונים שהקונטקסט יספק לרכיבים
interface FeedingTimerContextType {
  isRunning: boolean;          // האם הטיימר פועל
  startTime: Date | null;      // מתי התחיל הטיימר
  elapsedSeconds: number;      // כמה שניות עברו
  start: () => void;           // פונקציית התחלה
  stop: () => void;            // פונקציית עצירה
  reset: () => void;           // פונקציית איפוס
}

// 📦 יוצרים קונטקסט עם ערך התחלתי undefined
const FeedingTimerContext = createContext<FeedingTimerContextType | undefined>(undefined);

// 🧠 קומפוננטת Provider שעוטפת את האפליקציה או חלקים ממנה
export const FeedingTimerProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false);             // סטייט האם פועל
  const [startTime, setStartTime] = useState<Date | null>(null); // מתי התחיל
  const [elapsedSeconds, setElapsedSeconds] = useState(0);       // כמה זמן עבר
  const intervalRef = useRef<NodeJS.Timeout | null>(null);       // 🔁 רפרנס לאינטרוול

  // ⏱️ אפקט שמפעיל טיימר כל עוד הוא פועל
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1); // מוסיפים שנייה כל שנייה
      }, 1000);
    }

    // 🧹 ניקוי הטיימר כשמפסיקים
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // ▶️ התחלת הטיימר
  const start = () => {
    setStartTime(new Date());     // שומרים מתי התחיל
    setElapsedSeconds(0);         // מאפסים זמן קודם
    setIsRunning(true);           // מסמנים שהוא פועל
  };

  // ⏸️ עצירת הטיימר
  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 🔁 איפוס מוחלט
  const reset = () => {
    stop();
    setElapsedSeconds(0);
    setStartTime(null);
  };

  return (
    <FeedingTimerContext.Provider
      value={{ isRunning, startTime, elapsedSeconds, start, stop, reset }}>
      {children}
    </FeedingTimerContext.Provider>
  );
};

// 🧩 הוק גישה לקונטקסט, לשימוש נוח בכל רכיב
export const useFeedingTimerContext = () => {
  const context = useContext(FeedingTimerContext);
  if (!context) throw new Error('useFeedingTimerContext must be used within FeedingTimerProvider');
  return context;
};
