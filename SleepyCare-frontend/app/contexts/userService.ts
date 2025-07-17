import axios from 'axios';
import { url } from '../constants';

export const deleteUserAccount = async (userId: string, authToken: string): Promise<void> => {
  try {
    const response = await axios.delete(`${url}user/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status !== 200) {
      console.log('Failed to delete account:', response.data);
      throw new Error('Failed to delete account');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
    throw error;
  }
};

export const updateUser = (userId: string, data: {
  full_name?: string;
  phone_number?: string;
  email?: string;
}): Promise<any> => {
  return axios.put(`${url}user/${userId}`, data);
};

