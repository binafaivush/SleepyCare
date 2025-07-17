import { Reminder } from '../types/reminder';
import axios from 'axios';
import { url } from '../constants';

const API_BASE_URL = url + 'reminders';

export const reminderService = {
  async getParentReminders(userId: string, authToken: string): Promise<Reminder[]> {
    if (!userId || !authToken) {
      throw new Error("Authentication details not found");
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}/reminders`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      return response.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        time: new Date(item.time),
        description: item.description,
        zoomLink: item.zoomLink,
        clientName: item.clientName,
      }));
    } catch (error: any) {
      console.error('ReminderService Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch reminders');
    }
  },

  async getUpcomingAppointments(userId: string, authToken?: string): Promise<Reminder[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const config = {
        headers: authToken ? {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        } : {
          'Content-Type': 'application/json',
        }
      };

      console.log('Fetching appointments with config:', {
        url: `${API_BASE_URL}/appointments/upcoming/${userId}`,
        headers: config.headers
      });

      const response = await axios.get(
        `${API_BASE_URL}/appointments/upcoming/${userId}`,
        config
      );

      console.log('Appointment response:', response.data);

      return response.data.map((item: any) => ({
        id: item.id,
        title: 'Upcoming Appointment',
        time: new Date(item.start_time),
        description: item.description || '',
        zoomLink: item.zoom_link,
        clientName: item.client_name,
      }));
    } catch (error: any) {
      console.error('ReminderService Error:', error.response || error);
      throw new Error(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch upcoming appointments'
      );
    }
  }
};
