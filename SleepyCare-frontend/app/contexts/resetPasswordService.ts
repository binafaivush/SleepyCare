// services/authService.ts
import axios from 'axios';

import { url } from "../constants";

export const verifyResetToken = async (token: string): Promise<boolean> => {
  try {
    const response = await axios.get(`${url}/verify-reset-token`, {
      params: { token },
    });
    return response.data.valid;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
};

export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await axios.post(`${url}/reset-password`, {
      token,
      newPassword,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};
