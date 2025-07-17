import { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { reminderService } from '../contexts/reminderService';
import { Reminder } from '../types/reminder';

export const useReminders = (autoRefresh = true) => {
  const userId = useSelector((state: RootState) => state.user.id);
  const authToken = useSelector((state: RootState) => state.user.token);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReminders = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const fetchedReminders = await reminderService.getParentReminders(userId, authToken);
      // Sort reminders by time
      fetchedReminders.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      setReminders(fetchedReminders);
    } catch (e: any) {
      const errorMessage = e.message || 'An error occurred while loading reminders.';
      console.error("Failed to load reminders:", errorMessage);
      setError(errorMessage);
    } finally {
      if (!isRefresh) setLoading(false);
      else setRefreshing(false);
    }
  }, [userId, authToken]);

  useEffect(() => {
    loadReminders();
    
    if (autoRefresh) {
      // Refresh data every minute
      const intervalId = setInterval(() => {
        loadReminders(true);
      }, 60000);

      return () => clearInterval(intervalId);
    }
  }, [loadReminders, autoRefresh]);

  const onRefresh = useCallback(() => {
    loadReminders(true);
  }, [loadReminders]);

  return {
    reminders,
    loading,
    refreshing,
    error,
    loadReminders,
    onRefresh
  };
};
