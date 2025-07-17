import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice" 
import appointmentReducer from './appointmentSlice';
import availabilityReducer from './availabilitySlice';
import clientReducer from './clientSlice';
export const store = configureStore({
  reducer: {
    appointment: appointmentReducer,
    availability: availabilityReducer,
    user: userReducer,
    client:clientReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
