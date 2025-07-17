import axios from 'axios';
import { AppointmentType } from '../types/Meetings';
import {url} from '../constants';

const baseUrl = url+'appointment';

export const fetchAppointmentsByUserId = async (userId: string): Promise<{data:{appointments: AppointmentType[]}}> => {
  return axios.get(`${baseUrl}/${userId}`);

  // const now = Date.now();
  
  // return response.data.filter(
  //   (appointment: AppointmentType) =>
  //     appointment.client_id === userId && appointment.start_time > now
  // );
};

export const fetchAppointmentsByCounselorId = async (userId: string): Promise<{data:{appointments: AppointmentType[]}}> => {
  return axios.get(`${baseUrl}/counselor/${userId}`);
};

