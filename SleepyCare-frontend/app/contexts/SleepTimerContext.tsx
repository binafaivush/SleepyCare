import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode, // ✅ הוספנו את זה
} from 'react';

interface SleepTimerContextType {
  isRunning: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

const SleepTimerContext = createContext<SleepTimerContextType | undefined>(undefined);

export const SleepTimerProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  const start = () => {
    setStartTime(new Date());
    setElapsedSeconds(0);
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const reset = () => {
    stop();
    setElapsedSeconds(0);
    setStartTime(null);
  };

  return (
    <SleepTimerContext.Provider value={{ isRunning, startTime, elapsedSeconds, start, stop, reset }} >
      {children}
    </SleepTimerContext.Provider>
  );
};

export const useSleepTimerContext = () => {
  const context = useContext(SleepTimerContext);
  if (!context) throw new Error('useSleepTimerContext must be used within SleepTimerProvider');
  return context;
};
