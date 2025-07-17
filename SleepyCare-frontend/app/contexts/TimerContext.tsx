
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

type TimerType = 'sleep' | 'feeding';

interface TimerContextType {
  isRunning: boolean;
  startTime: Date | null;
  elapsedSeconds: number;
  type: TimerType | null;
  startTimer: (type: TimerType) => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);
export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [type, setType] = useState<TimerType | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const startTimer = (newType: TimerType) => {
  // חשוב שנשמור תמיד את הטייפ – גם אם הטיימר כבר רץ או נאפס
  setType(newType);

  if (isRunning) return;

  setStartTime(new Date());
  setElapsedSeconds(0);
  setIsRunning(true);
};

  const stopTimer = () => {
    if (!isRunning) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsedSeconds(0);
    setStartTime(null);
    // setType(null);
  };

  return (
    <TimerContext.Provider value={{ isRunning, startTime, elapsedSeconds, type, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimerContext = () => {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimerContext must be used within a TimerProvider');
  return context;
};
