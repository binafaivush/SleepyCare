import axios from 'axios';
import { url } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormData, AuthResponse } from '../types/auth.types';

export const authenticationService = {
  login: async (data: FormData): Promise<AuthResponse> => {
    console.log("data", data);
    console.log("url", url);  
    
    const response = await axios.post(url+'user/auth/login', data);
        console.log('Login response:', response);

    await storeUserData(response.data);
    return response.data;
  },

  
  register: async (data: FormData): Promise<AuthResponse> => {
    const response = await axios.post(url+'user/auth/register', data);
    await storeUserData(response.data);
    return response.data;
  }
};

const storeUserData = async (data: AuthResponse) => {
  await AsyncStorage.setItem('id', data.user._id);
  await AsyncStorage.setItem('token', data.token);
  await AsyncStorage.setItem('name', data.user.full_name);
  await AsyncStorage.setItem('role', data.user.role);
};
