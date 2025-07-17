import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AppointmentState = {
  Id: string;
  counselor_id: string;
  date: string;
  time: string;
};

const initialState: AppointmentState = {
  Id: '',
  counselor_id: '',
  date: '',
  time: '',
};

export const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<string>) => {
      state.Id = action.payload;
    },
    setCounselor_id: (state, action: PayloadAction<string>) => {
      state.counselor_id = action.payload;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
    },
    setTime: (state, action: PayloadAction<string>) => {
      state.time = action.payload;
    },
    resetAppointment: (state) => {
      state.Id = '';
      state.counselor_id = '';
      state.date = '';
      state.time = '';
    },
  },
});

export const { setId, setDate, setTime,setCounselor_id, resetAppointment } = appointmentSlice.actions;
export default appointmentSlice.reducer;
